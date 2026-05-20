import os
import shutil
import logging
from pathlib import Path
from PIL import Image
import pytesseract
from docx import Document
from docx.shared import Inches
from app.engine.handlers.base import BaseHandler

logger = logging.getLogger(__name__)

class ImageHandler(BaseHandler):
    """
    Handles all image processing and conversion pathways.
    Supports standard Pillow formats, HEIC/AVIF via ImageMagick & libheif,
    direct Image-to-PDF rendering, and Tesseract-powered Image-to-DOCX OCR.
    """

    def convert(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str) -> Path:
        from_ext = from_ext.lower()
        to_ext = to_ext.lower()

        logger.info(f"ImageHandler converting {from_ext} -> {to_ext}")

        # 1. OCR Image to DOCX
        if to_ext == ".docx":
            return self._to_docx(input_path, output_path)

        # 2. Image to PDF
        if to_ext == ".pdf":
            return self._to_pdf(input_path, output_path, from_ext)

        # 3. Image-to-Image conversions (including HEIC, AVIF, GIF, JPG, PNG, WEBP)
        return self._to_image(input_path, output_path, from_ext, to_ext)

    def _to_pdf(self, input_path: Path, output_path: Path, from_ext: str) -> Path:
        """
        Converts an image directly to a high-fidelity PDF page.
        """
        temp_png = None
        try:
            # For HEIC input, decode first
            if from_ext == ".heic":
                temp_png = input_path.parent / f"{input_path.stem}_temp.png"
                cmd = ["heif-dec", str(input_path), str(temp_png)]
                self.run_subprocess(cmd, timeout=30)
                img_src = temp_png
            else:
                img_src = input_path

            img = Image.open(img_src)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            img.save(output_path, "PDF")
            logger.info(f"Successfully converted image to PDF: {output_path}")
            return output_path
        finally:
            if temp_png and temp_png.exists():
                temp_png.unlink()

    def _to_docx(self, input_path: Path, output_path: Path) -> Path:
        """
        Converts an image to an editable Word Document using Tesseract OCR.
        Falls back to embedding the original image if OCR confidence is low.
        """
        temp_png = None
        try:
            if input_path.suffix.lower() == ".heic":
                temp_png = input_path.parent / f"{input_path.stem}_temp.png"
                cmd = ["heif-dec", str(input_path), str(temp_png)]
                self.run_subprocess(cmd, timeout=30)
                ocr_src = temp_png
            else:
                ocr_src = input_path

            logger.info("Running Tesseract OCR on image...")
            img = Image.open(ocr_src)
            
            # Extract text
            try:
                extracted_text = pytesseract.image_to_string(img, timeout=45)
            except Exception as e:
                logger.warning(f"Tesseract extraction timed out or failed: {e}. Falling back to image embedding.")
                extracted_text = ""

            cleaned_text = extracted_text.strip()
            
            doc = Document()
            # If we found sufficient text, write editable DOCX
            if len(cleaned_text) > 15:
                logger.info(f"Sufficient text detected ({len(cleaned_text)} chars). Generating editable paragraphs...")
                doc.add_paragraph(f"--- OCR Extracted Text from: {input_path.name} ---")
                doc.add_paragraph("")
                for line in cleaned_text.split("\n"):
                    line_strip = line.strip()
                    if line_strip:
                        doc.add_paragraph(line_strip)
            else:
                # Scanned confidence low, embed picture directly
                logger.info("Low OCR confidence/length. Embedding picture as high-fidelity fallback.")
                doc.add_paragraph(f"--- Embedded Image: {input_path.name} ---")
                doc.add_paragraph("")
                doc.add_picture(str(ocr_src), width=Inches(6.0))

            doc.save(output_path)
            logger.info(f"DOCX created successfully: {output_path}")
            return output_path

        finally:
            if temp_png and temp_png.exists():
                temp_png.unlink()

    def _to_image(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str) -> Path:
        """
        Transforms images using ImageMagick as first-line driver,
        falling back to Pillow + libheif CLI encoding.
        """
        # Primary Pipeline: ImageMagick (handles AVIF, HEIC, and other formats natively)
        try:
            cmd = ["convert", str(input_path), str(output_path)]
            logger.info(f"Running ImageMagick: {' '.join(cmd)}")
            self.run_subprocess(cmd, timeout=30)
            if output_path.exists():
                return output_path
        except Exception as e:
            logger.warning(f"ImageMagick failed: {e}. Swapping to Pillow / libheif fallback...")

        # Secondary Pipeline: Pillow + libheif wrappers
        temp_png = None
        try:
            # 1. Decode HEIC if it's the source
            if from_ext == ".heic":
                temp_png = input_path.parent / f"{input_path.stem}_temp.png"
                cmd = ["heif-dec", str(input_path), str(temp_png)]
                self.run_subprocess(cmd, timeout=30)
                source_img = temp_png
            else:
                source_img = input_path

            # 2. Encode to HEIC if it's the target
            if to_ext == ".heic":
                if source_img == input_path:
                    # Save a temp PNG first
                    temp_png = input_path.parent / f"{input_path.stem}_temp.png"
                    img = Image.open(input_path)
                    img.save(temp_png)
                
                cmd = ["heif-enc", str(temp_png or source_img), str(output_path)]
                self.run_subprocess(cmd, timeout=30)
                return output_path

            # 3. Handle standard Pillow transformations (JPG, PNG, WEBP, GIF, AVIF)
            img = Image.open(source_img)
            
            # Format modifications for transparency loss in JPEGs
            if to_ext in [".jpg", ".jpeg"] and img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.save(output_path)
            return output_path

        finally:
            if temp_png and temp_png.exists():
                temp_png.unlink()

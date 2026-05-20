import os
import shutil
import zipfile
import logging
import re
from pathlib import Path
from PIL import Image
import pdfplumber
import camelot
from docx import Document
from docx.shared import Inches as DocxInches
from pptx import Presentation
from pptx.util import Inches, Pt
from app.engine.handlers.base import BaseHandler
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIF_PLUGIN_ENABLED = True
except Exception:
    HEIF_PLUGIN_ENABLED = False

logger = logging.getLogger(__name__)
PDF_IMAGE_RENDER_TIMEOUT_SECONDS = 300

class PDFHandler(BaseHandler):
    """
    Handles high-fidelity PDF conversions to documents, presentations,
    spreadsheets, images, text, HTML, HEIC, and packaged ZIPs.
    Integrates OCRmyPDF for scanned inputs, Camelot for table mapping,
    and python-pptx / python-docx for semantic reconstructions.
    """

    def convert(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str) -> Path:
        to_ext = to_ext.lower()
        output_dir = output_path.parent

        logger.info(f"PDFHandler converting PDF -> {to_ext}")
        pdf_source = self._normalize_pdf(input_path)

        # Detect if PDF is scanned (little to no extractable text)
        is_scanned = self._is_scanned_pdf(pdf_source)

        if is_scanned:
            logger.info("Scanned PDF detected. Triggering OCRmyPDF pipeline...")
            ocr_pdf = input_path.parent / f"{input_path.stem}_ocr.pdf"
            try:
                # OCRmyPDF will make the PDF searchable
                cmd = ["ocrmypdf", "--skip-text", str(input_path), str(ocr_pdf)]
                self.run_subprocess(cmd, timeout=120)
                if ocr_pdf.exists():
                    pdf_source = ocr_pdf
                    logger.info("OCRmyPDF completed successfully. Swapping source to OCR'd PDF.")
            except Exception as e:
                logger.warning(f"OCRmyPDF failed: {e}. Falling back to standard processing.")

        try:
            # Route to the appropriate sub-pipeline
            if to_ext == ".docx":
                return self._to_docx(pdf_source, output_path)
            elif to_ext == ".pptx":
                return self._to_pptx(pdf_source, output_path)
            elif to_ext in [".xlsx", ".csv"]:
                return self._to_spreadsheet(pdf_source, output_path, to_ext)
            elif to_ext == ".txt":
                return self._to_txt(pdf_source, output_path)
            elif to_ext in [".jpg", ".jpeg", ".png", ".webp", ".heic"]:
                return self._to_image(pdf_source, output_path, to_ext)
            elif to_ext == ".html":
                return self._to_html(pdf_source, output_path)
            elif to_ext == ".zip":
                return self._to_zip(pdf_source, output_path)
            else:
                raise ValueError(f"PDFHandler does not support target: {to_ext}")
        finally:
            # Cleanup temp OCR PDF if created
            if is_scanned and pdf_source.name.endswith("_ocr.pdf") and pdf_source.exists():
                try:
                    pdf_source.unlink()
                except Exception as e:
                    logger.warning(f"Failed to delete temp OCR PDF: {e}")
            normalized_pdf = input_path.parent / f"{input_path.stem}_normalized.pdf"
            if normalized_pdf.exists() and normalized_pdf != input_path:
                try:
                    normalized_pdf.unlink()
                except Exception:
                    pass

    def _normalize_pdf(self, input_path: Path) -> Path:
        normalized = input_path.parent / f"{input_path.stem}_normalized.pdf"
        try:
            self.run_subprocess(
                ["qpdf", "--linearize", str(input_path), str(normalized)],
                timeout=60,
            )
            if normalized.exists() and normalized.stat().st_size > 0:
                return normalized
        except Exception as e:
            logger.warning(f"qpdf normalization skipped: {e}")
        return input_path

    def _is_scanned_pdf(self, pdf_path: Path) -> bool:
        """
        Determines if a PDF is scanned by checking the ratio of extractable text to pages.
        """
        try:
            with pdfplumber.open(pdf_path) as pdf:
                total_chars = 0
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    total_chars += len(text.strip())
                    if total_chars > 100 or i >= 4:
                        break
                return total_chars < 40
        except Exception as e:
            logger.error(f"Error checking if PDF is scanned: {e}")
            return False

    def _to_docx(self, pdf_path: Path, output_path: Path) -> Path:
        """
        Extracts semantic text paragraphs and compiles an editable Word Document.
        """
        # NOTE:
        # LibreOffice PDF import can generate VML-heavy DOCX that renders as blank/black
        # in some production viewers. Use deterministic text/image reconstruction only.
        logger.info("Using deterministic PDF->DOCX reconstruction pipeline (no LibreOffice PDF import).")

        logger.info("Extracting paragraphs using pdfplumber fallback...")
        doc = Document()
        has_text = False
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    has_text = True
                    for line in text.split("\n"):
                        line_strip = line.strip()
                        if line_strip:
                            doc.add_paragraph(line_strip)
        if has_text:
            doc.save(output_path)
            return output_path

        logger.warning("No extractable text found. Building image-based DOCX fallback to avoid blank output.")
        self._pdf_pages_to_docx_images(pdf_path, output_path)
        if self._docx_has_content(output_path):
            return output_path

        raise RuntimeError("Failed to convert PDF to DOCX using available pipelines.")

    def _docx_has_content(self, docx_path: Path) -> bool:
        """
        Quick quality gate: verifies that generated DOCX contains meaningful body text
        or embedded raster image media.
        """
        try:
            with zipfile.ZipFile(docx_path, "r") as zf:
                xml = zf.read("word/document.xml").decode("utf-8", errors="ignore")
                names = [e.filename.lower() for e in zf.infolist()]
            text_nodes = re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml, flags=re.DOTALL)
            meaningful_text = "".join(text_nodes).strip()
            has_raster_media = any(
                name.startswith("word/media/") and name.endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".tif", ".tiff"))
                for name in names
            )
            # Drawing-only DOCX shells can still render as blank in some viewers.
            # Accept when we have meaningful text or concrete raster media.
            return len(meaningful_text) >= 20 or has_raster_media
        except Exception as e:
            logger.warning(f"DOCX validation check failed for {docx_path}: {e}")
            return False

    def _docx_has_problematic_vml_background(self, docx_path: Path) -> bool:
        """
        Detects a known LibreOffice PDF-import artifact where a full-page VML shape/fill
        can render as black pages in some Word viewers/editors.
        """
        try:
            with zipfile.ZipFile(docx_path, "r") as zf:
                xml = zf.read("word/document.xml").decode("utf-8", errors="ignore")

            has_vml_shape = "<v:shape" in xml
            has_black_fill_hint = ('color2="black"' in xml) or ('<v:fill' in xml and 'black' in xml)
            # If this VML artifact appears and text content is sparse, prefer fallback output.
            text_nodes = re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml, flags=re.DOTALL)
            text_len = len("".join(text_nodes).strip())
            return has_vml_shape and has_black_fill_hint and text_len < 200
        except Exception as e:
            logger.warning(f"Problematic VML detection failed for {docx_path}: {e}")
            return False

    def _pdf_pages_to_docx_images(self, pdf_path: Path, output_path: Path) -> None:
        """
        Rasterizes PDF pages and embeds them into DOCX as a non-blank fallback when
        semantic text extraction is unavailable.
        """
        temp_img_dir = pdf_path.parent / "temp_docx_images"
        temp_img_dir.mkdir(parents=True, exist_ok=True)
        try:
            cmd = ["pdftoppm", "-png", "-r", "220", str(pdf_path), str(temp_img_dir / "page")]
            self.run_subprocess(cmd, timeout=90)
            images = sorted(temp_img_dir.glob("page-*.png"))
            if not images:
                raise FileNotFoundError("No images generated for image-based DOCX fallback.")

            doc = Document()
            for idx, image_path in enumerate(images):
                if idx > 0:
                    doc.add_page_break()
                doc.add_picture(str(image_path), width=DocxInches(6.5))
            doc.save(output_path)
        finally:
            if temp_img_dir.exists():
                shutil.rmtree(temp_img_dir, ignore_errors=True)

    def _to_pptx(self, pdf_path: Path, output_path: Path) -> Path:
        """
        Converts PDF pages to PNGs, then sets each page as a full-bleed slide in a Presentation.
        """
        logger.info("Converting PDF to images for slide deck construction...")
        temp_img_dir = pdf_path.parent / "temp_pptx_images"
        temp_img_dir.mkdir(parents=True, exist_ok=True)

        try:
            # 1. Extract PDF pages to PNGs
            cmd = ["pdftoppm", "-png", "-r", "220", str(pdf_path), str(temp_img_dir / "page")]
            self.run_subprocess(cmd, timeout=60)

            extracted_images = sorted(list(temp_img_dir.glob("page-*.png")))
            if not extracted_images:
                raise FileNotFoundError("pdftoppm failed to generate page images.")

            # 2. Build presentation using python-pptx
            prs = Presentation()
            # Match slide aspect ratio to first PDF page image to reduce stretching/cropping.
            with Image.open(extracted_images[0]) as first_img:
                width_px, height_px = first_img.size
            target_height = Inches(7.5)
            target_width = int(target_height * (width_px / max(height_px, 1)))
            prs.slide_width = target_width
            prs.slide_height = target_height
            blank_slide_layout = prs.slide_layouts[6] # Blank slide layout

            for img_path in extracted_images:
                slide = prs.slides.add_slide(blank_slide_layout)
                # Add full bleed background image
                slide.shapes.add_picture(
                    str(img_path),
                    Inches(0), Inches(0),
                    width=prs.slide_width,
                    height=prs.slide_height
                )

            prs.save(output_path)
            logger.info(f"Presentation saved successfully to {output_path}")
            return output_path

        finally:
            if temp_img_dir.exists():
                shutil.rmtree(temp_img_dir)

    def _to_spreadsheet(self, pdf_path: Path, output_path: Path, to_ext: str) -> Path:
        """
        Extracts tabular datasets using Camelot, with a robust fallback to pdfplumber.
        """
        import pandas as pd
        logger.info("Extracting tables using Camelot...")
        tables_df = []

        try:
            # Camelot lattice mode (works well for bordered grids)
            tables = camelot.read_pdf(str(pdf_path), pages="all", flavor="lattice", line_scale=40)
            if not tables or len(tables) == 0:
                # Retry stream mode for borderless tables
                tables = camelot.read_pdf(str(pdf_path), pages="all", flavor="stream", row_tol=10, column_tol=10)
            
            for t in tables:
                tables_df.append(t.df)
        except Exception as e:
            logger.warning(f"Camelot table extraction failed: {e}. Trying pdfplumber fallback...")

        # Fallback to pdfplumber table extractor
        if not tables_df:
            try:
                with pdfplumber.open(pdf_path) as pdf:
                    for page in pdf.pages:
                        extracted = page.extract_tables()
                        for tbl in extracted:
                            if tbl:
                                # Clean None or empty headers
                                tables_df.append(pd.DataFrame(tbl))
            except Exception as e:
                logger.error(f"pdfplumber table extraction failed: {e}")

        # If no tables extracted, return a simple text-wrapped spreadsheet containing raw text lines
        if not tables_df:
            logger.warning("No structured tables detected. Creating a sheet with text paragraph lines.")
            paragraphs = []
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        paragraphs.extend([[line] for line in text.split("\n")])
            tables_df.append(pd.DataFrame(paragraphs, columns=["Extracted Content"]))

        # Save to XLSX or CSV
        if to_ext == ".xlsx":
            with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
                for idx, df in enumerate(tables_df):
                    sheet_name = f"Table_{idx + 1}"
                    # Excel sheet names capped at 31 chars
                    df.to_excel(writer, sheet_name=sheet_name[:30], index=False)
        else:
            # CSV - Merge all extracted tables and save
            merged = pd.concat(tables_df, ignore_index=True) if len(tables_df) > 1 else tables_df[0]
            merged.to_csv(output_path, index=False)

        logger.info(f"Spreadsheet saved successfully to {output_path}")
        return output_path

    def _to_txt(self, pdf_path: Path, output_path: Path) -> Path:
        """
        Extracts plain text.
        """
        content = []
        try:
            with pdfplumber.open(pdf_path) as pdf:
                for idx, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    if text:
                        content.append(text)
        except Exception as e:
            logger.warning(f"pdfplumber text extraction failed: {e}")

        if not content:
            try:
                txt = self.run_subprocess(
                    ["mutool", "draw", "-F", "txt", str(pdf_path)],
                    timeout=60,
                )
                if txt.strip():
                    content.append(txt.strip())
            except Exception as e:
                logger.warning(f"mutool text fallback failed: {e}")

        output_path.write_text("\n\n--- PAGE BREAK ---\n\n".join(content), encoding="utf-8")
        return output_path

    def _to_image(self, pdf_path: Path, output_path: Path, to_ext: str) -> Path:
        """
        Converts PDF to PNG/JPEG/WEBP/HEIC.
        For multi-page PDFs, returns a ZIP containing one image per page.
        """
        temp_img_dir = pdf_path.parent / "temp_pdf_images"
        temp_img_dir.mkdir(parents=True, exist_ok=True)

        try:
            # 1. Render all pages to PNG
            cmd = ["pdftoppm", "-png", "-r", "240", str(pdf_path), str(temp_img_dir / "page")]
            self.run_subprocess(cmd, timeout=PDF_IMAGE_RENDER_TIMEOUT_SECONDS)

            extracted = sorted(list(temp_img_dir.glob("page-*.png")))
            if not extracted:
                raise FileNotFoundError("pdftoppm failed to generate page images.")

            # Multi-page PDF -> ZIP package so users receive all pages.
            if len(extracted) > 1:
                zip_output = output_path.with_suffix(".zip")
                with zipfile.ZipFile(zip_output, "w", zipfile.ZIP_DEFLATED) as zf:
                    for idx, png_path in enumerate(extracted, start=1):
                        page_output_name = f"page-{idx:03d}{to_ext if to_ext != '.jpeg' else '.jpg'}"
                        if to_ext == ".png":
                            zf.write(png_path, arcname=page_output_name)
                            continue

                        if to_ext == ".heic":
                            page_img_path = temp_img_dir / page_output_name
                            try:
                                cmd = ["heif-enc", str(png_path), str(page_img_path)]
                                self.run_subprocess(cmd, timeout=30)
                            except Exception:
                                if not HEIF_PLUGIN_ENABLED:
                                    raise
                                img = Image.open(png_path)
                                if img.mode in ("RGBA", "P"):
                                    img = img.convert("RGB")
                                img.save(page_img_path, format="HEIF", quality=90)
                            zf.write(page_img_path, arcname=page_output_name)
                            continue

                        # JPEG / WEBP conversion path
                        page_img_path = temp_img_dir / page_output_name
                        img = Image.open(png_path)
                        if to_ext in [".jpg", ".jpeg"] and img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        img.save(page_img_path)
                        zf.write(page_img_path, arcname=page_output_name)
                return zip_output

            png_page = extracted[0]

            if to_ext == ".png":
                shutil.move(str(png_page), str(output_path))
            elif to_ext == ".heic":
                # Convert PNG to HEIC using heif-enc
                try:
                    cmd = ["heif-enc", str(png_page), str(output_path)]
                    self.run_subprocess(cmd, timeout=30)
                except Exception:
                    if not HEIF_PLUGIN_ENABLED:
                        raise
                    img = Image.open(png_page)
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    img.save(output_path, format="HEIF", quality=90)
            else:
                # Pillow convert for JPG, JPEG, WEBP
                img = Image.open(png_page)
                if to_ext in [".jpg", ".jpeg"] and img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                img.save(output_path)

            return output_path
        finally:
            if temp_img_dir.exists():
                shutil.rmtree(temp_img_dir)

    def _to_html(self, pdf_path: Path, output_path: Path) -> Path:
        """
        Generates layout-friendly text representation wrapped inside modern responsive HTML.
        """
        html_blocks = []
        with pdfplumber.open(pdf_path) as pdf:
            for idx, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text:
                    paragraphs = page_text.split("\n")
                    formatted = "".join(f"<p style='margin-bottom:12px;'>{p}</p>" for p in paragraphs if p.strip())
                    html_blocks.append(f"<div class='page' style='margin: 40px auto; padding: 20px; border: 1px solid #ccc; max-width: 800px; background:#fff;'><h2>Page {idx + 1}</h2>{formatted}</div>")

        body_content = "\n".join(html_blocks)
        html_template = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Converted Document - {pdf_path.stem}</title>
    <style>
        body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f9fc; color: #333; margin: 0; padding: 20px; }}
        h2 {{ color: #4F46E5; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; }}
    </style>
</head>
<body>
    {body_content}
</body>
</html>
"""
        output_path.write_text(html_template, encoding="utf-8")
        return output_path

    def _to_zip(self, pdf_path: Path, output_path: Path) -> Path:
        """
        Converts all pages of a PDF to high-fidelity images, packaging them neatly into a single ZIP.
        """
        temp_img_dir = pdf_path.parent / "temp_zip_images"
        temp_img_dir.mkdir(parents=True, exist_ok=True)

        try:
            # 1. Render all pages
            cmd = ["pdftoppm", "-png", "-r", "150", str(pdf_path), str(temp_img_dir / "page")]
            self.run_subprocess(cmd, timeout=60)

            extracted = list(temp_img_dir.glob("page-*.png"))
            if not extracted:
                raise FileNotFoundError("pdftoppm failed to extract pages.")

            # 2. Package to ZIP
            with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for img_path in sorted(extracted):
                    zip_file.write(img_path, arcname=img_path.name)

            return output_path
        finally:
            if temp_img_dir.exists():
                shutil.rmtree(temp_img_dir)

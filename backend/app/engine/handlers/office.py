import os
import shutil
import zipfile
import logging
from pathlib import Path
import pandas as pd
from app.engine.handlers.base import BaseHandler

logger = logging.getLogger(__name__)

class OfficeHandler(BaseHandler):
    """
    Handles all Office-related conversions (DOCX, PPTX, XLSX).
    Utilizes LibreOffice headless for high-fidelity conversions,
    and Pandas/openpyxl for spreadsheet mutations (CSV, JSON, XML).
    """

    def convert(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str) -> Path:
        from_ext = from_ext.lower()
        to_ext = to_ext.lower()
        output_dir = output_path.parent

        logger.info(f"OfficeHandler converting {from_ext} -> {to_ext}")

        # 1. Image Targets (JPG, PNG, WEBP, HEIC)
        # Convert Office to PDF first, then use PDFHandler to extract images
        if to_ext in [".jpg", ".jpeg", ".png", ".webp", ".heic"]:
            temp_pdf = input_path.with_suffix(".pdf")
            try:
                self._convert_with_libreoffice(input_path, temp_pdf, "pdf")
                from app.engine.handlers.pdf import PDFHandler
                pdf_h = PDFHandler()
                return pdf_h.convert(temp_pdf, output_path, ".pdf", to_ext)
            finally:
                if temp_pdf.exists():
                    try:
                        temp_pdf.unlink()
                    except Exception as e:
                        logger.warning(f"Failed to delete temp PDF: {e}")

        # 2. ZIP target
        if to_ext == ".zip":
            with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zip_file:
                zip_file.write(input_path, arcname=input_path.name)
            return output_path

        # 3. Spreadsheet mutations (XLSX -> CSV, JSON, XML, TXT, HTML)
        if from_ext == ".xlsx":
            if to_ext == ".csv":
                df = pd.read_excel(input_path)
                df.to_csv(output_path, index=False)
                return output_path
            elif to_ext == ".json":
                df = pd.read_excel(input_path)
                df.to_json(output_path, orient="records", indent=4)
                return output_path
            elif to_ext == ".xml":
                df = pd.read_excel(input_path)
                df.to_xml(output_path, index=False)
                return output_path
            elif to_ext == ".txt":
                # Convert spreadsheet to tab-delimited text
                df = pd.read_excel(input_path)
                df.to_csv(output_path, sep="\t", index=False)
                return output_path
            elif to_ext == ".html":
                df = pd.read_excel(input_path)
                df.to_html(output_path, index=False, classes="table table-striped")
                return output_path

        # 4. Standard LibreOffice conversions
        # Map target extension to LibreOffice filter formats
        format_map = {
            ".pdf": "pdf",
            ".docx": "docx",
            ".pptx": "pptx",
            ".xlsx": "xlsx",
            ".txt": "txt:Text",
            ".csv": "csv",
            ".html": "html",
        }

        lo_format = format_map.get(to_ext)
        if not lo_format:
            raise ValueError(f"No LibreOffice format mapping for target: {to_ext}")

        self._convert_with_libreoffice(input_path, output_path, lo_format)
        return output_path

    def _convert_with_libreoffice(self, input_path: Path, output_path: Path, lo_format: str):
        """
        Executes a LibreOffice headless conversion command.
        """
        temp_outdir = output_path.parent
        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            lo_format,
            "--outdir",
            str(temp_outdir),
            str(input_path),
        ]

        logger.info(f"Executing LibreOffice: {' '.join(cmd)}")
        self.run_subprocess(cmd, timeout=90)

        # LibreOffice names the output file by replacing the input suffix with the target suffix
        expected_suffix = output_path.suffix
        expected_filename = f"{input_path.stem}{expected_suffix}"
        lo_output_file = temp_outdir / expected_filename

        if lo_output_file.exists():
            if lo_output_file != output_path:
                shutil.move(str(lo_output_file), str(output_path))
            logger.info(f"LibreOffice conversion successful: {output_path}")
        else:
            # Look for any case differences or double suffixes
            possible_files = list(temp_outdir.glob(f"{input_path.stem}.*"))
            # Filter by matching target suffix
            matching_files = [f for f in possible_files if f.suffix.lower() == expected_suffix.lower()]
            if matching_files:
                shutil.move(str(matching_files[0]), str(output_path))
                logger.info(f"LibreOffice conversion successful (resolved suffix match): {output_path}")
            else:
                raise FileNotFoundError(
                    f"LibreOffice execution completed but target file was not found at {lo_output_file}"
                )

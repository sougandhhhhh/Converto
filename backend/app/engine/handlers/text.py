import csv
import json
import shutil
import logging
from pathlib import Path
from app.engine.handlers.base import BaseHandler

logger = logging.getLogger(__name__)

class TextHandler(BaseHandler):
    """
    Handles all conversions starting from plain text, markdown, or HTML sources.
    Utilizes Pandoc for document compiling, LibreOffice for PDF rendering,
    and custom structured serializers for CSV, JSON, and XML formats.
    """

    def convert(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str) -> Path:
        from_ext = from_ext.lower()
        to_ext = to_ext.lower()

        logger.info(f"TextHandler converting {from_ext} -> {to_ext}")

        # 1. Plain Text to Tabular/Structured Format (CSV, JSON, XML)
        if from_ext == ".txt":
            if to_ext == ".csv":
                return self._to_csv(input_path, output_path)
            elif to_ext == ".json":
                return self._to_json(input_path, output_path)
            elif to_ext == ".xml":
                return self._to_xml(input_path, output_path)

        # 2. Text/HTML/MD to PDF (LibreOffice behaves best for pagination & margins)
        if to_ext == ".pdf":
            return self._to_pdf(input_path, output_path)

        # 3. Standard document conversions (TXT/MD -> DOCX/HTML etc. using Pandoc)
        # Pandoc handles txt/html/md compiling beautifully
        try:
            cmd = ["pandoc", str(input_path), "-o", str(output_path)]
            logger.info(f"Running Pandoc: {' '.join(cmd)}")
            self.run_subprocess(cmd, timeout=30)
            if output_path.exists():
                return output_path
        except Exception as e:
            logger.warning(f"Pandoc failed: {e}. Falling back to LibreOffice...")

        # Fallback: LibreOffice headless
        return self._to_libreoffice(input_path, output_path, to_ext)

    def _to_pdf(self, input_path: Path, output_path: Path) -> Path:
        """
        Renders TXT, HTML, or MD directly to PDF using LibreOffice headless.
        """
        temp_dir = output_path.parent
        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(temp_dir),
            str(input_path),
        ]
        logger.info(f"Executing LibreOffice for PDF target: {' '.join(cmd)}")
        self.run_subprocess(cmd, timeout=45)

        expected_lo_file = temp_dir / f"{input_path.stem}.pdf"
        if expected_lo_file.exists():
            if expected_lo_file != output_path:
                shutil.move(str(expected_lo_file), str(output_path))
            return output_path

        raise FileNotFoundError(f"LibreOffice failed to generate PDF at {expected_lo_file}")

    def _to_libreoffice(self, input_path: Path, output_path: Path, to_ext: str) -> Path:
        """
        Fallback document compiler using LibreOffice.
        """
        format_map = {
            ".docx": "docx",
            ".html": "html",
            ".txt": "txt:Text",
        }
        lo_format = format_map.get(to_ext, "txt:Text")
        temp_dir = output_path.parent

        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            lo_format,
            "--outdir",
            str(temp_dir),
            str(input_path),
        ]
        self.run_subprocess(cmd, timeout=30)

        expected_lo_file = temp_dir / f"{input_path.stem}{to_ext}"
        if expected_lo_file.exists():
            if expected_lo_file != output_path:
                shutil.move(str(expected_lo_file), str(output_path))
            return output_path

        raise FileNotFoundError(f"LibreOffice failed to compile document to {to_ext}")

    def _to_csv(self, input_path: Path, output_path: Path) -> Path:
        """
        Intelligently parses lines of text and serializes them to standard CSV columns.
        """
        with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()

        with open(output_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.writer(f)
            for line in lines:
                cleaned = line.strip()
                if not cleaned:
                    continue
                # If the line contains delimiters, attempt parsing
                if "," in cleaned:
                    writer.writerow(cleaned.split(","))
                elif "\t" in cleaned:
                    writer.writerow(cleaned.split("\t"))
                else:
                    writer.writerow([cleaned])

        logger.info(f"Successfully compiled text to CSV: {output_path}")
        return output_path

    def _to_json(self, input_path: Path, output_path: Path) -> Path:
        """
        Converts plain text rows into clean JSON structures.
        """
        with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = [line.strip() for line in f if line.strip()]

        data = {"document": input_path.name, "lines": lines}

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

        logger.info(f"Successfully compiled text to JSON: {output_path}")
        return output_path

    def _to_xml(self, input_path: Path, output_path: Path) -> Path:
        """
        Converts text rows into well-formed XML elements.
        """
        with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()

        xml_lines = ['<?xml version="1.0" encoding="UTF-8"?>', f'<document name="{input_path.name}">']
        for idx, line in enumerate(lines):
            cleaned = line.strip()
            if cleaned:
                # Basic XML character escaping
                escaped = (
                    cleaned.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace('"', "&quot;")
                    .replace("'", "&apos;")
                )
                xml_lines.append(f'  <line id="{idx + 1}">{escaped}</line>')
        xml_lines.append("</document>")

        output_path.write_text("\n".join(xml_lines), encoding="utf-8")
        logger.info(f"Successfully compiled text to XML: {output_path}")
        return output_path

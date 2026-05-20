import os
import logging
from pathlib import Path
from app.engine.handlers.base import BaseHandler
import mammoth

logger = logging.getLogger(__name__)

class DocxSpecialHandler(BaseHandler):
    """
    Handles DOCX-specific conversions that require special processing.
    Currently provides DOCX → HTML using the `mammoth` library for clean semantic HTML output.
    """

    def convert(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str) -> Path:
        from_ext = from_ext.lower()
        to_ext = to_ext.lower()
        logger.info(f"DocxSpecialHandler converting {from_ext} -> {to_ext}")

        if from_ext == ".docx" and to_ext == ".html":
            return self._docx_to_html(input_path, output_path)
        else:
            raise ValueError(f"DocxSpecialHandler does not support conversion {from_ext} → {to_ext}")

    def _docx_to_html(self, input_path: Path, output_path: Path) -> Path:
        """Converts a DOCX file to HTML using mammoth for clean semantic markup."""
        try:
            with open(input_path, "rb") as docx_file:
                result = mammoth.convert_to_html(docx_file)
                html = result.value  # The generated HTML
                messages = result.messages  # Any warnings
                if messages:
                    logger.warning(f"Mammoth conversion warnings: {messages}")
        except Exception as e:
            logger.error(f"Mammoth conversion failed: {e}")
            raise

        # Write out the HTML file
        output_path.write_text(html, encoding="utf-8")
        logger.info(f"DOCX → HTML conversion succeeded: {output_path}")
        return output_path

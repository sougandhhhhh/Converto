from typing import Dict, Tuple, List

# Route strategy metadata used for observability and tuning.
# This documents preferred engine chain per conversion.
ROUTE_STRATEGY: Dict[Tuple[str, str], List[str]] = {
    (".pdf", ".docx"): ["pdfplumber-structured", "libreoffice-writer_pdf_import"],
    (".pdf", ".pptx"): ["pdftoppm-render", "python-pptx-compose"],
    (".pdf", ".xlsx"): ["camelot-lattice", "camelot-stream", "pdfplumber-table-fallback"],
    (".pdf", ".txt"): ["pdfplumber", "mutool-draw-text"],
    (".pdf", ".jpg"): ["pdftoppm", "pillow-encode"],
    (".pdf", ".png"): ["pdftoppm"],
    (".pdf", ".webp"): ["pdftoppm", "pillow-encode"],
    (".pdf", ".heic"): ["pdftoppm", "heif-enc", "pillow-heif"],
    (".docx", ".pdf"): ["libreoffice-filtered"],
    (".pptx", ".pdf"): ["libreoffice-filtered"],
    (".xlsx", ".pdf"): ["libreoffice-filtered"],
    (".docx", ".pptx"): ["semantic-python-fallback"],
    (".docx", ".xlsx"): ["semantic-python-fallback"],
    (".pptx", ".docx"): ["semantic-python-fallback"],
    (".pptx", ".txt"): ["semantic-python-fallback"],
    (".xlsx", ".docx"): ["semantic-python-fallback"],
    (".jpg", ".docx"): ["tesseract-tsv", "easyocr-fallback", "embed-image-fallback"],
    (".png", ".docx"): ["tesseract-tsv", "easyocr-fallback", "embed-image-fallback"],
    (".heic", ".docx"): ["heif-decode", "tesseract-tsv", "easyocr-fallback", "embed-image-fallback"],
}


def get_route_strategy(from_ext: str, to_ext: str) -> List[str]:
    return ROUTE_STRATEGY.get((from_ext.lower(), to_ext.lower()), ["default-handler-pipeline"])


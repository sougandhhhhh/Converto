import logging
from pathlib import Path
from typing import Dict, Tuple, Type

from app.engine.handlers.pdf import PDFHandler
from app.engine.handlers.office import OfficeHandler
from app.engine.handlers.image import ImageHandler
from app.engine.handlers.text import TextHandler
from app.engine.handlers.docx_special import DocxSpecialHandler

logger = logging.getLogger(__name__)

# Registry maps (source_ext, target_ext) -> handler class
# Extensions should be lowercased and include the leading dot.
REGISTRY: Dict[Tuple[str, str], Type] = {
    # PDF conversions
    (".pdf", ".docx"): PDFHandler,
    (".pdf", ".pptx"): PDFHandler,
    (".pdf", ".xlsx"): PDFHandler,
    (".pdf", ".txt"): PDFHandler,
    (".pdf", ".jpg"): PDFHandler,
    (".pdf", ".png"): PDFHandler,
    (".pdf", ".webp"): PDFHandler,
    (".pdf", ".html"): PDFHandler,
    (".pdf", ".heic"): PDFHandler,
    (".pdf", ".csv"): PDFHandler,
    (".pdf", ".zip"): PDFHandler,
    # DOCX conversions
    (".docx", ".pdf"): OfficeHandler,
    (".docx", ".txt"): OfficeHandler,
    (".docx", ".html"): DocxSpecialHandler,
    (".docx", ".xlsx"): OfficeHandler,
    (".docx", ".webp"): OfficeHandler,
    (".docx", ".jpg"): OfficeHandler,
    (".docx", ".png"): OfficeHandler,
    (".docx", ".pptx"): OfficeHandler,
    (".docx", ".zip"): OfficeHandler,
    (".docx", ".heic"): OfficeHandler,
    # PPTX conversions
    (".pptx", ".pdf"): OfficeHandler,
    (".pptx", ".docx"): OfficeHandler,
    (".pptx", ".txt"): OfficeHandler,
    (".pptx", ".jpg"): OfficeHandler,
    (".pptx", ".png"): OfficeHandler,
    (".pptx", ".webp"): OfficeHandler,
    (".pptx", ".html"): OfficeHandler,
    (".pptx", ".heic"): OfficeHandler,
    (".pptx", ".zip"): OfficeHandler,
    # XLSX conversions
    (".xlsx", ".pdf"): OfficeHandler,
    (".xlsx", ".csv"): OfficeHandler,
    (".xlsx", ".txt"): OfficeHandler,
    (".xlsx", ".html"): OfficeHandler,
    (".xlsx", ".docx"): OfficeHandler,
    (".xlsx", ".json"): OfficeHandler,
    (".xlsx", ".xml"): OfficeHandler,
    (".xlsx", ".zip"): OfficeHandler,
    (".xlsx", ".jpg"): OfficeHandler,
    (".xlsx", ".png"): OfficeHandler,
    (".xlsx", ".heic"): OfficeHandler,
    # TXT conversions
    (".txt", ".pdf"): TextHandler,
    (".txt", ".docx"): TextHandler,
    (".txt", ".html"): TextHandler,
    (".txt", ".csv"): TextHandler,
    (".txt", ".json"): TextHandler,
    (".txt", ".xml"): TextHandler,
    # Image conversions
    (".jpg", ".png"): ImageHandler,
    (".jpg", ".webp"): ImageHandler,
    (".jpg", ".pdf"): ImageHandler,
    (".jpg", ".gif"): ImageHandler,
    (".jpg", ".docx"): ImageHandler,
    (".jpg", ".heic"): ImageHandler,
    (".jpg", ".avif"): ImageHandler,
    (".png", ".jpg"): ImageHandler,
    (".png", ".webp"): ImageHandler,
    (".png", ".pdf"): ImageHandler,
    (".png", ".gif"): ImageHandler,
    (".png", ".docx"): ImageHandler,
    (".png", ".heic"): ImageHandler,
    (".png", ".avif"): ImageHandler,
    (".heic", ".jpg"): ImageHandler,
    (".heic", ".png"): ImageHandler,
    (".heic", ".webp"): ImageHandler,
    (".heic", ".pdf"): ImageHandler,
    (".heic", ".gif"): ImageHandler,
    (".heic", ".docx"): ImageHandler,
    (".heic", ".avif"): ImageHandler,
}

def get_handler(from_ext: str, to_ext: str):
    key = (from_ext.lower(), to_ext.lower())
    handler_cls = REGISTRY.get(key)
    if not handler_cls:
        raise ValueError(f"Unsupported conversion: {from_ext} → {to_ext}")
    return handler_cls()

def register_handler(src_ext: str, tgt_ext: str, handler_instance) -> None:
    """Register a handler instance for a source-target conversion.
    Stores the handler's class in the REGISTRY mapping.
    """
    key = (src_ext.lower(), tgt_ext.lower())
    REGISTRY[key] = handler_instance.__class__
    logger.debug(f"Registered handler for {src_ext}->{tgt_ext}: {handler_instance.__class__.__name__}")

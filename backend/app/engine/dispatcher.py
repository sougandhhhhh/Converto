import logging
from pathlib import Path
from app.engine.registry import get_handler, register_handler
from app.engine.strategy import get_route_strategy

logger = logging.getLogger(__name__)

# Flag to prevent multiple initializations
_INITIALIZED = False

def init_dispatcher():
    """
    Initializes and registers all modular handlers.
    This resolves cyclic imports by loading them dynamically.
    """
    global _INITIALIZED
    if _INITIALIZED:
        return
        
    logger.info("Initializing conversion registry and mapping pipelines...")
    
    # Lazy imports to prevent circular references
    from app.engine.handlers.office import OfficeHandler
    from app.engine.handlers.pdf import PDFHandler
    from app.engine.handlers.image import ImageHandler
    from app.engine.handlers.text import TextHandler
    from app.engine.handlers.docx_special import DocxSpecialHandler
    
    # 1. Instantiate handlers
    office_h = OfficeHandler()
    pdf_h = PDFHandler()
    image_h = ImageHandler()
    text_h = TextHandler()
    docx_spec_h = DocxSpecialHandler()
    
    # 2. Register Office conversions (DOCX/PPTX/XLSX -> PDF)
    for ext in [".docx", ".doc", ".odt", ".pptx", ".ppt", ".xlsx", ".xls"]:
        register_handler(ext, ".pdf", office_h)
        
    # 3. Register PDF targets
    pdf_targets = [".docx", ".pptx", ".xlsx", ".txt", ".jpg", ".png", ".webp", ".html", ".heic", ".csv", ".zip"]
    for target in pdf_targets:
        register_handler(".pdf", target, pdf_h)
        
    # 4. Register DOCX targets (other than DOCX->PDF)
    docx_targets = [".txt", ".html", ".xlsx", ".webp", ".csv", ".jpg", ".png", ".pptx", ".zip", ".heic"]
    for target in docx_targets:
        if target == ".html":
            register_handler(".docx", target, docx_spec_h)
        else:
            register_handler(".docx", target, office_h)
            
    # 5. Register PPTX targets (other than PPTX->PDF)
    pptx_targets = [".docx", ".txt", ".jpg", ".png", ".webp", ".html", ".heic", ".zip"]
    for target in pptx_targets:
        register_handler(".pptx", target, office_h)
        
    # 6. Register XLSX targets (other than XLSX->PDF)
    xlsx_targets = [".csv", ".txt", ".html", ".docx", ".json", ".xml", ".zip", ".jpg", ".png", ".heic"]
    for target in xlsx_targets:
        register_handler(".xlsx", target, office_h)
        
    # 7. Register TXT targets (and HTML/MD to other formats)
    txt_targets = [".pdf", ".docx", ".html", ".csv", ".json", ".xml"]
    for target in txt_targets:
        register_handler(".txt", target, text_h)
    register_handler(".md", ".pdf", text_h)
    register_handler(".html", ".pdf", text_h)
    
    # 8. Register Image-to-Image / OCR targets
    image_formats = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".avif"]
    for src in image_formats:
        for tgt in image_formats:
            if src != tgt:
                register_handler(src, tgt, image_h)
        # Register image-to-PDF & OCR image-to-DOCX
        register_handler(src, ".pdf", image_h)
        register_handler(src, ".docx", image_h)

    _INITIALIZED = True
    logger.info("All 72+ conversion pipelines successfully mapped in the registry!")

def dispatch_conversion(input_path: Path, output_dir: Path, from_ext: str, to_ext: str) -> Path:
    """
    Triggers the appropriate conversion engine handler for the requested formats.
    """
    # Make sure registry is populated
    init_dispatcher()
    
    from_ext = from_ext.lower()
    to_ext = to_ext.lower()
    
    logger.info(f"Dispatching conversion: {input_path.name} ({from_ext.upper()} -> {to_ext.upper()})")
    logger.info("Route strategy: %s", " -> ".join(get_route_strategy(from_ext, to_ext)))
    
    # Resolve the handler
    handler = get_handler(from_ext, to_ext)
    
    # Define standard clean output file name
    clean_name = input_path.stem
    output_filename = f"{clean_name}{to_ext}"
    output_path = output_dir / output_filename
    
    # Execute conversion
    result_path = handler.convert(input_path, output_path, from_ext, to_ext)
    
    if not result_path or not result_path.exists():
        raise FileNotFoundError(f"Conversion engine failed to produce output file: {output_filename}")
        
    logger.info(f"Conversion completed successfully. Output saved to: {result_path}")
    return result_path

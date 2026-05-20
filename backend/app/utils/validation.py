import re
import mimetypes
from pathlib import Path
from fastapi import HTTPException, status
from app.config import MAX_FILE_SIZE_MB

# Standard format-to-mime map
MIME_MAP = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".ppt": "application/vnd.ms-powerpoint",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xls": "application/vnd.ms-excel",
    ".csv": "text/csv",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".heic": "image/heic",
    ".html": "text/html",
    ".md": "text/markdown",
    ".zip": "application/zip",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".ods": "application/vnd.oasis.opendocument.spreadsheet",
    ".gif": "image/gif",
    ".json": "application/json",
    ".xml": "application/xml",
    ".avif": "image/avif"
}

def sanitize_filename(filename: str) -> str:
    """
    Sanitizes filenames to prevent path traversal and shell injection.
    Only allows letters, numbers, hyphens, underscores, spaces, and single dots.
    """
    # Extract only the base filename
    base_name = Path(filename).name
    
    # Strip dangerous characters
    cleaned = re.sub(r"[^\w\s\.-]", "", base_name)
    cleaned = cleaned.replace(" ", "_")
    
    if not cleaned:
        return f"file_{hash(filename)}"
    return cleaned

def validate_file(filename: str, file_size: int, content_type: str = None):
    """
    Validates file extensions, size limits, and sanitizes filenames.
    """
    # Size check
    if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_MB}MB."
        )
        
    ext = Path(filename).suffix.lower()
    
    # Extension validation
    if ext not in MIME_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format: {ext}"
        )
        
    return sanitize_filename(filename), ext

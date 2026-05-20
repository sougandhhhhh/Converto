import os
from pathlib import Path

# Base directory of the project (backend folder)
BASE_DIR = Path(__file__).resolve().parent.parent

# Directories for temporary uploads and outputs (shared volume used by backend and worker)
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(BASE_DIR / "shared" / "uploads")))
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", str(BASE_DIR / "shared" / "outputs")))

# Ensure directories exist at startup
for _dir in (UPLOAD_DIR, OUTPUT_DIR):
    _dir.mkdir(parents=True, exist_ok=True)

# Redis broker URL for Celery
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Validation limits
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
FILE_RETENTION_MINUTES = int(os.getenv("FILE_RETENTION_MINUTES", "30"))

# Misc settings
ALLOWED_EXTENSIONS = {
    "pdf", "docx", "pptx", "xlsx", "txt", "jpg", "jpeg", "png", "heic", "webp", "gif", "avif",
}

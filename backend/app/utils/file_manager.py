import shutil
import time
import uuid
import logging
from pathlib import Path
from app.config import UPLOAD_DIR, OUTPUT_DIR, FILE_RETENTION_MINUTES

logger = logging.getLogger(__name__)

def create_temp_workspace() -> Path:
    """
    Creates a sandboxed unique folder for secure processing of conversion assets.
    """
    unique_id = uuid.uuid4().hex
    workspace = UPLOAD_DIR / unique_id
    workspace.mkdir(parents=True, exist_ok=True)
    return workspace

def cleanup_workspace(workspace_dir: Path):
    """
    Safely deletes a sandboxed workspace directory after a conversion completes or fails.
    """
    if workspace_dir.exists() and workspace_dir.is_dir():
        try:
            shutil.rmtree(workspace_dir)
            logger.info(f"Cleaned up workspace directory: {workspace_dir}")
        except Exception as e:
            logger.error(f"Failed to delete directory {workspace_dir}: {e}")

def run_garbage_collection():
    """
    Iterates through the uploads and outputs directories, purging files that
    exceed the configured FILE_RETENTION_MINUTES.
    """
    now = time.time()
    retention_sec = FILE_RETENTION_MINUTES * 60
    
    for directory in [UPLOAD_DIR, OUTPUT_DIR]:
        if not directory.exists():
            continue
            
        for path in directory.iterdir():
            # Skip standard folders
            if path.name in [".", ".."]:
                continue
                
            try:
                # Check modification time
                mtime = path.stat().st_mtime
                if (now - mtime) > retention_sec:
                    if path.is_dir():
                        shutil.rmtree(path)
                    else:
                        path.unlink()
                    logger.info(f"Garbage collector deleted expired asset: {path}")
            except Exception as e:
                logger.error(f"Error purging expired asset {path}: {e}")

import subprocess
import logging
import time
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)

class BaseHandler:
    """
    Abstract base class for all modular conversion handlers.
    Provides standard helper utilities for executing OS commands safely.
    """
    
    def convert(self, input_path: Path, output_path: Path, from_ext: str, to_ext: str, quality: str = "fast") -> Path:
        """
        Executes the conversion from from_ext to to_ext.
        Should return the path of the generated target file.
        """
        raise NotImplementedError("Each conversion handler must implement the 'convert' method.")

    def run_subprocess(self, cmd: List[str], timeout: int = 60, cwd: Path = None) -> str:
        """
        Safely executes a system command using subprocess with timeout protections.
        """
        logger.info(f"Running system command: {' '.join(cmd)}")
        start_time = time.time()
        
        try:
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=timeout,
                cwd=str(cwd) if cwd else None
            )
            
            elapsed = time.time() - start_time
            logger.info(f"Command completed in {elapsed:.2f}s with return code {result.returncode}")
            
            if result.returncode != 0:
                error_msg = f"Command failed: {result.stderr or result.stdout}"
                logger.error(error_msg)
                raise RuntimeError(error_msg)
                
            return result.stdout
            
        except subprocess.TimeoutExpired as e:
            logger.error(f"Command execution timed out after {timeout} seconds: {e}")
            raise TimeoutError(f"Conversion process timed out after {timeout} seconds.")
        except Exception as e:
            logger.error(f"Subprocess execution error: {e}")
            raise

import os
from pathlib import Path

from app.celery_app import celery_app
from app.config import OUTPUT_DIR
from app.engine.dispatcher import dispatch_conversion, init_dispatcher


@celery_app.task(name="convert_file")
def convert_file(input_path_str: str, target_ext: str, quality: str = "fast") -> str:
    """Celery task to convert a file to the desired format.

    Parameters
    ----------
    input_path_str: str
        Absolute path to the uploaded source file.
    target_ext: str
        Desired output file extension (including leading dot, e.g., ".pdf").

    Returns
    -------
    str
        Absolute path to the generated output file.
    """
    # Ensure dispatcher registry is ready
    init_dispatcher()

    input_path = Path(input_path_str)
    # Use the shared output directory defined in config
    output_dir = Path(OUTPUT_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Run the conversion pipeline
    result_path = dispatch_conversion(input_path, output_dir, input_path.suffix, target_ext, quality)

    # Return the string representation for the API layer
    return str(result_path)

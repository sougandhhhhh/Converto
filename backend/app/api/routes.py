from pathlib import Path
from uuid import uuid4
from typing import Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, status
from fastapi.responses import JSONResponse, FileResponse
from celery.result import AsyncResult

from app.celery_app import celery_app
from app.tasks import convert_file
from app.config import UPLOAD_DIR, OUTPUT_DIR, MAX_FILE_SIZE_MB
from app.utils.validation import validate_file, sanitize_filename
from app.utils.file_manager import run_garbage_collection

router = APIRouter()
USE_CELERY = False
SYNC_TASKS: Dict[str, Dict[str, Any]] = {}

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)):
    # Read file content
    contents = await file.read()
    # Validate size and extension
    validate_file(file.filename, len(contents), file.content_type)
    safe_name = sanitize_filename(file.filename)
    file_path = UPLOAD_DIR / safe_name
    # Ensure unique filename
    counter = 1
    while file_path.exists():
        stem = Path(safe_name).stem
        suffix = Path(safe_name).suffix
        file_path = UPLOAD_DIR / f"{stem}_{counter}{suffix}"
        counter += 1
    with open(file_path, "wb") as f:
        f.write(contents)
    return {"file_id": file_path.name}

@router.post("/convert")
async def request_conversion(file_id: str, target_ext: str, background_tasks: BackgroundTasks):
    input_path = UPLOAD_DIR / file_id
    if not input_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded file not found")
    if not target_ext.startswith('.'):
        target_ext = f'.{target_ext}'
    if USE_CELERY:
      task = convert_file.delay(str(input_path), target_ext)
      # Optionally schedule cleanup of temp workspace after some time
      background_tasks.add_task(run_garbage_collection)
      return {"task_id": task.id}

    # Free-tier sync fallback: run conversion inline and cache task-like result.
    task_id = str(uuid4())
    SYNC_TASKS[task_id] = {"status": "PROCESSING"}
    try:
      output_path = convert_file.run(str(input_path), target_ext)
      SYNC_TASKS[task_id] = {"status": "SUCCESS", "output_path": output_path}
    except Exception as exc:
      SYNC_TASKS[task_id] = {"status": "FAILURE", "error": str(exc)}
    background_tasks.add_task(run_garbage_collection)
    return {"task_id": task_id}

@router.get("/status/{task_id}")
async def get_status(task_id: str):
    if task_id in SYNC_TASKS:
        task = SYNC_TASKS[task_id]
        response = {"status": task.get("status", "PENDING")}
        if task.get("status") == "SUCCESS":
            response["output_path"] = task.get("output_path")
        elif task.get("status") == "FAILURE":
            response["error"] = task.get("error", "Conversion failed")
        return JSONResponse(content=response)

    result = AsyncResult(task_id, app=celery_app)
    response = {"status": result.status}
    if result.successful():
        response["output_path"] = result.result
    elif result.failed():
        response["error"] = str(result.result)
    return JSONResponse(content=response)

@router.get("/download/{task_id}")
async def download_result(task_id: str):
    if task_id in SYNC_TASKS:
        task = SYNC_TASKS[task_id]
        if task.get("status") != "SUCCESS":
            raise HTTPException(status_code=404, detail="Result not ready or conversion failed")
        output_path = Path(task["output_path"])
        if not output_path.exists():
            raise HTTPException(status_code=404, detail="Converted file not found")
        return FileResponse(path=output_path, filename=output_path.name, media_type="application/octet-stream")

    result = AsyncResult(task_id, app=celery_app)
    if not result.successful():
        raise HTTPException(status_code=404, detail="Result not ready or conversion failed")
    output_path = Path(result.result)
    if not output_path.exists():
        raise HTTPException(status_code=404, detail="Converted file not found")
    return FileResponse(path=output_path, filename=output_path.name, media_type="application/octet-stream")

@router.post("/cleanup")
async def trigger_cleanup(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_garbage_collection)
    return {"detail": "Cleanup scheduled"}

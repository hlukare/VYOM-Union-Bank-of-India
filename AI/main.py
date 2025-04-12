from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from celery.result import AsyncResult
from worker import process_task  # Import Celery task
import subprocess
import uvicorn

app = FastAPI()

# Store task results locally for testing
task_results = {}

class RequestData(BaseModel):
    uid: str
    video_url: str

class ResultData(BaseModel):
    uid: str
    category: str
    subcategory: str
    transcribed_text: str

@app.post("/process")
async def process_video(request: RequestData):
    """Enqueues a Celery task for processing."""
    if not request.uid or not request.video_url:
        raise HTTPException(status_code=422, detail="Missing UID or Video URL")

    # Enqueue Celery task
    task = process_task.delay(request.uid, request.video_url)
    
    return {"message": "Request received and queued", "task_id": task.id, "uid": request.uid}

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    """Fetches the status of a Celery task."""
    task_result = AsyncResult(task_id)

    if task_result.state == "PENDING":
        return {"task_id": task_id, "status": "Processing"}
    elif task_result.state == "FAILURE":
        return {"task_id": task_id, "status": "Failed"}
    elif task_result.state == "SUCCESS":
        return {"task_id": task_id, "status": "Completed", "result": task_result.result}
    else:
        return {"task_id": task_id, "status": task_result.state}

@app.post("/results")
async def receive_results(result: ResultData):
    """Receives processed results from Celery and stores them."""
    task_results[result.uid] = {
        "category": result.category,
        "subcategory": result.subcategory,
        "transcribed_text": result.transcribed_text,
    }
    print(f"Task Results for UID {result.uid}: {task_results[result.uid]}")
    return {"message": "Results received", "uid": result.uid}

@app.get("/results/{uid}")
async def get_results(uid: str):
    """Retrieves processed results."""
    if uid not in task_results:
        raise HTTPException(status_code=404, detail="Results not found")
    return {"uid": uid, **task_results[uid]}

if __name__ == "__main__":
    # Start Celery Worker in the background
    celery_process = subprocess.Popen(["celery", "-A", "celery_config.celery_app", "worker", "--loglevel=info", "--concurrency=1", "-Q", "video_tasks"])

    try:
        uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
    finally:
        celery_process.terminate()

from flask import Flask, request, jsonify
from celery.result import AsyncResult
from worker import process_task  # Import Celery task
import subprocess
import os

app = Flask(__name__)

# Store task results locally for testing
task_results = {}

def start_celery_worker():
    """Starts the Celery worker in the background."""
    return subprocess.Popen(["celery", "-A", "celery_config.celery_app", "worker", "--loglevel=info", "--concurrency=1", "-Q", "video_tasks"])

@app.route("/process", methods=["POST"])
def process_video():
    data = request.get_json()
    uid = data.get("uid")
    video_url = data.get("video_url")
    
    if not uid or not video_url:
        return jsonify({"error": "Missing UID or Video URL"}), 422
    
    # Enqueue Celery task
    task = process_task.delay(uid, video_url)
    return jsonify({"message": "Request received and queued", "task_id": task.id, "uid": uid})

@app.route("/status/<task_id>", methods=["GET"])
def get_status(task_id):
    task_result = AsyncResult(task_id)
    if task_result.state == "PENDING":
        return jsonify({"task_id": task_id, "status": "Processing"})
    elif task_result.state == "FAILURE":
        return jsonify({"task_id": task_id, "status": "Failed"})
    elif task_result.state == "SUCCESS":
        return jsonify({"task_id": task_id, "status": "Completed", "result": task_result.result})
    return jsonify({"task_id": task_id, "status": task_result.state})

@app.route("/results", methods=["POST"])
def receive_results():
    data = request.get_json()
    uid = data.get("uid")
    
    task_results[uid] = {
        "category": data.get("category"),
        "subcategory": data.get("subcategory"),
        "transcribed_text": data.get("transcribed_text"),
    }
    return jsonify({"message": "Results received", "uid": uid})

if __name__ == "__main__":
    print("Starting Flask server...")  # Debugging print
    app.run(host="127.0.0.1", port=8000, debug=True)

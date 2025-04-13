from flask import Flask, request, jsonify
import json
import os
import requests
from dotenv import load_dotenv
from query import extract_and_transcribe
from classify import classify_query
from request_priority import set_priority
from generate_priority import generate_priority
from generate_ticket import generate_ticket
from roles import classify_role  # Importing role classification logic
import queue
import threading
import time

# Load environment variables
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is not set. Check your .env file.")

app = Flask(__name__)

DEMO_SERVER_URL = os.environ.get("DEMO_SERVER_URL", "http://localhost:3000")
request_queue = queue.PriorityQueue()
processing_active = True

def determine_request_priority(data):
    cibil_score = data.get('cibil_score', 0)
    holdings = data.get('holdings', 0)
    annual_income = data.get('annual_income', 0)
    query_level = data.get('query_level', 'branch')
    
    if query_level == 'central' or cibil_score >= 800 or holdings >= 1000000 or annual_income >= 1000000:
        return 1
    elif cibil_score >= 700 or holdings >= 500000 or annual_income >= 500000:
        return 2
    return 3

def process_request_worker():
    with app.app_context():
        while processing_active:
            try:
                priority, timestamp, data, response_callback = request_queue.get(timeout=1)
                app.logger.info(f"Processing request with priority {priority}, query_id: {data.get('query_id')}")

                try:
                    result = process_query_internal(data)
                    response_callback(result)
                except Exception as e:
                    app.logger.error(f"Error processing request: {str(e)}")
                    response_callback({"success": False, "message": str(e)})
                finally:
                    request_queue.task_done()
            except queue.Empty:
                continue

def process_query_internal(data):
    try:
        query_id = data.get('query_id')
        query_type = data.get('query_type')
        query_text = ""
        classification_result = {}
        has_error = False
        error_message = ""

        if query_type == 'text':
            query_text = data.get('user_input', '')
            classification_result = classify_query(query_text)
        elif query_type == 'video':
            video_url = data.get('video_url', '')
            if not video_url:
                return {"success": False, "message": "Provide video link too"}
            try:
                query_text = extract_and_transcribe(video_url)
                classification_result = classify_query(query_text)
            except Exception as e:
                error_message = str(e)
                query_text = f"Error in transcription: {error_message}"
                has_error = True
                classification_result = {
                    "department": "", "service_type": "", "request_category": "", 
                    "detected_language": "en", "translated_query": ""
                }
        elif query_type == 'predefined_option':
            query_text = data.get('predefined_option', '')
            classification_result = classify_query(query_text)
        else:
            return {"success": False, "message": "Invalid query type"}

        priority_result = generate_priority(
            data.get('cibil_score'),
            data.get('holdings'),
            data.get('annual_income'),
            data.get('loans'),
            query_text
        )

        # Classifying Role
        role_data = classify_role(classification_result.get('department', ''), query_type)

        ticket = generate_ticket(
            # query_id=query_id,
            # query_type=query_type,
            # branch_id=data.get('branch_id'),
            # query_level=data.get('query_level'),
            # department=classification_result.get('department', ''),
            # service_type=classification_result.get('service_type', ''),
            # request_category=classification_result.get('request_category', ''),
            transcribed_text=query_text,
            translated_query=classification_result.get('translated_query', ''),
            detected_language=classification_result.get('detected_language', ''),
            # priority=priority_result.get('priority', ''),
            success=not has_error,
            error_message=error_message if has_error else None,
            # role_name=role_data["role_name"],
            # role_level=role_data["role_level"],
            # branch_level=role_data["branch_level"]
        )

        # ticket["created_at"] = time.strftime("%Y-%m-%dT%H:%M:%S") + f".{int(time.time() % 1 * 1000000):06d}"
        # ticket["last_updated_at"] = ticket["created_at"]

        response_payload = {
            # "message": "Received ticket",
            "ticket": ticket
        }
        return response_payload
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.route('/process_query', methods=['POST'])
def process_query():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Invalid JSON format"}), 400

        priority = determine_request_priority(data)
        timestamp = time.time()
        response_event = threading.Event()
        response_container = {}

        def store_response(response):
            if isinstance(response, dict):
                response_container['data'] = response
            else:
                response_container['data'] = response.get_json() if hasattr(response, 'is_json') and response.is_json else {"success": False, "message": "Invalid response format"}
            response_event.set()

        request_queue.put((priority, timestamp, data, store_response))
        response_event.wait(timeout=360)

        return jsonify(response_container.get('data', {"success": False, "message": "Processing timeout"}))
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running", "queue_size": request_queue.qsize()})

def cleanup():
    global processing_active
    processing_active = False
    worker_thread.join(timeout=5)
    app.logger.info("Worker thread stopped")

import atexit
atexit.register(cleanup)

if __name__ == '__main__':
    worker_thread = threading.Thread(target=process_request_worker, daemon=True)
    worker_thread.start()
    app.run(debug=True, port=5000)

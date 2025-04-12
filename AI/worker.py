import os
import logging
import requests
import gdown
from moviepy import VideoFileClip
from faster_whisper import WhisperModel
from celery_config import celery_app
import classify

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

AUDIO_FILE_PATH = "temp_audio.wav"

def download_video(video_url, output_path):
    """Downloads a video from a Google Drive or direct URL using gdown."""
    try:
        logging.info(f"Downloading video from {video_url}...")
        gdown.download(video_url, output_path, quiet=False)
        if os.path.exists(output_path) and os.path.getsize(output_path) > 100 * 1024:  # Ensuring file is valid
            logging.info(f"Video downloaded successfully: {output_path}")
            return True
        else:
            logging.error("Downloaded video is too small or invalid.")
            return False
    except Exception as e:
        logging.error(f"Error downloading video: {e}")
        return False

def transcribe_audio(video_path):
    """Extracts and transcribes audio from a video using Whisper."""
    try:
        logging.info("Extracting audio from video...")
        video = VideoFileClip(video_path)
        if not video.audio:
            logging.error("No audio found in the video.")
            return None
        
        video.audio.write_audiofile(AUDIO_FILE_PATH, codec="pcm_s16le", fps=16000)
        logging.info("Audio extracted successfully.")

        logging.info("Running Whisper for transcription...")
        model = WhisperModel("medium", compute_type="int8")
        segments, _ = model.transcribe(AUDIO_FILE_PATH)

        if not segments:
            logging.error("No transcription available.")
            return None

        transcribed_text = " ".join(segment.text for segment in segments).strip()
        return transcribed_text
    except Exception as e:
        logging.error(f"Error in transcribing audio: {e}")
        return None
    finally:
        if os.path.exists(AUDIO_FILE_PATH):
            os.remove(AUDIO_FILE_PATH)
            logging.info(f"Deleted temporary audio file: {AUDIO_FILE_PATH}")

def send_results(result, endpoint_url):
    """Sends the processed results to an API endpoint via POST request."""
    try:
        logging.info(f"Sending results for UID={result['uid']} to {endpoint_url}...")
        response = requests.post(endpoint_url, json=result, timeout=10)

        if response.status_code == 200:
            logging.info("Results sent successfully.")
            return response.json()
        else:
            logging.error(f"Failed to send results. Status: {response.status_code}, Response: {response.text}")
            return {"error": "Failed to send results"}
    
    except requests.exceptions.RequestException as e:
        logging.error(f"Error in sending results: {e}")
        return {"error": str(e)}

@celery_app.task(bind=True, queue="video_tasks")
def process_task(self, uid, video_url):
    """Processes a video by downloading, transcribing, and classifying."""
    logging.info(f"Starting processing for UID={uid}")

    # Step 1: Download video
    video_path = f"temp_{uid}.mp4"
    if not download_video(video_url, video_path):
        return {"uid": uid, "error": "Failed to download video"}

    # Step 2: Transcribe audio
    transcribed_text = transcribe_audio(video_path)
    if not transcribed_text:
        return {"uid": uid, "error": "Failed to transcribe audio"}

    # Step 3: Classify text
    try:
        logging.info("Running Mistral AI for classification...")
        classification_result = classify.classify_text(transcribed_text)
    except Exception as e:
        logging.error(f"Error in classification: {e}")
        return {"uid": uid, "error": "Classification failed"}

    # Step 4: Cleanup temporary files
    if os.path.exists(video_path):
        os.remove(video_path)
        logging.info(f"Deleted temporary video file: {video_path}")

    result = {
        "uid": uid,
        "category": classification_result.get("category", "Unknown"),
        "subcategory": classification_result.get("subcategory", "Unknown"),
        "transcribed_text": transcribed_text
    }
    
    # Send results to FastAPI server
    endpoint_url = "http://127.0.0.1:8000/results"
    send_results(result, endpoint_url)

    logging.info(f"Completed processing for UID={uid}: {result}")
    return result

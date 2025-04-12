import os
import logging
import requests
import gdown
from moviepy import VideoFileClip
from faster_whisper import WhisperModel
from celery_config import celery_app
import classify

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

AUDIO_FILE_PATH = "temp_audio.wav"

def download_video(video_url, output_path):
    try:
        logging.info(f"Downloading video from {video_url}...")
        gdown.download(video_url, output_path, quiet=False)
        return os.path.exists(output_path) and os.path.getsize(output_path) > 100 * 1024
    except Exception as e:
        logging.error(f"Error downloading video: {e}")
        return False

def transcribe_audio(video_path):
    try:
        logging.info("Extracting and transcribing audio...")
        video = VideoFileClip(video_path)
        if not video.audio:
            return None
        
        video.audio.write_audiofile(AUDIO_FILE_PATH, codec="pcm_s16le", fps=16000)

        model = WhisperModel("medium", compute_type="int8")
        segments, _ = model.transcribe(AUDIO_FILE_PATH)

        return " ".join(segment.text for segment in segments).strip() if segments else None
    except Exception as e:
        logging.error(f"Error in transcription: {e}")
        return None
    finally:
        if os.path.exists(AUDIO_FILE_PATH):
            os.remove(AUDIO_FILE_PATH)

@celery_app.task(bind=True, queue="video_tasks")
def process_task(self, uid, video_url):
    logging.info(f"Processing for UID={uid}")

    video_path = f"temp_{uid}.mp4"
    if not download_video(video_url, video_path):
        return {"uid": uid, "error": "Download failed"}

    transcribed_text = transcribe_audio(video_path)
    if not transcribed_text:
        return {"uid": uid, "error": "Transcription failed"}

    classification_result = classify.classify_text(transcribed_text)

    if os.path.exists(video_path):
        os.remove(video_path)

    result = {
        "uid": uid,
        "category": classification_result.get("category", "Unknown"),
        "subcategory": classification_result.get("subcategory", "Unknown"),
        "transcribed_text": transcribed_text
    }
    
    requests.post("http://127.0.0.1:8000/results", json=result)

    return result

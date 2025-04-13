import os
import subprocess
import speech_recognition as sr
from pydub import AudioSegment

def extract_audio_from_video(video_path, audio_path):
    """Extracts audio from a video file using ffmpeg."""
    try:
        subprocess.run(["ffmpeg", "-i", video_path, "-q:a", "0", "-map", "a", audio_path, "-y"],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e}")
        return False

def convert_audio_to_text(audio_path):
    """Converts speech in an audio file to text using SpeechRecognition."""
    recognizer = sr.Recognizer()
    try:
        # Convert audio to WAV format (if not already in WAV)
        if not audio_path.endswith(".wav"):
            audio = AudioSegment.from_file(audio_path)
            audio_path = "converted_audio.wav"
            audio.export(audio_path, format="wav")
        
        # Recognize speech
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return text
    except sr.UnknownValueError:
        return "Speech Recognition could not understand the audio"
    except sr.RequestError as e:
        return f"Could not request results from Google Speech Recognition service; {e}"
    except Exception as e:
        return f"Error processing audio: {e}"

def extract_text_from_video(video_filename):
    """Extracts text from a given video file."""
    audio_filename = "extracted_audio.wav"
    
    if not os.path.exists(video_filename):
        return "Error: Video file not found."
    
    if extract_audio_from_video(video_filename, audio_filename):
        return convert_audio_to_text(audio_filename)
    return "Error: Audio extraction failed."

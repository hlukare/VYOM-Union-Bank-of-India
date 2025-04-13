import os
from groq import Groq
import requests
from urllib.parse import urlparse, parse_qs
import tempfile
import logging
from moviepy import VideoFileClip

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Groq API key should be set as an environment variable
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY environment variable not set. Transcription will not work.")

def get_direct_url(url):
    """Convert Google Drive sharing URL to direct download URL if needed"""
    if 'drive.google.com' in url:
        file_id = None
        if 'file/d/' in url:
            file_id = url.split('file/d/')[1].split('/')[0]
        elif 'id=' in url:
            file_id = parse_qs(urlparse(url).query)['id'][0]
            
        if file_id:
            return f'https://drive.google.com/uc?export=download&id={file_id}'
    return url

def download_video(url, output_path=None):
    """Download video from URL to a temporary file"""
    try:
        # Create a temporary file if no output path is provided
        if output_path is None:
            temp_file = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
            output_path = temp_file.name
            temp_file.close()
        
        # For Google Drive files, we need to handle the confirmation page for large files
        if 'drive.google.com' in url:
            session = requests.Session()
            response = session.get(url, stream=True)
            
            # Check if there's a download warning (for large files)
            for key, value in response.cookies.items():
                if key.startswith('download_warning'):
                    url = f"{url}&confirm={value}"
                    response = session.get(url, stream=True)
                    break
        else:
            response = requests.get(url, stream=True)
        
        response.raise_for_status()
        
        if response.status_code == 200:
            # Download the video file
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            return output_path
        else:
            raise Exception(f"Failed to download video: {response.status_code}")
    except Exception as e:
        logger.error(f"Error downloading video: {str(e)}")
        raise

def extract_audio(video_path):
    """Extract audio from video file using MoviePy"""
    try:
        logger.info(f"Extracting audio from video: {video_path}")
        # Create a temporary file for the audio
        audio_file = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
        audio_path = audio_file.name
        audio_file.close()
        
        # Load the video clip
        video_clip = VideoFileClip(video_path)
        
        # Extract the audio
        audio_clip = video_clip.audio
        
        # Write the audio to the temporary file
        audio_clip.write_audiofile(audio_path, logger=None)
        
        # Close the clips to release resources
        audio_clip.close()
        video_clip.close()
        
        return audio_path
    except Exception as e:
        logger.error(f"Error extracting audio: {str(e)}")
        raise

def extract_and_transcribe(video_url):
    """Download video, extract audio, and transcribe using Groq API"""
    video_file = None
    audio_file = None
    
    try:
        # Get direct URL if it's a Google Drive link
        direct_url = get_direct_url(video_url)
        
        # Download the video file
        logger.info(f"Downloading video from: {direct_url}")
        video_file = download_video(direct_url)
        
        # Extract audio from the video
        audio_file = extract_audio(video_file)
        
        # Initialize Groq client
        client = Groq(api_key=GROQ_API_KEY)
        
        # Open and transcribe the audio file
        logger.info("Transcribing audio...")
        with open(audio_file, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(audio_file, file.read()),
                model="whisper-large-v3-turbo",
                response_format="json",
                temperature=0.0
            )
        
        logger.info("Transcription complete")
        return transcription.text
        
    except Exception as e:
        logger.error(f"Error in transcription process: {str(e)}")
        return f"Error in transcription: {str(e)}"
    finally:
        # Clean up temporary files
        if video_file and os.path.exists(video_file):
            try:
                os.unlink(video_file)
                logger.info(f"Deleted temporary video file: {video_file}")
            except Exception as e:
                logger.warning(f"Failed to delete temporary video file: {str(e)}")
                
        if audio_file and os.path.exists(audio_file):
            try:
                os.unlink(audio_file)
                logger.info(f"Deleted temporary audio file: {audio_file}")
            except Exception as e:
                logger.warning(f"Failed to delete temporary audio file: {str(e)}")

# For backward compatibility with the existing code
def process_video_query(video_url):
    """Process a video query by downloading, extracting audio, and transcribing."""
    return extract_and_transcribe(video_url)

# === Direct URL Video Download (Currently using GDrive) ===
# import requests
# 
# def download_video_from_url(url, save_path):
#     try:
#         # Send a GET request to the URL with stream=True to handle large files
#         response = requests.get(url, stream=True)
#         response.raise_for_status()  # Raise an exception for bad status codes
#         
#         # Get total file size if available
#         file_size = int(response.headers.get('content-length', 0))
#         
#         # Open the local file to save the video
#         with open(save_path, 'wb') as video_file:
#             if file_size == 0:
#                 # If no content length header
#                 video_file.write(response.content)
#             else:
#                 # Download in chunks for large files
#                 chunk_size = 8192
#                 for chunk in response.iter_content(chunk_size=chunk_size):
#                     if chunk:
#                         video_file.write(chunk)
#         
#         return save_path
#     except requests.exceptions.RequestException as e:
#         raise Exception(f"Failed to download video: {str(e)}")
#
# # Usage example:
# # video_path = download_video_from_url("http://example.com/video.mp4", "downloaded_video.mp4")

if __name__ == "__main__":
    # Test the function
    test_url = "https://example.com/video.mp4"
    print(extract_and_transcribe(test_url)) 
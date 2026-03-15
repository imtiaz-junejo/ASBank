"""
Whisper service for audio transcription
Uses OpenAI Whisper API for speech-to-text conversion
"""

import whisper
import os

# Lazy load: model loads on first use (avoids blocking app startup)
# Options: tiny, base, small, medium, large
_model = None


def _get_model():
    """Load Whisper model on first use"""
    global _model
    if _model is None:
        # Using tiny for fast startup; switch to "base" for better accuracy
        _model = whisper.load_model("tiny")
    return _model


def transcribe_audio(audio_path):
    """
    Transcribe audio file using Whisper
    
    Args:
        audio_path: Path to the audio file
        
    Returns:
        Transcribed text string or None if transcription fails
    """
    try:
        if not os.path.exists(audio_path):
            print(f"Audio file not found: {audio_path}")
            return None

        model = _get_model()
        result = model.transcribe(audio_path)
        
        # Extract transcribed text
        transcription = result.get("text", "").strip()
        
        return transcription if transcription else None

    except Exception as e:
        print(f"Error transcribing audio: {str(e)}")
        return None

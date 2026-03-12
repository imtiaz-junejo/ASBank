"""
Whisper service for audio transcription (local openai-whisper)

Key tuning knobs for accuracy:
- Use a larger model (default: small; configurable via WHISPER_MODEL env var)
- Force language for bilingual apps to avoid language-mixing (en/ur)
- Use beam search and stable decoding options for short phrases
"""

import os
from typing import Optional, Tuple

import whisper

# Lazy load: model loads on first use (avoids blocking app startup)
# Options: tiny, base, small, medium, large, large-v2, large-v3 (if supported by your whisper package)
_model = None
_model_name = None


def _get_model():
    """Load Whisper model on first use"""
    global _model, _model_name
    desired = os.getenv("WHISPER_MODEL", "small").strip() or "small"
    if _model is None or _model_name != desired:
        print(f"[WHISPER] loading model='{desired}' (this may take time on first run)")
        _model = whisper.load_model(desired)
        _model_name = desired
    return _model


def _prompt_for_language(language: Optional[str]) -> Optional[str]:
    if language == "en":
        return "Transcribe in English. Do not translate. Do not mix other languages."
    if language == "ur":
        return "براہ کرم صرف اردو میں لکھیں۔ ترجمہ نہ کریں۔ دوسری زبانیں شامل نہ کریں۔"
    return None


def transcribe_audio(audio_path: str, language: Optional[str] = None) -> Tuple[Optional[str], Optional[str]]:
    """
    Transcribe audio file using Whisper.

    Args:
        audio_path: Path to the audio file
        language: 'en' | 'ur' | None (None = auto-detect)

    Returns:
        (text, detected_language)
    """
    try:
        if not os.path.exists(audio_path):
            print(f"[WHISPER] audio file not found: {audio_path}")
            return None, None

        if language not in (None, "en", "ur"):
            language = None

        model = _get_model()
        result = model.transcribe(
            audio_path,
            task="transcribe",
            language=language,
            initial_prompt=_prompt_for_language(language),
            fp16=False,  # safer default on CPU / many Windows setups
            temperature=0,
            beam_size=5,
            best_of=5,
            condition_on_previous_text=False,
            no_speech_threshold=0.6,
            logprob_threshold=-1.0,
            compression_ratio_threshold=2.4,
        )

        text = (result.get("text") or "").strip()
        detected_language = result.get("language")
        return (text if text else None), detected_language

    except Exception as e:
        print(f"[WHISPER] error transcribing audio: {str(e)}")
        return None, None

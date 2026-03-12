"""
Voice-Based Authentication System - Flask Backend
Main application file with REST endpoints for signup and login
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import re
import difflib
from models import db, User

EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
from whisper_service import transcribe_audio

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///voice_auth.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Enable CORS for React frontend
CORS(app)

# Initialize database
db.init_app(app)

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Create database tables and run migration for existing DBs (add name, password_hash if missing)
with app.app_context():
    db.create_all()
    # Migration: add name and password_hash columns if table was created with old schema
    try:
        from sqlalchemy import text
        result = db.session.execute(text("PRAGMA table_info(user)"))
        columns = [row[1] for row in result.fetchall()]
        added = False
        if 'name' not in columns:
            db.session.execute(text("ALTER TABLE user ADD COLUMN name VARCHAR(120)"))
            added = True
        if 'password_hash' not in columns:
            db.session.execute(text("ALTER TABLE user ADD COLUMN password_hash VARCHAR(255)"))
            added = True
        if added:
            db.session.commit()
        # Backfill existing rows only when we have name/password_hash and possibly old username
        if 'username' in columns:
            db.session.execute(text("UPDATE user SET name = username WHERE name IS NULL"))
        else:
            db.session.execute(text("UPDATE user SET name = email WHERE name IS NULL"))
        db.session.execute(text("UPDATE user SET password_hash = '' WHERE password_hash IS NULL"))
        db.session.commit()

        # Remove legacy 'username' column if present (SQLite 3.35+ supports DROP COLUMN)
        if 'username' in columns:
            try:
                db.session.execute(text("ALTER TABLE user DROP COLUMN username"))
                db.session.commit()
            except Exception:
                db.session.rollback()
                # Fallback: recreate table without username for older SQLite
                db.session.execute(text(
                    "CREATE TABLE user_new (id INTEGER PRIMARY KEY, name VARCHAR(120) NOT NULL, "
                    "email VARCHAR(120) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, "
                    "voice_phrase TEXT NOT NULL, audio_file_path VARCHAR(255), created_at DATETIME)"
                ))
                db.session.execute(text(
                    "INSERT INTO user_new (id, name, email, password_hash, voice_phrase, audio_file_path, created_at) "
                    "SELECT id, name, email, password_hash, voice_phrase, audio_file_path, created_at FROM user"
                ))
                db.session.execute(text("DROP TABLE user"))
                db.session.execute(text("ALTER TABLE user_new RENAME TO user"))
                db.session.commit()
    except Exception:
        db.session.rollback()


def calculate_similarity(text1, text2):
    """
    Calculate similarity between two texts using SequenceMatcher
    Returns a value between 0.0 (no match) and 1.0 (perfect match)
    """
    return difflib.SequenceMatcher(None, text1.lower().strip(), text2.lower().strip()).ratio()


@app.route('/signup', methods=['POST'])
def signup():
    """
    User signup endpoint
    Expects: multipart/form-data with 'name', 'email', 'password', and 'audio' file
    Returns: JSON response with success status
    """
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        audio_file = request.files.get('audio')

        # Validate input
        if not name or not name.strip():
            return jsonify({'success': False, 'error': 'Name is required'}), 400
        if not email or not email.strip():
            return jsonify({'success': False, 'error': 'Email is required'}), 400
        if not EMAIL_REGEX.match(email):
            return jsonify({'success': False, 'error': 'Enter a valid email address'}), 400
        if not password or len(password) < 6:
            return jsonify({'success': False, 'error': 'Password must be at least 6 characters'}), 400
        if not audio_file:
            return jsonify({'success': False, 'error': 'Audio file is required'}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'success': False, 'error': 'User with this email already exists'}), 400

        # Save audio file temporarily
        safe_email = secure_filename(email.replace('@', '_at_'))
        filename = secure_filename(f"{safe_email}.webm")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        audio_file.save(filepath)

        # Transcribe audio using Whisper
        transcription = transcribe_audio(filepath)
        
        if not transcription:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'success': False, 'error': 'Failed to transcribe audio'}), 500

        # Store user in database
        new_user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            voice_phrase=transcription,
            audio_file_path=filepath
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'transcription': transcription
        }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    Expects: multipart/form-data with 'email', 'password', and 'audio' file
    Returns: JSON response with login success status
    """
    try:
        # Get form data
        email = request.form.get('email')
        password = request.form.get('password')
        audio_file = request.files.get('audio')

        # Validate input
        if not email or not email.strip():
            return jsonify({'success': False, 'error': 'Email is required'}), 400
        if not EMAIL_REGEX.match(email):
            return jsonify({'success': False, 'error': 'Enter a valid email address'}), 400
        if not password:
            return jsonify({'success': False, 'error': 'Password is required'}), 400
        if not audio_file:
            return jsonify({'success': False, 'error': 'Audio file is required'}), 400

        # Find user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        # Verify password (handle legacy rows with empty password_hash)
        if not user.password_hash or not check_password_hash(user.password_hash, password):
            return jsonify({'success': False, 'error': 'Invalid password'}), 401

        # Save temporary audio file
        temp_filename = secure_filename(f"temp_login_{user.id}.webm")
        temp_filepath = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
        audio_file.save(temp_filepath)

        # Transcribe audio using Whisper
        transcription = transcribe_audio(temp_filepath)
        
        # Clean up temporary file
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)

        if not transcription:
            return jsonify({'success': False, 'error': 'Failed to transcribe audio'}), 500

        # Compare transcriptions (debug log to help tuning)
        similarity = calculate_similarity(user.voice_phrase, transcription)
        print(
            f"[VOICE LOGIN] similarity={similarity:.2f}\n"
            f"  stored: '{user.voice_phrase}'\n"
            f"  login : '{transcription}'"
        )
        # For demo/dev, accept fairly loose matches
        threshold = 0.3  # 30% similarity threshold

        if similarity >= threshold:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': user.to_dict(),
                'similarity': round(similarity, 2)
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Voice authentication failed',
                'similarity': round(similarity, 2)
            }), 401

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)

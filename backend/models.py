"""
Database models for Voice Authentication System
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    """User model for storing user credentials and voice phrases"""
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    voice_phrase = db.Column(db.Text, nullable=False)  # Transcribed voice phrase
    voice_language = db.Column(db.String(8))  # 'en' | 'ur' | None (auto/unknown)
    audio_file_path = db.Column(db.String(255))  # Path to stored audio file
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

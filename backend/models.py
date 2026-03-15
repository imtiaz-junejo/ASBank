"""
Database models for Voice Authentication System
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from decimal import Decimal

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
    balance = db.Column(db.Numeric(12, 2), default=Decimal('38049.94'), nullable=False)  # Account balance
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'balance': float(self.balance) if self.balance else 0.0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Transaction(db.Model):
    """Transaction model for all payment transactions"""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # TRANSFER, BILL, TOPUP, CREDIT_CARD, DONATION
    receiver = db.Column(db.String(255))  # Recipient name, bill company, mobile number, etc.
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    status = db.Column(db.String(20), default='COMPLETED', nullable=False)  # COMPLETED, PENDING, FAILED
    description = db.Column(db.Text)  # Optional description
    payment_metadata = db.Column(db.Text)  # JSON string for additional data (bill type, network, etc.)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    user = db.relationship('User', backref='transactions')

    def to_dict(self):
        """Convert transaction object to dictionary"""
        import json
        metadata = {}
        if self.payment_metadata:
            try:
                metadata = json.loads(self.payment_metadata)
            except:
                pass
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'receiver': self.receiver,
            'amount': float(self.amount) if self.amount else 0.0,
            'status': self.status,
            'description': self.description,
            'metadata': metadata,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }


class Favorite(db.Model):
    """Favorite payment details for quick access"""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    favorite_type = db.Column(db.String(50), nullable=False)  # TRANSFER, BILL, TOPUP, CREDIT_CARD, DONATION
    name = db.Column(db.String(255), nullable=False)  # Display name
    data = db.Column(db.Text, nullable=False)  # JSON string with favorite details
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='favorites')

    def to_dict(self):
        """Convert favorite object to dictionary"""
        import json
        data = {}
        if self.data:
            try:
                data = json.loads(self.data)
            except:
                pass
        return {
            'id': self.id,
            'user_id': self.user_id,
            'favorite_type': self.favorite_type,
            'name': self.name,
            'data': data,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

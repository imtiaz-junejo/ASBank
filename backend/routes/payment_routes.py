"""
Payment API routes for transfer, bills, topup, credit card, donations, and favorites
"""

from flask import Blueprint, request, jsonify
from models import db, User, Transaction, Favorite
from werkzeug.security import check_password_hash
from decimal import Decimal
import json
from datetime import datetime

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')

@payment_bp.route('/health', methods=['GET'])
def payment_health():
    return jsonify({'success': True, 'service': 'payment', 'status': 'ok'}), 200


def get_user_from_session():
    """Get current user from session (simplified - in production use JWT)"""
    # For now, we'll get user_id from request headers or body
    # In production, decode JWT token
    user_id = request.headers.get('X-User-Id')
    if not user_id:
        # Try to get from JSON body if available
        try:
            if request.is_json and request.json:
                user_id = request.json.get('user_id')
        except:
            pass
    if not user_id:
        return None
    try:
        return User.query.get(int(user_id))
    except (ValueError, TypeError):
        return None


def verify_user_balance(user, amount):
    """Verify user has sufficient balance"""
    return user.balance >= Decimal(str(amount))


def deduct_balance(user, amount):
    """Deduct amount from user balance"""
    user.balance -= Decimal(str(amount))
    db.session.commit()


@payment_bp.route('/transfer', methods=['POST'])
def transfer():
    """Transfer money to another account/RAAST ID"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        recipient_name = data.get('recipient_name', '').strip()
        recipient_account = data.get('recipient_account', '').strip()
        amount = data.get('amount')
        description = data.get('description', '').strip()
        
        # Validate
        if not recipient_name:
            return jsonify({'success': False, 'error': 'Recipient name is required'}), 400
        if not recipient_account:
            return jsonify({'success': False, 'error': 'Recipient account/RAAST ID is required'}), 400
        if not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid amount is required'}), 400
        
        # Check balance
        if not verify_user_balance(user, amount):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        deduct_balance(user, amount)
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='TRANSFER',
            receiver=recipient_name,
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description=description,
            payment_metadata=json.dumps({
                'recipient_account': recipient_account,
                'recipient_name': recipient_name
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Transfer completed successfully',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/bill', methods=['POST'])
def pay_bill():
    """Pay utility bills"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        bill_type = data.get('bill_type', '').strip()
        company_name = data.get('company_name', '').strip()
        consumer_number = data.get('consumer_number', '').strip()
        amount = data.get('amount')
        
        # Validate
        if not bill_type:
            return jsonify({'success': False, 'error': 'Bill type is required'}), 400
        if not company_name:
            return jsonify({'success': False, 'error': 'Company name is required'}), 400
        if not consumer_number:
            return jsonify({'success': False, 'error': 'Consumer number is required'}), 400
        if not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid amount is required'}), 400
        
        # Check balance
        if not verify_user_balance(user, amount):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        deduct_balance(user, amount)
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='BILL',
            receiver=company_name,
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description=f'{bill_type} bill payment',
            payment_metadata=json.dumps({
                'bill_type': bill_type,
                'company_name': company_name,
                'consumer_number': consumer_number
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Bill payment completed successfully',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/topup', methods=['POST'])
def mobile_topup():
    """Mobile topup/recharge"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        mobile_number = data.get('mobile_number', '').strip()
        network = data.get('network', '').strip()
        amount = data.get('amount')
        
        # Validate
        if not mobile_number:
            return jsonify({'success': False, 'error': 'Mobile number is required'}), 400
        if not network:
            return jsonify({'success': False, 'error': 'Network is required'}), 400
        if not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid amount is required'}), 400
        
        # Check balance
        if not verify_user_balance(user, amount):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        deduct_balance(user, amount)
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='TOPUP',
            receiver=mobile_number,
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description=f'Mobile topup - {network}',
            payment_metadata=json.dumps({
                'mobile_number': mobile_number,
                'network': network
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Mobile topup completed successfully',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/credit-card', methods=['POST'])
def pay_credit_card():
    """Credit card payment"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        card_number = data.get('card_number', '').strip()
        bank_name = data.get('bank_name', '').strip()
        amount = data.get('amount')
        
        # Validate
        if not card_number:
            return jsonify({'success': False, 'error': 'Card number is required'}), 400
        if not bank_name:
            return jsonify({'success': False, 'error': 'Bank name is required'}), 400
        if not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid amount is required'}), 400
        
        # Check balance
        if not verify_user_balance(user, amount):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        deduct_balance(user, amount)
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='CREDIT_CARD',
            receiver=bank_name,
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description='Credit card payment',
            payment_metadata=json.dumps({
                'card_number': card_number[-4:] if len(card_number) > 4 else card_number,  # Store only last 4 digits
                'bank_name': bank_name
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Credit card payment completed successfully',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/donation', methods=['POST'])
def donate():
    """Donation to organizations"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        organization = data.get('organization', '').strip()
        amount = data.get('amount')
        
        # Validate
        if not organization:
            return jsonify({'success': False, 'error': 'Organization is required'}), 400
        if not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid amount is required'}), 400
        
        # Check balance
        if not verify_user_balance(user, amount):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        deduct_balance(user, amount)
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='DONATION',
            receiver=organization,
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description=f'Donation to {organization}',
            payment_metadata=json.dumps({
                'organization': organization
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Donation completed successfully',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/favorites', methods=['GET'])
def get_favorites():
    """Get user's favorite payments"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        favorites = Favorite.query.filter_by(user_id=user.id).order_by(Favorite.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'favorites': [f.to_dict() for f in favorites]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/favorites', methods=['POST'])
def add_favorite():
    """Add a favorite payment"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        favorite_type = data.get('favorite_type', '').strip()
        name = data.get('name', '').strip()
        favorite_data = data.get('data', {})
        
        # Validate
        if not favorite_type:
            return jsonify({'success': False, 'error': 'Favorite type is required'}), 400
        if not name:
            return jsonify({'success': False, 'error': 'Name is required'}), 400
        
        # Create favorite
        favorite = Favorite(
            user_id=user.id,
            favorite_type=favorite_type,
            name=name,
            data=json.dumps(favorite_data)
        )
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Favorite added successfully',
            'favorite': favorite.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/balance', methods=['GET'])
def get_balance():
    """Get user balance"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        return jsonify({
            'success': True,
            'balance': float(user.balance) if user.balance else 0.0
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@payment_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get user transaction history"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        limit = request.args.get('limit', 10, type=int)
        transactions = Transaction.query.filter_by(user_id=user.id).order_by(
            Transaction.timestamp.desc()
        ).limit(limit).all()
        
        return jsonify({
            'success': True,
            'transactions': [t.to_dict() for t in transactions]
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


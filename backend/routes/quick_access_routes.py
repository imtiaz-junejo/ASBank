"""
Quick Access API routes for RAAST ID, PayDay Loan, Pay Anyone, Mutual Funds, Debit Cards, Payees & Billers
"""

from flask import Blueprint, request, jsonify
from models import db, User, Transaction
from decimal import Decimal
import json
from datetime import datetime

quick_access_bp = Blueprint('quick_access', __name__, url_prefix='/api/quick-access')


def get_user_from_session():
    """Get current user from session"""
    user_id = request.headers.get('X-User-Id')
    if not user_id:
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


@quick_access_bp.route('/raast-id', methods=['GET'])
def get_raast_id():
    """Get user's RAAST ID"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        # Generate RAAST ID from user email/phone (demo)
        raast_id = f"03{user.id:09d}"  # Demo RAAST ID format
        
        return jsonify({
            'success': True,
            'raast_id': raast_id,
            'status': 'Active'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/raast-id', methods=['POST'])
def update_raast_id():
    """Update/Register RAAST ID"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        mobile_number = data.get('mobile_number', '').strip()
        
        if not mobile_number or len(mobile_number) != 11:
            return jsonify({'success': False, 'error': 'Valid mobile number is required'}), 400
        
        # In real app, this would register with RAAST system
        return jsonify({
            'success': True,
            'message': 'RAAST ID registered successfully',
            'raast_id': mobile_number
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/payday-loan', methods=['POST'])
def apply_payday_loan():
    """Apply for PayDay Loan (instant salary advance)"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        loan_amount = data.get('loan_amount')
        purpose = data.get('purpose', '').strip()
        
        if not loan_amount or loan_amount <= 0:
            return jsonify({'success': False, 'error': 'Valid loan amount is required'}), 400
        
        # Check eligibility (demo: must have balance > 10000)
        if user.balance < Decimal('10000'):
            return jsonify({
                'success': False,
                'error': 'Insufficient account balance for loan eligibility'
            }), 400
        
        # Max loan amount is 50% of balance (demo)
        max_loan = float(user.balance) * 0.5
        if loan_amount > max_loan:
            return jsonify({
                'success': False,
                'error': f'Maximum loan amount is Rs. {max_loan:,.2f}'
            }), 400
        
        # Create loan transaction (credit to account)
        user.balance += Decimal(str(loan_amount))
        
        transaction = Transaction(
            user_id=user.id,
            type='PAYDAY_LOAN',
            receiver='ASBank PayDay Loan',
            amount=Decimal(str(loan_amount)),
            status='COMPLETED',
            description=f'PayDay Loan - {purpose}',
            payment_metadata=json.dumps({
                'loan_amount': loan_amount,
                'purpose': purpose,
                'loan_type': 'PAYDAY'
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'PayDay Loan approved and credited to your account',
            'loan_amount': loan_amount,
            'new_balance': float(user.balance)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/pay-anyone', methods=['POST'])
def pay_anyone():
    """Pay Anyone - Quick money transfer"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        recipient_name = data.get('recipient_name', '').strip()
        recipient_mobile = data.get('recipient_mobile', '').strip()
        amount = data.get('amount')
        description = data.get('description', '').strip()
        
        if not recipient_name:
            return jsonify({'success': False, 'error': 'Recipient name is required'}), 400
        if not recipient_mobile or len(recipient_mobile) != 11:
            return jsonify({'success': False, 'error': 'Valid mobile number is required'}), 400
        if not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid amount is required'}), 400
        
        # Check balance
        if user.balance < Decimal(str(amount)):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        user.balance -= Decimal(str(amount))
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='PAY_ANYONE',
            receiver=recipient_name,
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description=description or f'Payment to {recipient_name}',
            payment_metadata=json.dumps({
                'recipient_mobile': recipient_mobile,
                'recipient_name': recipient_name
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Payment sent successfully',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/mutual-funds', methods=['GET'])
def get_mutual_funds():
    """Get user's mutual funds portfolio"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        # Demo data
        funds = [
            {
                'id': 1,
                'fund_name': 'ASBank Equity Fund',
                'units': 150.5,
                'nav': 125.50,
                'value': 18887.75,
                'return_percent': 12.5
            },
            {
                'id': 2,
                'fund_name': 'ASBank Income Fund',
                'units': 200.0,
                'nav': 45.20,
                'value': 9040.00,
                'return_percent': 8.3
            }
        ]
        
        return jsonify({
            'success': True,
            'funds': funds,
            'total_value': sum(f['value'] for f in funds)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/mutual-funds/invest', methods=['POST'])
def invest_mutual_fund():
    """Invest in mutual fund"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        fund_id = data.get('fund_id')
        amount = data.get('amount')
        
        if not fund_id or not amount or amount <= 0:
            return jsonify({'success': False, 'error': 'Valid fund and amount required'}), 400
        
        if user.balance < Decimal(str(amount)):
            return jsonify({'success': False, 'error': 'Insufficient balance'}), 400
        
        # Deduct balance
        user.balance -= Decimal(str(amount))
        
        # Create transaction
        transaction = Transaction(
            user_id=user.id,
            type='MUTUAL_FUND',
            receiver=f'Mutual Fund Investment #{fund_id}',
            amount=Decimal(str(amount)),
            status='COMPLETED',
            description='Mutual fund investment',
            payment_metadata=json.dumps({
                'fund_id': fund_id,
                'investment_amount': amount
            })
        )
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Investment successful',
            'transaction': transaction.to_dict(),
            'new_balance': float(user.balance)
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/debit-cards', methods=['GET'])
def get_debit_cards():
    """Get user's debit cards"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        # Demo data
        cards = [
            {
                'id': 1,
                'card_number': f'**** **** **** {1234 + user.id}',
                'card_type': 'Visa Debit',
                'status': 'Active',
                'expiry': '12/27'
            }
        ]
        
        return jsonify({
            'success': True,
            'cards': cards
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/debit-cards/block', methods=['POST'])
def block_debit_card():
    """Block/Unblock debit card"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        data = request.json
        card_id = data.get('card_id')
        action = data.get('action', 'block')  # block or unblock
        
        return jsonify({
            'success': True,
            'message': f'Card {action}ed successfully'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/payees-billers', methods=['GET'])
def get_payees_billers():
    """Get saved payees and billers"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        # Get favorites as payees/billers
        from models import Favorite
        favorites = Favorite.query.filter_by(user_id=user.id).all()
        
        payees = []
        billers = []
        
        for fav in favorites:
            if fav.favorite_type == 'TRANSFER':
                payees.append(fav.to_dict())
            elif fav.favorite_type == 'BILL':
                billers.append(fav.to_dict())
        
        return jsonify({
            'success': True,
            'payees': payees,
            'billers': billers
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@quick_access_bp.route('/payees-billers', methods=['DELETE'])
def delete_payee_biller():
    """Delete payee or biller"""
    try:
        user = get_user_from_session()
        if not user:
            return jsonify({'success': False, 'error': 'User not authenticated'}), 401
        
        favorite_id = request.args.get('id')
        if not favorite_id:
            return jsonify({'success': False, 'error': 'ID is required'}), 400
        
        from models import Favorite
        favorite = Favorite.query.filter_by(id=favorite_id, user_id=user.id).first()
        if not favorite:
            return jsonify({'success': False, 'error': 'Not found'}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500



import React, { useState } from 'react';
import PaymentNavigation from '../../components/PaymentNavigation';
import { payCreditCard } from '../../services/paymentApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function CreditCardPaymentModule({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    bankName: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.cardNumber.trim() || formData.cardNumber.length < 16) {
      e.cardNumber = 'Valid card number is required';
    }
    if (!formData.bankName.trim()) e.bankName = 'Bank name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      e.amount = 'Valid amount is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setShowConfirm(true);
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      const result = await payCreditCard(formData);
      if (result.success) {
        if (onSuccess) onSuccess(result);
        if (onClose) onClose();
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Credit card payment failed' });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
            Credit Card Payment
          </h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          )}
        </div>
        <PaymentNavigation />
        <div className="mt-6">
          <div className="bg-[#f3f3f3] border border-gray-200 rounded px-4 py-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-sm text-gray-700">
                You initiated a request for Credit Card Payment. Please review details before you confirm!
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Card Number</span>
                <span className="text-gray-900">{formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Bank Name</span>
                <span className="text-gray-900">{formData.bankName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Amount</span>
                <span className="text-gray-900">Rs. {parseFloat(formData.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmPayment}
              className="px-6 py-2 rounded bg-[#f46a1e] text-white text-sm font-semibold hover:bg-[#e05c12] flex items-center gap-2"
              disabled={loading}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {loading ? 'Processing...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-6 py-2 rounded bg-gray-200 text-sm text-gray-700 hover:bg-gray-300 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                if (onClose) onClose();
              }}
              className="px-6 py-2 rounded bg-gray-100 text-sm text-gray-600 hover:bg-gray-200 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
          Credit Card Payment
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        )}
      </div>

      <PaymentNavigation />

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number *
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="16"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter bank name"
            />
            {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Rs.) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <div className="flex gap-3 pt-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-semibold disabled:opacity-60 ${
                onClose ? 'flex-1' : 'w-full'
              }`}
              style={{ backgroundColor: ORANGE }}
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


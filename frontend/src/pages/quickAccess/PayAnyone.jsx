import React, { useState } from 'react';
import { payAnyone } from '../../services/quickAccessApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function PayAnyone({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientMobile: '',
    amount: '',
    description: '',
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
    if (!formData.recipientName.trim()) e.recipientName = 'Recipient name is required';
    if (!formData.recipientMobile.trim() || formData.recipientMobile.length !== 11) {
      e.recipientMobile = 'Valid 11-digit mobile number is required';
    }
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
      const result = await payAnyone(formData);
      if (result.success) {
        if (onSuccess) onSuccess(result);
        if (onClose) onClose();
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Payment failed' });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold mb-4" style={{ color: BLUE }}>
            Confirm Payment
          </h2>
          <div className="space-y-2 mb-6 text-sm">
            <p>
              <span className="font-medium">Recipient:</span> {formData.recipientName}
            </p>
            <p>
              <span className="font-medium">Mobile:</span> {formData.recipientMobile}
            </p>
            <p>
              <span className="font-medium">Amount:</span> Rs. {parseFloat(formData.amount).toLocaleString()}
            </p>
            {formData.description && (
              <p>
                <span className="font-medium">Description:</span> {formData.description}
              </p>
            )}
          </div>
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmPayment}
              className="flex-1 px-4 py-2 rounded-md text-white font-semibold"
              style={{ backgroundColor: ORANGE }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            Pay Anyone
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name *
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.recipientName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter recipient name"
            />
            {errors.recipientName && (
              <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="recipientMobile"
              value={formData.recipientMobile}
              onChange={handleChange}
              maxLength="11"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.recipientMobile ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="03XX-XXXXXXX"
            />
            {errors.recipientMobile && (
              <p className="text-xs text-red-500 mt-1">{errors.recipientMobile}</p>
            )}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Add a note (optional)"
            />
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-60"
              style={{ backgroundColor: ORANGE }}
            >
              {loading ? 'Processing...' : 'Send Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



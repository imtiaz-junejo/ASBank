import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferMoney, getFavorites, addFavorite } from '../../services/paymentApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function TransferRaast({ onClose, onSuccess, initialFavorite }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientAccount: '',
    amount: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  // If opened from a favorite (e.g. from quick access), prefill just like clicking a favorite chip
  useEffect(() => {
    if (initialFavorite && initialFavorite.data) {
      setFormData({
        recipientName: initialFavorite.data.recipient_name || '',
        recipientAccount: initialFavorite.data.recipient_account || '',
        amount: '',
        description: initialFavorite.data.description || '',
      });
    }
  }, [initialFavorite]);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      if (data.success) {
        setFavorites(data.favorites.filter((f) => f.favorite_type === 'TRANSFER'));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFavoriteSelect = (favorite) => {
    setFormData({
      recipientName: favorite.data.recipient_name || '',
      recipientAccount: favorite.data.recipient_account || '',
      amount: '',
      description: favorite.data.description || '',
    });
  };

  const validate = () => {
    const e = {};
    if (!formData.recipientName.trim()) e.recipientName = 'Recipient name is required';
    if (!formData.recipientAccount.trim()) e.recipientAccount = 'Recipient account/RAAST ID is required';
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

  const confirmTransfer = async () => {
    setLoading(true);
    try {
      const result = await transferMoney(formData);
      if (result.success) {
        // Save as favorite if requested
        if (saveAsFavorite && formData.recipientName) {
          try {
            await addFavorite({
              favoriteType: 'TRANSFER',
              name: formData.recipientName,
              data: {
                recipient_name: formData.recipientName,
                recipient_account: formData.recipientAccount,
                description: formData.description,
              },
            });
          } catch (err) {
            console.error('Failed to save favorite:', err);
          }
        }
        if (onSuccess) onSuccess(result);
        if (onClose) onClose();
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Transfer failed' });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: BLUE }}>
          Confirm Transfer
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium text-gray-700">Recipient:</span> <span className="text-gray-900">{formData.recipientName}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Account/RAAST ID:</span> <span className="text-gray-900">{formData.recipientAccount}</span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Amount:</span> <span className="text-gray-900">Rs. {parseFloat(formData.amount).toLocaleString()}</span>
            </p>
            {formData.description && (
              <p>
                <span className="font-medium text-gray-700">Description:</span> <span className="text-gray-900">{formData.description}</span>
              </p>
            )}
          </div>
        </div>
        {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="button"
            onClick={confirmTransfer}
            className="flex-1 px-4 py-2 rounded-md text-white font-semibold"
            style={{ backgroundColor: ORANGE }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Transfer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
          Transfer / RAAST
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

        {favorites.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs font-medium text-gray-700 mb-2">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              {favorites.map((fav) => (
                <button
                  key={fav.id}
                  type="button"
                  onClick={() => handleFavoriteSelect(fav)}
                  className="px-3 py-1 text-xs border border-orange-200 rounded-md hover:bg-orange-50"
                  style={{ color: ORANGE }}
                >
                  {fav.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
              Recipient Account / RAAST ID *
            </label>
            <input
              type="text"
              name="recipientAccount"
              value={formData.recipientAccount}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.recipientAccount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter account number or RAAST ID"
            />
            {errors.recipientAccount && (
              <p className="text-xs text-red-500 mt-1">{errors.recipientAccount}</p>
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveFavorite"
              checked={saveAsFavorite}
              onChange={(e) => setSaveAsFavorite(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="saveFavorite" className="text-sm text-gray-600">
              Save as favorite
            </label>
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
              className={`px-4 py-2 rounded-md text-white font-semibold disabled:opacity-60 ${onClose ? 'flex-1' : 'w-full'}`}
              style={{ backgroundColor: ORANGE }}
            >
              {loading ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        </form>
    </div>
  );
}





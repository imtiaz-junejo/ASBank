import React, { useState, useEffect } from 'react';
import { mobileTopup, getFavorites, addFavorite } from '../../services/paymentApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

const NETWORKS = ['Jazz', 'Zong', 'Telenor', 'Ufone', 'Warid'];

export default function MobileTopup({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    network: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      if (data.success) {
        setFavorites(data.favorites.filter((f) => f.favorite_type === 'TOPUP'));
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
      mobileNumber: favorite.data.mobile_number || '',
      network: favorite.data.network || '',
      amount: '',
    });
  };

  const validate = () => {
    const e = {};
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 11) {
      e.mobileNumber = 'Valid mobile number is required';
    }
    if (!formData.network) e.network = 'Network is required';
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

  const confirmTopup = async () => {
    setLoading(true);
    try {
      const result = await mobileTopup(formData);
      if (result.success) {
        if (saveAsFavorite && formData.mobileNumber) {
          try {
            await addFavorite({
              favoriteType: 'TOPUP',
              name: `${formData.network} - ${formData.mobileNumber}`,
              data: {
                mobile_number: formData.mobileNumber,
                network: formData.network,
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
      setErrors({ submit: err.message || 'Mobile topup failed' });
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
            Confirm Mobile Topup
          </h2>
          <div className="space-y-2 mb-6 text-sm">
            <p>
              <span className="font-medium">Mobile Number:</span> {formData.mobileNumber}
            </p>
            <p>
              <span className="font-medium">Network:</span> {formData.network}
            </p>
            <p>
              <span className="font-medium">Amount:</span> Rs. {parseFloat(formData.amount).toLocaleString()}
            </p>
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
              onClick={confirmTopup}
              className="flex-1 px-4 py-2 rounded-md text-white font-semibold"
              style={{ backgroundColor: ORANGE }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Recharge'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            Mobile Topup
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
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
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              maxLength="11"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="03XX-XXXXXXX"
            />
            {errors.mobileNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Network *
            </label>
            <select
              name="network"
              value={formData.network}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.network ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select network</option>
              {NETWORKS.map((net) => (
                <option key={net} value={net}>
                  {net}
                </option>
              ))}
            </select>
            {errors.network && <p className="text-xs text-red-500 mt-1">{errors.network}</p>}
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
              {loading ? 'Processing...' : 'Recharge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



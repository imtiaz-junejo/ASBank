import React, { useState, useEffect } from 'react';
import { getFavorites } from '../../services/paymentApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function Favorites({ onClose, onSelectFavorite }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (favorite) => {
    if (onSelectFavorite) {
      onSelectFavorite(favorite);
    }
    if (onClose) onClose();
  };

  const getFavoriteTypeLabel = (type) => {
    const labels = {
      TRANSFER: 'Transfer / RAAST',
      BILL: 'Bill Payment',
      TOPUP: 'Mobile Topup',
      CREDIT_CARD: 'Credit Card',
      DONATION: 'Donation',
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            Favorites
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading favorites...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No favorites saved yet.</p>
            <p className="text-sm">Save frequently used payments as favorites for quick access.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                type="button"
                onClick={() => handleSelect(fav)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{fav.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getFavoriteTypeLabel(fav.favorite_type)}
                    </p>
                  </div>
                  <span className="text-orange-500">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}





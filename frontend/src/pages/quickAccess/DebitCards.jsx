import React, { useState, useEffect } from 'react';
import { getDebitCards, blockDebitCard } from '../../services/quickAccessApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function DebitCards({ onClose }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await getDebitCards();
      if (data.success) {
        setCards(data.cards || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (cardId, currentStatus) => {
    const action = currentStatus === 'Active' ? 'block' : 'unblock';
    if (!window.confirm(`Are you sure you want to ${action} this card?`)) {
      return;
    }
    try {
      const result = await blockDebitCard({ cardId, action });
      if (result.success) {
        loadCards(); // Refresh cards
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            Debit Cards
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
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No debit cards found.</p>
            <p className="text-sm mt-2">Contact your bank to request a debit card.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{card.card_number}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-600">
                      <span>{card.card_type}</span>
                      <span>Expiry: {card.expiry}</span>
                      <span
                        className={
                          card.status === 'Active' ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {card.status}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBlock(card.id, card.status)}
                    className={`px-4 py-2 rounded-md text-white text-sm font-semibold ${
                      card.status === 'Active'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {card.status === 'Active' ? 'Block Card' : 'Unblock Card'}
                  </button>
                </div>
              </div>
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




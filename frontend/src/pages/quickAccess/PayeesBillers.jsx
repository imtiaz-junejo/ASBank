import React, { useState, useEffect } from 'react';
import { getPayeesBillers, deletePayeeBiller } from '../../services/quickAccessApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function PayeesBillers({ onClose, onSelect }) {
  const [payees, setPayees] = useState([]);
  const [billers, setBillers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPayeesBillers();
  }, []);

  const loadPayeesBillers = async () => {
    try {
      const data = await getPayeesBillers();
      if (data.success) {
        setPayees(data.payees || []);
        setBillers(data.billers || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) {
      return;
    }
    try {
      const result = await deletePayeeBiller(id);
      if (result.success) {
        loadPayeesBillers(); // Refresh
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            Manage Payees & Billers
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
        ) : (
          <div className="space-y-6">
            {/* Payees Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payees</h3>
              {payees.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No payees saved</p>
              ) : (
                <div className="space-y-2">
                  {payees.map((payee) => (
                    <div
                      key={payee.id}
                      className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:border-orange-300"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{payee.name}</p>
                        <p className="text-xs text-gray-500">
                          {payee.data?.recipient_account || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelect(payee)}
                          className="px-3 py-1 text-xs rounded-md text-white"
                          style={{ backgroundColor: ORANGE }}
                        >
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(payee.id)}
                          className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billers Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Billers</h3>
              {billers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No billers saved</p>
              ) : (
                <div className="space-y-2">
                  {billers.map((biller) => (
                    <div
                      key={biller.id}
                      className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:border-orange-300"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{biller.name}</p>
                        <p className="text-xs text-gray-500">
                          Consumer: {biller.data?.consumer_number || 'N/A'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelect(biller)}
                          className="px-3 py-1 text-xs rounded-md text-white"
                          style={{ backgroundColor: ORANGE }}
                        >
                          Use
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(biller.id)}
                          className="px-3 py-1 text-xs rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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




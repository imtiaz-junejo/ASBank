import React, { useState, useEffect } from 'react';
import { getRaastId, updateRaastId } from '../../services/quickAccessApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function RaastIdManagement({ onClose }) {
  const [raastId, setRaastId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadRaastId();
  }, []);

  const loadRaastId = async () => {
    try {
      const data = await getRaastId();
      if (data.success) {
        setRaastId(data.raast_id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length !== 11) {
      setError('Please enter a valid 11-digit mobile number');
      return;
    }
    setRegistering(true);
    setError('');
    try {
      const data = await updateRaastId(mobileNumber);
      if (data.success) {
        setRaastId(data.raast_id);
        setMobileNumber('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            RAAST ID Management
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
        ) : (
          <div className="space-y-4">
            {raastId ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-gray-700 mb-2">Your RAAST ID:</p>
                <p className="text-xl font-bold" style={{ color: BLUE }}>
                  {raastId}
                </p>
                <p className="text-xs text-green-600 mt-2">✓ Active</p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-gray-700">No RAAST ID registered yet.</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number (for new registration)
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength="11"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="03XX-XXXXXXX"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="flex-1 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-60"
                  style={{ backgroundColor: ORANGE }}
                >
                  {registering ? 'Registering...' : 'Register RAAST ID'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}



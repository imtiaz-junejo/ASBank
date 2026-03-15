import React, { useState, useEffect } from 'react';
import { getMutualFunds, investMutualFund } from '../../services/quickAccessApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function MutualFunds({ onClose, onSuccess }) {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvest, setShowInvest] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      const data = await getMutualFunds();
      if (data.success) {
        setFunds(data.funds || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = (fund) => {
    setSelectedFund(fund);
    setShowInvest(true);
  };

  const confirmInvestment = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError('Valid investment amount is required');
      return;
    }
    setInvesting(true);
    setError('');
    try {
      const result = await investMutualFund({
        fundId: selectedFund.id,
        amount: investmentAmount,
      });
      if (result.success) {
        if (onSuccess) onSuccess(result);
        setShowInvest(false);
        loadFunds(); // Refresh funds
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setInvesting(false);
    }
  };

  if (showInvest && selectedFund) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
              Invest in {selectedFund.fund_name}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowInvest(false);
                setSelectedFund(null);
                setInvestmentAmount('');
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Current NAV: Rs. {selectedFund.nav}</p>
              <p className="text-sm text-gray-600">Return: {selectedFund.return_percent}%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investment Amount (Rs.) *
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0.00"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowInvest(false);
                  setSelectedFund(null);
                  setInvestmentAmount('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmInvestment}
                disabled={investing}
                className="flex-1 px-4 py-2 rounded-md text-white font-semibold disabled:opacity-60"
                style={{ backgroundColor: ORANGE }}
              >
                {investing ? 'Processing...' : 'Invest'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: BLUE }}>
            My Mutual Funds
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
        ) : funds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No mutual funds found.</p>
            <p className="text-sm mt-2">Contact your bank to start investing.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {funds.map((fund) => (
              <div
                key={fund.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{fund.fund_name}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-600">
                      <span>Units: {fund.units}</span>
                      <span>NAV: Rs. {fund.nav}</span>
                      <span className={fund.return_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Return: {fund.return_percent}%
                      </span>
                    </div>
                    <p className="text-sm font-semibold mt-2" style={{ color: BLUE }}>
                      Value: Rs. {fund.value.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInvest(fund)}
                    className="px-4 py-2 rounded-md text-white text-sm font-semibold"
                    style={{ backgroundColor: ORANGE }}
                  >
                    Invest More
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



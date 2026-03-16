import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transferMoney, getFavorites, addFavorite } from '../../services/paymentApi';
import PaymentNavigation from '../../components/PaymentNavigation';

const ORANGE = '#E85D04';
const BLUE = '#003366';

// Mock accounts data
const MOCK_ACCOUNTS = [
  { accountNumber: '01420010001993890028', balance: 108065.14, type: 'Current Account' },
  { accountNumber: '01420010001993890034', balance: 50000.00, type: 'Savings Account' },
];

export default function FundsTransferModule({ onClose, onSuccess, initialFavorite }) {
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState('MY_ACCOUNTS'); // EXISTING_PAYEE, NEW_PAYEE, MY_ACCOUNTS
  const [formData, setFormData] = useState({
    transferTo: '01420010001993890028',
    transferFrom: '01420010001993890034',
    amount: '',
    note: '',
    transferWhen: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('FORM'); // FORM | CONFIRM | SUCCESS
  const [transactionRef, setTransactionRef] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (initialFavorite && initialFavorite.data) {
      setFormData({
        transferTo: initialFavorite.data.recipient_account || '',
        transferFrom: '01420010001993890034',
        amount: '',
        note: initialFavorite.data.description || '',
        transferWhen: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
      setTransferType('EXISTING_PAYEE');
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

  const getAccountBalance = (accountNumber) => {
    const account = MOCK_ACCOUNTS.find((acc) => acc.accountNumber === accountNumber);
    return account ? account.balance : 0;
  };

  const validate = () => {
    const e = {};
    if (!formData.transferTo) {
      e.transferTo = 'Transfer To account is required';
    }
    if (!formData.transferFrom) {
      e.transferFrom = 'Transfer From account is required';
    }
    if (formData.transferTo === formData.transferFrom) {
      e.transferTo = 'Transfer To and From accounts must be different';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      e.amount = 'Valid amount is required';
    }
    if (parseFloat(formData.amount) > getAccountBalance(formData.transferFrom)) {
      e.amount = 'Insufficient balance';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('CONFIRM');
  };

  const confirmTransfer = async () => {
    setLoading(true);
    try {
      const transferData = {
        recipientAccount: formData.transferTo,
        amount: formData.amount,
        description: formData.note,
      };
      const result = await transferMoney(transferData);
      if (result.success) {
        setTransactionRef(result.referenceNumber || `048${Date.now().toString().slice(-6)}`);
        setStep('SUCCESS');
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Transfer failed' });
      setStep('FORM');
    } finally {
      setLoading(false);
    }
  };

  const remainingChars = 100 - (formData.note?.length || 0);

  if (step === 'CONFIRM') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
            Funds Transfer
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
                You initiated a request for Self Transfer. Please review details before you confirm!
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Transfer To</span>
                <span className="text-gray-900">{formData.transferTo}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Transfer From</span>
                <span className="text-gray-900">{formData.transferFrom}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Amount</span>
                <span className="text-gray-900">PKR {parseFloat(formData.amount || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Transfer When</span>
                <span className="text-gray-900">{formData.transferWhen}</span>
              </div>
              {formData.note && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-48">Note</span>
                  <span className="text-gray-900">{formData.note}</span>
                </div>
              )}
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmTransfer}
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
              onClick={() => setStep('FORM')}
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
                setStep('FORM');
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

  if (step === 'SUCCESS') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
            Funds Transfer
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
          <div className="bg-gray-100 border border-gray-200 rounded px-4 py-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="white"/>
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">Your transaction is successful!</p>
                <p className="text-sm text-gray-600 mt-1">Reference Number {transactionRef}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Transfer To</p>
                <p className="font-semibold text-gray-900">{formData.transferTo}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Amount</p>
                <p className="font-semibold text-gray-900">PKR {parseFloat(formData.amount || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Transfer From</p>
                <p className="font-semibold text-gray-900">{formData.transferFrom}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Transfer When</p>
                <p className="font-semibold text-gray-900">{formData.transferWhen}</p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">What would you like to do next?</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">Go to Home</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('FORM');
                  setFormData({
                    transferTo: '01420010001993890028',
                    transferFrom: '01420010001993890034',
                    amount: '',
                    note: '',
                    transferWhen: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  });
                }}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">More Payment Options</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/payments/favorites')}
                className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">Add Favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
          Funds Transfer
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

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 flex gap-6">
        {/* Left Panel - Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transfer Type Radio Buttons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Transfer Type
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transferType"
                    value="EXISTING_PAYEE"
                    checked={transferType === 'EXISTING_PAYEE'}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Existing Payee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transferType"
                    value="NEW_PAYEE"
                    checked={transferType === 'NEW_PAYEE'}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">New Payee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transferType"
                    value="MY_ACCOUNTS"
                    checked={transferType === 'MY_ACCOUNTS'}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">My Accounts</span>
                </label>
              </div>
            </div>

            {/* Transfer To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transfer To
              </label>
              <select
                name="transferTo"
                value={formData.transferTo}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.transferTo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {MOCK_ACCOUNTS.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} - {acc.type}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#0b5394] mt-1">
                Balance: PKR {getAccountBalance(formData.transferTo).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {errors.transferTo && <p className="text-xs text-red-500 mt-1">{errors.transferTo}</p>}
            </div>

            {/* Transfer From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transfer From
              </label>
              <select
                name="transferFrom"
                value={formData.transferFrom}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.transferFrom ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {MOCK_ACCOUNTS.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} - {acc.type}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#0b5394] mt-1">
                Balance: PKR {getAccountBalance(formData.transferFrom).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {errors.transferFrom && <p className="text-xs text-red-500 mt-1">{errors.transferFrom}</p>}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              <div className="flex items-center justify-between mt-1">
                <a href="#" className="text-xs text-red-600 hover:underline">
                  View Limits
                </a>
              </div>
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>

            {/* Note (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note (Optional)
              </label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                maxLength={100}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                placeholder="Enter note"
              />
              <p className="text-xs text-gray-500 mt-1">{remainingChars} Characters Left</p>
            </div>

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

            <div className="flex gap-3 pt-2">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded text-white font-semibold text-sm disabled:opacity-60 flex items-center gap-2 ${
                  onClose ? 'flex-1' : 'w-full'
                }`}
                style={{ backgroundColor: ORANGE }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1V15M3 6H13M3 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {loading ? 'Processing...' : 'Transfer'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Information Card */}
        <div className="w-64 bg-[#f46a1e] text-white rounded-lg p-5 hidden md:flex flex-col justify-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-white bg-opacity-10">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Up Arrow */}
                <path d="M28 8L32 14H24L28 8Z" fill="white"/>
                {/* Money Bills Stack */}
                <rect x="18" y="18" width="20" height="14" rx="2" fill="white" opacity="0.9"/>
                <rect x="20" y="20" width="16" height="2" rx="1" fill="#f46a1e"/>
                <rect x="20" y="24" width="12" height="1" rx="0.5" fill="#f46a1e"/>
                <rect x="20" y="27" width="14" height="1" rx="0.5" fill="#f46a1e"/>
                <rect x="20" y="30" width="10" height="1" rx="0.5" fill="#f46a1e"/>
                {/* Down Arrow */}
                <path d="M28 48L32 42H24L28 48Z" fill="white"/>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-center mb-3">Own Account</h3>
          <p className="text-xs leading-relaxed text-center">
            Select to and from accounts along with desired amount to use fast and secure transferring of funds between your two or more accounts within ABL.
          </p>
        </div>
      </div>
    </div>
  );
}



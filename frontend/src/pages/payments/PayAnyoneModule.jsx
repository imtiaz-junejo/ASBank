import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { payAnyone } from '../../services/quickAccessApi';
import QuickAccessNavigation from '../../components/QuickAccessNavigation';

const ORANGE = '#E85D04';
const BLUE = '#003366';

export default function PayAnyoneModule({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transferFrom: '05280010006525770010',
    balance: 2422.60,
    paymentMode: 'Pay in Cash',
    amount: '',
    beneficiaryName: '',
    beneficiaryCNIC: '',
    beneficiaryMobile: '',
    beneficiaryEmail: '',
    purpose: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('FORM'); // FORM | CONFIRM | SUCCESS
  const [transactionRef, setTransactionRef] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 13) value = value.slice(0, 13);
    setFormData((prev) => ({ ...prev, beneficiaryCNIC: value }));
    setErrors((prev) => ({ ...prev, beneficiaryCNIC: '' }));
  };

  const formatCNIC = (cnic) => {
    if (!cnic) return '';
    if (cnic.length <= 5) return cnic;
    if (cnic.length <= 12) return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
    return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12)}`;
  };

  const validate = () => {
    const e = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      e.amount = 'Valid amount is required';
    }
    if (!formData.beneficiaryName.trim()) {
      e.beneficiaryName = 'Beneficiary name is required';
    }
    if (!formData.beneficiaryCNIC || formData.beneficiaryCNIC.length !== 13) {
      e.beneficiaryCNIC = 'Valid 13-digit CNIC is required';
    }
    if (!formData.beneficiaryMobile || formData.beneficiaryMobile.length !== 11) {
      e.beneficiaryMobile = 'Valid 11-digit mobile number is required';
    }
    if (!formData.purpose.trim()) {
      e.purpose = 'Purpose is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('CONFIRM');
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      const paymentData = {
        recipientName: formData.beneficiaryName,
        recipientMobile: formData.beneficiaryMobile,
        amount: formData.amount,
        description: formData.purpose,
        cnic: formData.beneficiaryCNIC,
        email: formData.beneficiaryEmail,
      };
      const result = await payAnyone(paymentData);
      if (result.success) {
        setTransactionRef(result.referenceNumber || `37S${Date.now().toString().slice(-10)}`);
        setStep('SUCCESS');
        if (onSuccess) onSuccess(result);
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Payment failed' });
      setStep('FORM');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'CONFIRM') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
            Pay Anyone
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
        <QuickAccessNavigation />
        <div className="mt-6">
          <div className="bg-[#f3f3f3] border border-gray-200 rounded px-4 py-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <p className="text-sm text-gray-700">
                You initiated a request for Pay Anyone. Please review details before you confirm!
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Transfer From</span>
                <span className="text-gray-900">{formData.transferFrom}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Amount</span>
                <span className="text-gray-900">PKR {parseFloat(formData.amount || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Payment Mode</span>
                <span className="text-gray-900">{formData.paymentMode}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Beneficiary Name</span>
                <span className="text-gray-900">{formData.beneficiaryName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Beneficiary CNIC</span>
                <span className="text-gray-900">
                  {formData.beneficiaryCNIC.slice(0, 5)}
                  {formData.beneficiaryCNIC.length > 5 && (
                    <>
                      <span className="bg-yellow-200 px-1">{formData.beneficiaryCNIC.slice(5, 12)}</span>
                      {formData.beneficiaryCNIC.length > 12 && formData.beneficiaryCNIC.slice(12)}
                    </>
                  )}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Beneficiary Mobile Number</span>
                <span className="text-gray-900">{formData.beneficiaryMobile}</span>
              </div>
              <div className="flex">
                <span className="font-semibold text-gray-700 w-48">Purpose</span>
                <span className="text-gray-900">{formData.purpose}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">*Charges will be deducted as per SOC</p>
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
            Pay Anyone
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
        <QuickAccessNavigation />
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
                <p className="text-gray-600 mb-1">Beneficiary Name</p>
                <p className="font-semibold text-gray-900">{formData.beneficiaryName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Beneficiary CNIC</p>
                <p className="font-semibold text-gray-900">{formatCNIC(formData.beneficiaryCNIC)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Amount</p>
                <p className="font-semibold text-gray-900">PKR {parseFloat(formData.amount || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Transferred From</p>
                <p className="font-semibold text-gray-900">{formData.transferFrom}</p>
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
                    transferFrom: '05280010006525770010',
                    balance: 2422.60,
                    paymentMode: 'Pay in Cash',
                    amount: '',
                    beneficiaryName: '',
                    beneficiaryCNIC: '',
                    beneficiaryMobile: '',
                    beneficiaryEmail: '',
                    purpose: '',
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
          Pay Anyone
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

      <QuickAccessNavigation />

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 flex gap-6">
        {/* Left Panel - Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Transfer From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transfer From
              </label>
              <select
                name="transferFrom"
                value={formData.transferFrom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              >
                <option value="05280010006525770010">05280010006525770010 - Current Account</option>
              </select>
              <p className="text-xs text-[#0b5394] mt-1">
                Balance: PKR {formData.balance.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Mode
              </label>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2 hover:bg-blue-600"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1V15M3 6H13M3 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Pay in Cash
              </button>
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
              <a href="#" className="text-xs text-red-600 hover:underline mt-1 inline-block">
                View Limits
              </a>
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>

            {/* Beneficiary Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary Name
              </label>
              <input
                type="text"
                name="beneficiaryName"
                value={formData.beneficiaryName}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.beneficiaryName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter beneficiary name"
              />
              {errors.beneficiaryName && <p className="text-xs text-red-500 mt-1">{errors.beneficiaryName}</p>}
            </div>

            {/* Beneficiary CNIC */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary CNIC
              </label>
              <input
                type="text"
                name="beneficiaryCNIC"
                value={formatCNIC(formData.beneficiaryCNIC)}
                onChange={handleCNICChange}
                maxLength={15}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.beneficiaryCNIC ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="3xxxxxxxxxxxxx"
              />
              {errors.beneficiaryCNIC && <p className="text-xs text-red-500 mt-1">{errors.beneficiaryCNIC}</p>}
            </div>

            {/* Beneficiary Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary Mobile Number
              </label>
              <input
                type="tel"
                name="beneficiaryMobile"
                value={formData.beneficiaryMobile}
                onChange={handleChange}
                maxLength="11"
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.beneficiaryMobile ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="03XX-XXXXXXX"
              />
              {errors.beneficiaryMobile && <p className="text-xs text-red-500 mt-1">{errors.beneficiaryMobile}</p>}
            </div>

            {/* Beneficiary Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary Email (Optional)
              </label>
              <input
                type="email"
                name="beneficiaryEmail"
                value={formData.beneficiaryEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                placeholder="Enter email address"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purpose
              </label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 ${
                  errors.purpose ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter purpose"
              />
              {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

            <div className="flex gap-3 pt-2">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm"
                >
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
                {loading ? 'Processing...' : 'Pay'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Information Card */}
        <div className="w-64 bg-[#f46a1e] text-white rounded-lg p-5 hidden md:flex flex-col justify-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-white bg-opacity-10">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 8C16.95 8 8 16.95 8 28C8 39.05 16.95 48 28 48C39.05 48 48 39.05 48 28C48 16.95 39.05 8 28 8ZM28 12C36.84 12 44 19.16 44 28C44 36.84 36.84 44 28 44C19.16 44 12 36.84 12 28C12 19.16 19.16 12 28 12Z" fill="white"/>
                <path d="M24 22H32V26H24V22ZM24 30H32V34H24V30Z" fill="white"/>
                <path d="M20 36H36V40H20V36Z" fill="white"/>
                <path d="M18 18L16 20L20 24L22 22L18 18Z" fill="white"/>
                <path d="M38 18L36 20L40 24L42 22L38 18Z" fill="white"/>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-center mb-3">Pay Anyone</h3>
          <p className="text-xs leading-relaxed text-center">
            Want to transfer funds but payee got no bank account. Don't worry as you can still make payment by simply using CNIC of the payee. Choose mode of payment Cash and enter desired info like amount, beneficiary name, CNIC, mobile number and purpose and you are done.
          </p>
        </div>
      </div>
    </div>
  );
}



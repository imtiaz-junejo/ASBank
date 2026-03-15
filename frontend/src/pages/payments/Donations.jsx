import React, { useState } from 'react';
import { donate } from '../../services/paymentApi';

const ORANGE = '#E85D04';
const BLUE = '#003366';

const ORGANIZATIONS = [
  'Edhi Foundation',
  'Shaukat Khanum',
  'Saylani Welfare',
  'JDC Foundation',
  'Other',
];

export default function Donations({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    organization: '',
    customOrganization: '',
    amount: '',
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
    const org = formData.organization === 'Other' ? formData.customOrganization : formData.organization;
    if (!org.trim()) e.organization = 'Organization is required';
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

  const confirmDonation = async () => {
    setLoading(true);
    try {
      const organization = formData.organization === 'Other' ? formData.customOrganization : formData.organization;
      const result = await donate({ organization, amount: formData.amount });
      if (result.success) {
        if (onSuccess) onSuccess(result);
        if (onClose) onClose();
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Donation failed' });
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    const organization = formData.organization === 'Other' ? formData.customOrganization : formData.organization;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold mb-4" style={{ color: BLUE }}>
            Confirm Donation
          </h2>
          <div className="space-y-2 mb-6 text-sm">
            <p>
              <span className="font-medium">Organization:</span> {organization}
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
              onClick={confirmDonation}
              className="flex-1 px-4 py-2 rounded-md text-white font-semibold"
              style={{ backgroundColor: ORANGE }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Donate'}
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
            Donations
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
              Organization *
            </label>
            <select
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.organization ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select organization</option>
              {ORGANIZATIONS.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
            {errors.organization && (
              <p className="text-xs text-red-500 mt-1">{errors.organization}</p>
            )}
          </div>

          {formData.organization === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                name="customOrganization"
                value={formData.customOrganization}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.organization ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter organization name"
              />
            </div>
          )}

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
              {loading ? 'Processing...' : 'Donate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



import React from 'react';

const ASB_BLUE = '#003366';

export default function BasicDetailsStep({ data, onChange, onBack, onNext }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <p className="text-gray-600 mb-6">Collecting your basic details.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Number</label>
          <input
            type="text"
            value={data.cnic || ''}
            onChange={(e) => onChange({ ...data, cnic: e.target.value })}
            placeholder="XXXXX-XXXXXXX-X"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            value={data.mobile || ''}
            onChange={(e) => onChange({ ...data, mobile: e.target.value })}
            placeholder="03XXXXXXXXX"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
          <p className="text-xs text-gray-500 mt-1">Provide number registered on your CNIC.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Issue Date</label>
          <input
            type="text"
            value={data.cnicIssueDate || ''}
            onChange={(e) => onChange({ ...data, cnicIssueDate: e.target.value })}
            placeholder="DD/MM/YYYY"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Expiry Date</label>
          <input
            type="text"
            value={data.cnicIssueDate || ''}
            onChange={(e) => onChange({ ...data, cnicIssueDate: e.target.value })}
            placeholder="DD/MM/YYYY"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-1.5 rounded-md font-semibold border-2 bg-white"
          style={{ borderColor: ASB_BLUE, color: ASB_BLUE }}
        >
          BACK
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-1.5 rounded-md font-semibold text-white"
          style={{ backgroundColor: ASB_BLUE }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

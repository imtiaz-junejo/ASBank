import React from 'react';

const ASB_BLUE = '#003366';

const GENDER_OPTIONS = ['Male', 'Female', 'Transgender'];

export default function PersonalDetailsStep({ data, onChange, onBack, onNext }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Father/Husband Name</label>
          <input
            type="text"
            value={data.fatherHusbandName || ''}
            onChange={(e) => onChange({ ...data, fatherHusbandName: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="text"
            value={data.dateOfBirth || ''}
            onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
            placeholder="DD/MM/YYYY"
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ ...data, gender: opt })}
                className="px-4 py-2 rounded-3xl font-medium text-sm border-2 transition-colors"
                style={{
                  backgroundColor: data.gender === opt ? ASB_BLUE : 'rgba(0,51,102,0.12)',
                  color: data.gender === opt ? '#fff' : ASB_BLUE,
                  borderColor: data.gender === opt ? ASB_BLUE : 'rgba(0,51,102,0.3)',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
          <input
            type="text"
            value={data.placeOfBirth || ''}
            onChange={(e) => onChange({ ...data, placeOfBirth: e.target.value })}
            placeholder="Enter your place of birth"
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

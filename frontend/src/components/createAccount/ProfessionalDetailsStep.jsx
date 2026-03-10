import React from 'react';

const ASB_BLUE = '#003366';

const OCCUPATIONS = ['Employed', 'Self-Employed', 'Business', 'Student', 'Retired', 'Other'];
const PROFESSIONS = ['Engineer', 'Doctor', 'Teacher', 'Accountant', 'Lawyer', 'Other'];

export default function ProfessionalDetailsStep({ data, onChange, onBack, onSubmit }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
          <select
            value={data.occupation || ''}
            onChange={(e) => onChange({ ...data, occupation: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          >
            <option value="">Please select occupation</option>
            {OCCUPATIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
          <select
            value={data.profession || ''}
            onChange={(e) => onChange({ ...data, profession: e.target.value })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-[#003366]"
          >
            <option value="">Please select profession</option>
            {PROFESSIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
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
          onClick={onSubmit}
          className="px-6 py-1.5 rounded-md font-semibold text-white"
          style={{ backgroundColor: ASB_BLUE }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

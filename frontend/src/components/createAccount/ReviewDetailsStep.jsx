import React from 'react';

const ASB_BLUE = '#003366';

function ReviewSection({ title, children, onEdit }) {
  return (
    <div className="bg-gray-300 rounded-lg p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label={`Edit ${title}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          EDIT
        </button>
      </div>
      <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
  );
}

export default function ReviewDetailsStep({ data, onEditSection, onSubmit }) {
  const accountTypeLabel =
    { asaan: 'Asaan Account', savings: 'Savings Account', current: 'Current Account' }[data.accountType] ||
    'Asaan Account';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <p className="text-gray-600 mb-6">
        Confirm details before submission. You can edit using EDIT button.
      </p>

      <div className="space-y-4">
        <ReviewSection title="Basic Details" onEdit={() => onEditSection(1)}>
          <p><span className="font-medium">CNIC Number:</span> {data.cnic || '—'}</p>
          <p><span className="font-medium">Mobile Number:</span> {data.mobile || '—'}</p>
          <p><span className="font-medium">Account Type:</span> {accountTypeLabel}</p>
          <p><span className="font-medium">CNIC Issue Date:</span> {data.cnicIssueDate || '—'}</p>
        </ReviewSection>

        <ReviewSection title="Personal Details" onEdit={() => onEditSection(2)}>
          <p><span className="font-medium">Name:</span> {data.name || '—'}</p>
          <p><span className="font-medium">Father/Husband Name:</span> {data.fatherHusbandName || '—'}</p>
          <p><span className="font-medium">Date of Birth:</span> {data.dateOfBirth || '—'}</p>
          <p><span className="font-medium">Gender:</span> {data.gender || '—'}</p>
          <p><span className="font-medium">Place of Birth:</span> {data.placeOfBirth || '—'}</p>
        </ReviewSection>

        <ReviewSection title="Occupation/Profession Details" onEdit={() => onEditSection(3)}>
          <p><span className="font-medium">Occupation:</span> {data.occupation || '—'}</p>
          <p><span className="font-medium">Profession:</span> {data.profession || '—'}</p>
        </ReviewSection>

        <ReviewSection title="Account & Security" onEdit={() => onEditSection(4)}>
          <p><span className="font-medium">Account Title:</span> {data.accountTitle || '—'}</p>
          <p><span className="font-medium">Email Address:</span> {data.email || '—'}</p>
          <p><span className="font-medium">Voice verification:</span> {data.voiceRecorded ? 'Recorded' : '—'}</p>
        </ReviewSection>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={onSubmit}
          className="px-10 py-1.5 rounded-md font-semibold text-white text-base"
          style={{ backgroundColor: ASB_BLUE }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}

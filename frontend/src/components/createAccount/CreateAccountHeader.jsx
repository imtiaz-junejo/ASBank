import React from 'react';
import { Link } from 'react-router-dom';

const ASB_ORANGE = '#E85D04';
const ASB_BLUE = '#003366';

const STEPS = [
  'Basic Details',
  'Personal Details',
  'Occupation/ Profession Details',
  'Account & Security',
  'Review Details',
];

export default function CreateAccountHeader({ currentStep, onBack, showProgress = true }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span
            className="inline-flex items-center justify-center w-10 h-10 text-white font-bold text-xl shrink-0 rounded"
            style={{ backgroundColor: ASB_ORANGE }}
          >
            AS
          </span>
          <span className="font-bold text-xl" style={{ color: ASB_BLUE }}>
            Bank Limited
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: ASB_BLUE }}>
            my PAKISTAN DIGITAL ACCOUNT
          </span>
        </div>
      </div>
      {showProgress && (
        <>
          <div className="h-2 flex">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="flex-1 transition-colors"
                style={{
                  backgroundColor: i + 1 <= currentStep ? ASB_BLUE : ASB_ORANGE,
                  opacity: i + 1 === currentStep ? 1 : 0.7,
                }}
              />
            ))}
          </div>
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-1 rounded hover:bg-gray-100 text-gray-600"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1
              className="text-lg font-semibold"
              style={{ color: currentStep === 2 ? ASB_ORANGE : ASB_BLUE }}
            >
              {STEPS[currentStep - 1]}
            </h1>
          </div>
        </>
      )}
    </header>
  );
}

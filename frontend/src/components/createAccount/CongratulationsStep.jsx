import React from 'react';

const ASB_ORANGE = '#E85D04';
const ASB_BLUE = '#003366';

export default function CongratulationsStep({ data, onFinish }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
          style={{ backgroundColor: ASB_ORANGE }}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: ASB_ORANGE }}>
          Congratulations...!
        </h2>
        <p className="text-gray-600">Your account has successfully been opened.</p>
      </div>

      <div className="bg-gray-300 rounded-lg p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Account Details</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Title of Account:</span> {data.accountTitle || data.name || '—'}</p>
          <p><span className="font-medium">Branch:</span> Public School Hyderabad</p>
          <p>
            <span className="font-medium">Account Number:</span>{' '}
            0010 1601 1275 0019
            <button type="button" className="ml-1 p-0.5 rounded hover:bg-gray-200" aria-label="Copy">
              <svg className="w-4 h-4 inline text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m0 10h2a2 2 0 002-2v-2m0 4V6a2 2 0 00-2-2h-2m-4-1h8a2 2 0 012 2v10a2 2 0 01-2 2h-2m-4-1H6" />
              </svg>
            </button>
          </p>
          <p>
            <span className="font-medium">IBAN:</span> PK73 ABPA 0010 1601 1275 0019
            <button type="button" className="ml-1 p-0.5 rounded hover:bg-gray-200" aria-label="Copy">
              <svg className="w-4 h-4 inline text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m0 10h2a2 2 0 002-2v-2m0 4V6a2 2 0 00-2-2h-2m-4-1h-2m-4-1H6" />
              </svg>
            </button>
          </p>
          <p><span className="font-medium">Transaction Limit:</span> 3,000,000/-</p>
          <p><span className="font-medium">Debit Card Charges:</span> As Per SOC</p>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-3 mb-8">
        <p>Your Debit Card will be delivered within 2-3 working days at your address.</p>
        <p>
          <span className="font-medium">Ways to deposit funds:</span> Funds transfer / RAAST from any account.
          Cash deposit from any ABL Branch. Click to see nearest branches.
        </p>
        <p>
          If you require a Cheque Book with your Digital Account, please apply through myABL app or visit your
          designated branch to apply for your first cheque book and provide specimen signature.
        </p>
        <p>
          Get ready to effortlessly manage your money with myABL Digital Banking. Register on myABL Digital
          Banking now!
        </p>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onFinish}
          className="px-10 py-1.5 rounded-md font-semibold text-white"
          style={{ backgroundColor: ASB_BLUE }}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

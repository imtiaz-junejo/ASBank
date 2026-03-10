import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccountHeader from '../components/createAccount/CreateAccountHeader';

const ASB_ORANGE = '#E85D04';
const ASB_BLUE = '#003366';
const ASB_GREY_BG = '#F5F5F5';

export default function LoansPage() {
  const [loanType, setLoanType] = useState('Personal');
  const [fixedOrVariable, setFixedOrVariable] = useState('Fixed');
  const [loanAmount, setLoanAmount] = useState(30000);
  const [termMonths, setTermMonths] = useState(12);
  const navigate = useNavigate();

  const minAmount = 30000;
  const maxAmount = 3000000;
  const minMonths = 12;
  const maxMonths = 60;

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <CreateAccountHeader
        currentStep={0}
        onBack={handleBack}
        showProgress={false}
      />
      <div className="min-h-[60vh]" style={{ backgroundColor: ASB_GREY_BG }}>
        <div className="max-w-[1400px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
          {/* Left: decorative image area with orange dots and blue curves */}
          <div className="lg:w-2/5 relative shrink-0">
            <div className="relative rounded-2xl overflow-hidden aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500 p-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gray-400/30 mb-4 flex items-center justify-center text-4xl">👥</div>
                  <p className="text-sm">Your financial goals, our support</p>
                </div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
                <path d="M 0 80 Q 50 40 100 80 T 200 80" stroke={ASB_BLUE} strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M 0 120 Q 80 90 160 120" stroke={ASB_BLUE} strokeWidth="1.5" fill="none" opacity="0.4" />
                {[...Array(12)].map((_, i) => (
                  <circle key={i} cx={20 + i * 15} cy={30 + (i % 3) * 50} r="3" fill={ASB_ORANGE} opacity="0.6" />
                ))}
              </svg>
            </div>
          </div>

          {/* Right: Loan calculator */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-1" style={{ color: ASB_ORANGE }}>LOANS</h1>
            <p className="text-gray-700 mb-8">Let's Calculate your Loans</p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['Personal Loan', 'Home Loan', 'Car Loan'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLoanType(type)}
                  className="px-6 py-2.5 rounded text-sm font-semibold border-2 transition-colors"
                  style={
                    loanType === type
                      ? { backgroundColor: ASB_ORANGE, color: 'white', borderColor: ASB_ORANGE }
                      : { backgroundColor: 'white', color: 'black', borderColor: '#ddd' }
                  }
                >
                  {type}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-700 mb-4">How much do you need?</h2>

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="fixedVar"
                  checked={fixedOrVariable === 'Fixed'}
                  onChange={() => setFixedOrVariable('Fixed')}
                  className="w-4 h-4"
                  style={{ accentColor: ASB_ORANGE }}
                />
                <span className="text-gray-700">Fixed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="fixedVar"
                  checked={fixedOrVariable === 'Variable'}
                  onChange={() => setFixedOrVariable('Variable')}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Variable</span>
              </label>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-mono min-w-[80px]">
                    {loanAmount.toLocaleString('en-PK')}
                  </span>
                  <input
                    type="range"
                    min={minAmount}
                    max={maxAmount}
                    step={10000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="flex-1 h-2 rounded appearance-none cursor-pointer"
                    style={{ accentColor: ASB_ORANGE }}
                  />
                  <span className="text-gray-500 text-sm">30,00,000</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30,000</span>
                  <span>30,00,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms Length (Months)</label>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-mono min-w-[80px]">{termMonths} months</span>
                  <input
                    type="range"
                    min={minMonths}
                    max={maxMonths}
                    step={6}
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    className="flex-1 h-2 rounded appearance-none cursor-pointer"
                    style={{ accentColor: ASB_ORANGE }}
                  />
                  <span className="text-gray-500 text-sm">60 months</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>12 months</span>
                  <span>60 months</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">You are getting</p>
                <p className="text-xl font-bold" style={{ color: ASB_ORANGE }}>RS. 0</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Terms of use</p>
                <p className="text-xl font-bold" style={{ color: ASB_ORANGE }}>Month 0</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">You must return</p>
                <p className="text-xl font-bold" style={{ color: ASB_ORANGE }}>RS. 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

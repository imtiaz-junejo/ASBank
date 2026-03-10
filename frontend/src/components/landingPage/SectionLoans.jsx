import React, { useState } from 'react';
import { ASB_ORANGE, ASB_BLUE, ASB_GREY_BG } from '../ASBankLayout';

// Offline-safe "images" (SVG data URIs) so images always render.
function svgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeCardSvg(seed, label) {
  const o = '#E85D04';
  const b = '#003366';
  const bg1 = '#f2f2f2';
  const bg2 = '#e5e7eb';
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const x = 60 + (hash % 260);
  const y = 50 + (hash % 140);
  return svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}" />
      <stop offset="1" stop-color="${bg2}" />
    </linearGradient>
    <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${b}" />
      <stop offset="1" stop-color="${o}" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <path d="M0 420 C 140 330, 240 520, 380 430 S 640 410, 800 470" fill="none" stroke="rgba(0,51,102,0.22)" stroke-width="10"/>
  <path d="M0 480 C 160 420, 260 560, 420 490 S 650 470, 800 520" fill="none" stroke="rgba(232,93,4,0.22)" stroke-width="10"/>
  <circle cx="${x}" cy="${y}" r="88" fill="rgba(232,93,4,0.18)"/>
  <circle cx="${x + 120}" cy="${y + 90}" r="110" fill="rgba(0,51,102,0.12)"/>
  <rect x="56" y="56" width="688" height="488" rx="24" fill="rgba(255,255,255,0.65)" stroke="rgba(0,0,0,0.06)"/>
  <text x="92" y="132" font-family="Inter, Arial" font-size="30" font-weight="800" fill="${b}">ASBank</text>
  <text x="92" y="170" font-family="Inter, Arial" font-size="18" fill="rgba(0,0,0,0.62)">${label}</text>
  <rect x="92" y="210" width="180" height="10" rx="5" fill="rgba(0,0,0,0.12)"/>
  <rect x="92" y="236" width="280" height="10" rx="5" fill="rgba(0,0,0,0.10)"/>
  <rect x="92" y="262" width="240" height="10" rx="5" fill="rgba(0,0,0,0.10)"/>
  <rect x="92" y="306" width="220" height="44" rx="10" fill="url(#a)" opacity="0.95"/>
  <text x="112" y="336" font-family="Inter, Arial" font-size="16" font-weight="700" fill="#ffffff">Explore</text>
</svg>
`);
}

export default function SectionLoans() {
  const [loanType, setLoanType] = useState('Personal');
  const [fixedOrVariable, setFixedOrVariable] = useState('Fixed');
  const [loanAmount, setLoanAmount] = useState(30000);
  const [termMonths, setTermMonths] = useState(12);
  const minAmount = 30000;
  const maxAmount = 3000000;
  const minMonths = 12;
  const maxMonths = 60;

  return (
    <section id="loans" className="min-h-[60vh] scroll-mt-24" style={{ backgroundColor: ASB_GREY_BG }}>
      <div className="max-w-[1400px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/5 relative shrink-0">
          <div className="relative rounded-2xl overflow-hidden aspect-square max-w-md">
            <img
              src={makeCardSvg('loans', 'Loans · Financial Support')}
              alt="Loans and financial support"
              className="w-full h-full object-cover"
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 200 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 80 Q 50 40 100 80 T 200 80"
                stroke={ASB_BLUE}
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M 0 120 Q 80 90 160 120"
                stroke={ASB_BLUE}
                strokeWidth="1.5"
                fill="none"
                opacity="0.4"
              />
              {[...Array(12)].map((_, i) => (
                <circle
                  key={i}
                  cx={20 + i * 15}
                  cy={30 + (i % 3) * 50}
                  r="3"
                  fill={ASB_ORANGE}
                  opacity="0.6"
                />
              ))}
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h1
            className="text-4xl font-bold mb-1"
            style={{ color: ASB_ORANGE }}
          >
            LOANS
          </h1>
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
                    ? {
                        backgroundColor: ASB_ORANGE,
                        color: 'white',
                        borderColor: ASB_ORANGE,
                      }
                    : {
                        backgroundColor: 'white',
                        color: 'black',
                        borderColor: '#ddd',
                      }
                }
              >
                {type}
              </button>
            ))}
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            How much do you need?
          </h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount
              </label>
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
                  onChange={(e) =>
                    setLoanAmount(Number(e.target.value))
                  }
                  className="flex-1 h-2 rounded cursor-pointer"
                  style={{ accentColor: ASB_ORANGE }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30,000</span>
                <span>30,00,000</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms Length (Months)
              </label>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-mono min-w-[80px]">
                  {termMonths} months
                </span>
                <input
                  type="range"
                  min={minMonths}
                  max={maxMonths}
                  step={6}
                  value={termMonths}
                  onChange={(e) =>
                    setTermMonths(Number(e.target.value))
                  }
                  className="flex-1 h-2 rounded cursor-pointer"
                  style={{ accentColor: ASB_ORANGE }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12 months</span>
                <span>60 months</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                You are getting
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: ASB_ORANGE }}
              >
                RS. 0
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Terms of use
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: ASB_ORANGE }}
              >
                Month 0
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                You must return
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: ASB_ORANGE }}
              >
                RS. 0
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

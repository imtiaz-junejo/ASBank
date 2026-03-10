import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccountHeader from '../components/createAccount/CreateAccountHeader';

const ASB_ORANGE = '#E85D04';
const ASB_BLUE = '#003366';
const ASB_GREY_BG = '#F5F5F5';

const CARD_TABS = ['DEBIT CARDS', 'CREDIT CARDS', 'DEALS & DISCOUNTS'];

const CARDS = [
  {
    id: 1,
    type: 'Infinite',
    style: 'grey',
    logo: 'A',
    chip: true,
    number: '**** **** **** ****',
    validFrom: '01/22',
    validThru: '01/27',
    visa: 'VISA',
  },
  {
    id: 2,
    type: 'Premium',
    style: 'gold',
    label: 'ASBank DEBIT CARD',
    logo: 'A',
    chip: true,
    contactless: true,
    number: '4075 7200 1234 5678',
    validFrom: '01/22',
    validThru: '01/27',
    visa: 'VISA Signature',
  },
  {
    id: 3,
    type: 'Visa Platinum',
    style: 'black',
    label: 'ASBank Visa Platinum',
    logo: 'A',
    chip: true,
    contactless: true,
    number: '4286 3800 1234 5678',
    validFrom: '12/22',
    validThru: '12/27',
    visa: 'VISA Debit',
  },
];

export default function CardsPage() {
  const [activeTab, setActiveTab] = useState('DEBIT CARDS');
  const navigate = useNavigate();

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
      <div className="py-12 md:py-16" style={{ backgroundColor: ASB_GREY_BG }}>
        <div className="max-w-[1400px] mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2" style={{ color: ASB_ORANGE }}>
            ASBANK CARDS
          </h1>
          <p className="text-gray-600 text-center mb-10">Enable cashless banking with ASB Cards</p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CARD_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded text-sm font-semibold border-2 transition-colors"
                style={
                  activeTab === tab
                    ? { backgroundColor: ASB_ORANGE, color: 'white', borderColor: ASB_ORANGE }
                    : { backgroundColor: 'white', color: 'black', borderColor: ASB_ORANGE }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              className="shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              style={{ color: ASB_ORANGE }}
              aria-label="Previous card"
            >
              ‹
            </button>

            <div className="flex gap-6 justify-center flex-wrap">
              {CARDS.map((card) => (
                <div key={card.id} className="shrink-0 w-72">
                  <div
                    className="rounded-xl p-5 min-h-[180px] flex flex-col justify-between text-white shadow-lg"
                    style={{
                      background:
                        card.style === 'gold'
                          ? 'linear-gradient(135deg, #c9a227 0%, #b8860b 100%)'
                          : undefined,
                      backgroundColor: card.style === 'gold' ? undefined : card.style === 'black' ? '#1a1a1a' : '#6b7280',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className="w-8 h-8 flex items-center justify-center text-lg font-bold rounded"
                        style={{ backgroundColor: ASB_ORANGE }}
                      >
                        {card.logo}
                      </span>
                      {card.chip && (
                        <div className="w-10 h-8 bg-linear-to-br from-amber-200 to-amber-400 rounded flex items-center justify-center text-xs text-amber-900">
                          chip
                        </div>
                      )}
                    </div>
                    {card.label && (
                      <p className="text-xs opacity-90 mt-2">{card.label}</p>
                    )}
                    <p className="text-lg font-serif tracking-wide">{card.type}</p>
                    <div className="flex gap-2 mt-2">
                      {card.contactless && (
                        <span className="text-xs border border-white/50 rounded px-1">⌃ contactless</span>
                      )}
                    </div>
                    <p className="font-mono text-sm tracking-widest mt-2">{card.number}</p>
                    <div className="flex justify-between text-xs mt-2">
                      <span>VALID FROM {card.validFrom}</span>
                      <span>VALID THRU {card.validThru}</span>
                    </div>
                    <p className="text-xs uppercase mt-1 opacity-80">Cardholder Name</p>
                    <p className="text-right text-xs font-semibold mt-1">{card.visa}</p>
                  </div>
                  <a
                    href="#learn"
                    className="inline-block mt-3 text-sm font-semibold hover:underline"
                    style={{ color: ASB_ORANGE }}
                  >
                    Learn More
                  </a>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: ASB_ORANGE }}
              aria-label="Next card"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

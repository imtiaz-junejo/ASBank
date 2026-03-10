import React from 'react';
import { ASB_ORANGE, ASB_BLUE, ASB_GREY_BG } from '../ASBankLayout';

const AWARDS = [
  {
    id: 1,
    title: 'Global Diversity, Equity & Inclusion Benchmarks (GDIB) Awards 2026',
    subtitle: 'Inclusion Benchmarks Awards · Presented to ASBank Limited',
  },
  {
    id: 2,
    title: 'Asian Technology Excellence Awards 2025',
    subtitle: 'Pakistan Technology Excellence Awards 2025 · Virtualisation - Banking ASBank · Digital - Banking ASBank',
  },
  {
    id: 3,
    title: 'Most Compliant Bank of 2025',
    subtitle: 'State Bank of Pakistan BSC Karachi Office · National Financial Literacy Program-II (FY 2024-25) · Most Compliant Bank ASBank Limited',
  },
  {
    id: 4,
    title: 'Women Empowerment & Gender Equality Diamond Recognition Award 2025',
    subtitle: "Women Empowerment and Gender Equality Recognition Award '25 · Presented to ASBank Limited",
  },
];

export default function SectionAwards() {
  return (
    <section id="awards" className="py-12 md:py-16 scroll-mt-24" style={{ backgroundColor: ASB_GREY_BG }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12" style={{ color: ASB_ORANGE }}>
          AWARDS AND RECOGNITIONS
        </h1>

        <div className="relative flex items-center gap-4">
          <button
            type="button"
            className="shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
            style={{ borderColor: ASB_ORANGE, color: ASB_ORANGE }}
            aria-label="Previous awards"
          >
            ‹
          </button>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AWARDS.map((award) => (
              <div
                key={award.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-32 flex items-center justify-center mb-4 bg-gray-100 rounded">
                  <span style={{ color: ASB_ORANGE }}>🏆</span>
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: ASB_BLUE }}>
                  {award.title}
                </h3>
                <p className="text-xs text-gray-600">{award.subtitle}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
            style={{ borderColor: ASB_ORANGE, color: ASB_ORANGE }}
            aria-label="Next awards"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

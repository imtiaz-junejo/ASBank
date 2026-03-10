import React from 'react';
import { Link } from 'react-router-dom';
import { ASB_ORANGE, ASB_GREY_BG } from '../ASBankLayout';

const NEWS_CARDS = [
  {
    id: 1,
    title: 'Leading The Way In Community Welfare And Preserving Cultural Heritage | ASBank',
    imagePlaceholder: 'Group of people outdoors',
  },
  {
    id: 2,
    title: 'Driving Digital Innovation: ASBank And LUMS Host 4th Fintech Hackathon',
    imagePlaceholder: 'Conference / event gathering',
  },
  {
    id: 3,
    title: "ASBank Women's Futsal Cup | Empowering Women Through Sport",
    imagePlaceholder: "Women's futsal team",
  },
  {
    id: 4,
    title: 'GoFlour | ASBank Kahani',
    imagePlaceholder: 'Outdoor cafe setting',
    overlay: 'Dated: 20th Oct 2025 · Read More',
  },
];

export default function SectionLatestNews() {
  return (
    <section id="news" className="py-12 md:py-16 scroll-mt-24" style={{ backgroundColor: ASB_GREY_BG }}>
      <div className="max-w-[1400px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2" style={{ color: ASB_ORANGE }}>
          LATEST NEWS
        </h1>
        <p className="text-gray-600 text-center mb-10">Stay connected with ASB</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NEWS_CARDS.map((card) => (
            <article key={card.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-4/3 bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                  {card.imagePlaceholder}
                </div>
                <div
                  className="absolute inset-0 border-2 border-dashed rounded-t-lg pointer-events-none"
                  style={{ borderColor: ASB_ORANGE }}
                />
                {card.overlay && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 flex justify-between items-center">
                    <span>{card.overlay.split(' · ')[0]}</span>
                    <span className="underline">Read More</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-gray-800 text-sm font-medium leading-snug">{card.title}</h2>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center mt-10">
          <Link to="/news" className="text-gray-600 hover:underline text-sm">
            VIEW ALL NEWS
          </Link>
        </p>
      </div>
    </section>
  );
}

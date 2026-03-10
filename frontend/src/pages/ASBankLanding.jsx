import React, { useState } from 'react';
import ASBankLayout, { ASB_ORANGE, ASB_BLUE, ASB_GREY_BG, ASB_DARK_GREY } from '../components/ASBankLayout';
import SectionLoans from '../components/landingPage/SectionLoans';
import SectionCards from '../components/landingPage/SectionCards';
import SectionLatestNews from '../components/landingPage/SectionLatestNews';
import SectionAwards from '../components/landingPage/SectionAwards';

// Offline-safe “images” (SVG data URIs) so images always render.
function svgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeHeroSvg(title, subtitle) {
  return svgDataUri(`\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\" viewBox=\"0 0 800 600\">\n  <defs>\n    <linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"#0b2d4d\" />\n      <stop offset=\"0.55\" stop-color=\"#1b4b7a\" />\n      <stop offset=\"1\" stop-color=\"#E85D04\" />\n    </linearGradient>\n    <radialGradient id=\"r\" cx=\"20%\" cy=\"80%\" r=\"70%\">\n      <stop offset=\"0\" stop-color=\"rgba(255,255,255,0.22)\" />\n      <stop offset=\"1\" stop-color=\"rgba(255,255,255,0)\" />\n    </radialGradient>\n  </defs>\n  <rect width=\"800\" height=\"600\" fill=\"url(#g)\" />\n  <rect width=\"800\" height=\"600\" fill=\"url(#r)\" />\n  <circle cx=\"640\" cy=\"120\" r=\"80\" fill=\"rgba(255,255,255,0.15)\" />\n  <circle cx=\"700\" cy=\"210\" r=\"120\" fill=\"rgba(255,255,255,0.08)\" />\n  <g fill=\"rgba(255,255,255,0.16)\">\n    <rect x=\"60\" y=\"90\" width=\"260\" height=\"160\" rx=\"18\" />\n    <rect x=\"90\" y=\"120\" width=\"200\" height=\"18\" rx=\"9\" />\n    <rect x=\"90\" y=\"155\" width=\"160\" height=\"18\" rx=\"9\" />\n    <rect x=\"90\" y=\"190\" width=\"120\" height=\"18\" rx=\"9\" />\n  </g>\n  <text x=\"64\" y=\"330\" font-family=\"Inter, Arial\" font-size=\"44\" font-weight=\"800\" fill=\"#ffffff\">${title}</text>\n  <text x=\"64\" y=\"370\" font-family=\"Inter, Arial\" font-size=\"22\" fill=\"rgba(255,255,255,0.9)\">${subtitle}</text>\n  <text x=\"64\" y=\"520\" font-family=\"Inter, Arial\" font-size=\"14\" fill=\"rgba(255,255,255,0.75)\">ASBank · Digital Experience</text>\n</svg>\n`);
}

const NEWS_CARDS = [
  {
    id: 1,
    title:
      'Leading The Way In Community Welfare And Preserving Cultural Heritage | ASBank',
    seed: 'news1',
  },
  {
    id: 2,
    title:
      'Driving Digital Innovation: ASBank And LUMS Host 4th Fintech Hackathon',
    seed: 'news2',
  },
  {
    id: 3,
    title:
      "ASBank Women's Futsal Cup | Empowering Women Through Sport",
    seed: 'news3',
  },
  {
    id: 4,
    title: 'GoFlour | ASBank Kahani',
    seed: 'news4',
    overlay: 'Dated: 20th Oct 2025 · Read More',
  },
];

const AWARDS = [
  {
    id: 1,
    title:
      'Global Diversity, Equity & Inclusion Benchmarks (GDIB) Awards 2026',
    subtitle:
      'Inclusion Benchmarks Awards · Presented to ASBank Limited',
    seed: 'award1',
  },
  {
    id: 2,
    title: 'Asian Technology Excellence Awards 2025',
    subtitle:
      'Pakistan Technology Excellence Awards 2025 · Virtualisation - Banking ASBank · Digital - Banking ASBank',
    seed: 'award2',
  },
  {
    id: 3,
    title: 'Most Compliant Bank of 2025',
    subtitle:
      'State Bank of Pakistan BSC Karachi Office · National Financial Literacy Program-II (FY 2024-25) · Most Compliant Bank ASBank Limited',
    seed: 'award3',
  },
  {
    id: 4,
    title:
      'Women Empowerment & Gender Equality Diamond Recognition Award 2025',
    subtitle:
      "Women Empowerment and Gender Equality Recognition Award '25 · Presented to ASBank Limited",
    seed: 'award4',
  },
];

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

function makeCardSvg(seed, label) {
  const o = '#E85D04';
  const b = '#003366';
  const bg1 = '#f2f2f2';
  const bg2 = '#e5e7eb';
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const x = 60 + (hash % 260);
  const y = 50 + (hash % 140);
  return svgDataUri(`\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\" viewBox=\"0 0 800 600\">\n  <defs>\n    <linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"${bg1}\" />\n      <stop offset=\"1\" stop-color=\"${bg2}\" />\n    </linearGradient>\n    <linearGradient id=\"a\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"${b}\" />\n      <stop offset=\"1\" stop-color=\"${o}\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"800\" height=\"600\" fill=\"url(#bg)\"/>\n  <path d=\"M0 420 C 140 330, 240 520, 380 430 S 640 410, 800 470\" fill=\"none\" stroke=\"rgba(0,51,102,0.22)\" stroke-width=\"10\"/>\n  <path d=\"M0 480 C 160 420, 260 560, 420 490 S 650 470, 800 520\" fill=\"none\" stroke=\"rgba(232,93,4,0.22)\" stroke-width=\"10\"/>\n  <circle cx=\"${x}\" cy=\"${y}\" r=\"88\" fill=\"rgba(232,93,4,0.18)\"/>\n  <circle cx=\"${x + 120}\" cy=\"${y + 90}\" r=\"110\" fill=\"rgba(0,51,102,0.12)\"/>\n  <rect x=\"56\" y=\"56\" width=\"688\" height=\"488\" rx=\"24\" fill=\"rgba(255,255,255,0.65)\" stroke=\"rgba(0,0,0,0.06)\"/>\n  <text x=\"92\" y=\"132\" font-family=\"Inter, Arial\" font-size=\"30\" font-weight=\"800\" fill=\"${b}\">ASBank</text>\n  <text x=\"92\" y=\"170\" font-family=\"Inter, Arial\" font-size=\"18\" fill=\"rgba(0,0,0,0.62)\">${label}</text>\n  <rect x=\"92\" y=\"210\" width=\"180\" height=\"10\" rx=\"5\" fill=\"rgba(0,0,0,0.12)\"/>\n  <rect x=\"92\" y=\"236\" width=\"280\" height=\"10\" rx=\"5\" fill=\"rgba(0,0,0,0.10)\"/>\n  <rect x=\"92\" y=\"262\" width=\"240\" height=\"10\" rx=\"5\" fill=\"rgba(0,0,0,0.10)\"/>\n  <rect x=\"92\" y=\"306\" width=\"220\" height=\"44\" rx=\"10\" fill=\"url(#a)\" opacity=\"0.95\"/>\n  <text x=\"112\" y=\"336\" font-family=\"Inter, Arial\" font-size=\"16\" font-weight=\"700\" fill=\"#ffffff\">Explore</text>\n</svg>\n`);
}

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Zarkhez-e — A Landmark Initiative By The Govt. of Pakistan to Empower Farmers',
    body:
      'A major initiative by the Government of Pakistan enabling farmers to access easy agricultural loans of up to PKR 1 million through Zarkhez-e. Apply from home and purchase certified inputs and diesel for your farming needs via the Zarkhez-e app.',
    seed: 'zarkhez',
  },
  {
    id: 2,
    title: 'Instant Digital Account Opening',
    body:
      'Open your digital account from the comfort of your home and start banking instantly with ASBank digital channels.',
    seed: 'digital-account',
  },
  {
    id: 3,
    title: 'myASB – Banking At Your Fingertips',
    body:
      'Pay bills, transfer funds, and manage your finances securely anytime, anywhere with the myASB mobile app.',
    seed: 'myasb-app',
  },
  {
    id: 4,
    title: 'Empowering Women Entrepreneurs',
    body:
      'Specialised financing and advisory services designed to help women-led businesses grow and thrive.',
    seed: 'women-entrepreneurs',
  },
];

function makeZarkhezHeroSvg(seed) {
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const offset = 40 + (hash % 40);
  return svgDataUri(`\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"900\" height=\"400\" viewBox=\"0 0 900 400\">\n  <defs>\n    <linearGradient id=\"sky\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"#e5f3ff\" />\n      <stop offset=\"1\" stop-color=\"#ffffff\" />\n    </linearGradient>\n    <linearGradient id=\"field\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\">\n      <stop offset=\"0\" stop-color=\"#f9c74f\" />\n      <stop offset=\"1\" stop-color=\"#f9844a\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"900\" height=\"400\" fill=\"#ffffff\" rx=\"32\" />\n  <rect x=\"0\" y=\"0\" width=\"900\" height=\"260\" fill=\"url(#sky)\" rx=\"32\" />\n  <rect x=\"0\" y=\"220\" width=\"900\" height=\"180\" fill=\"url(#field)\" />\n  <g opacity=\"0.35\" fill=\"#f3722c\">\n    <rect x=\"80\" y=\"${230 + offset / 4}\" width=\"110\" height=\"80\" rx=\"8\" />\n    <rect x=\"210\" y=\"${220 + offset / 6}\" width=\"130\" height=\"90\" rx=\"8\" />\n    <rect x=\"360\" y=\"${240 + offset / 5}\" width=\"150\" height=\"70\" rx=\"8\" />\n  </g>\n  <g transform=\"translate(540 70)\">\n    <rect x=\"30\" y=\"0\" width=\"200\" height=\"320\" rx=\"28\" fill=\"#ffffff\" stroke=\"#f3722c\" stroke-width=\"4\" />\n    <rect x=\"52\" y=\"40\" width=\"156\" height=\"220\" rx=\"20\" fill=\"#0f172a\" />\n    <rect x=\"52\" y=\"40\" width=\"156\" height=\"60\" rx=\"20\" fill=\"#22c55e\" />\n    <text x=\"130\" y=\"78\" text-anchor=\"middle\" font-family=\"Inter, Arial\" font-size=\"18\" font-weight=\"700\" fill=\"#ffffff\">zarkhez-e</text>\n    <circle cx=\"130\" cy=\"190\" r=\"42\" fill=\"#eab308\" />\n    <path d=\"M110 200 L130 165 L150 200 Z\" fill=\"#f97316\" />\n    <rect x=\"90\" y=\"260\" width=\"80\" height=\"10\" rx=\"5\" fill=\"#e5e7eb\" />\n  </g>\n  <g transform=\"translate(650 150)\">\n    <rect x=\"0\" y=\"60\" width=\"160\" height=\"90\" rx=\"16\" fill=\"#ffffff\" stroke=\"#f3722c\" stroke-width=\"3\" />\n    <rect x=\"18\" y=\"82\" width=\"124\" height=\"14\" rx=\"7\" fill=\"#e5e7eb\" />\n    <rect x=\"18\" y=\"106\" width=\"90\" height=\"10\" rx=\"5\" fill=\"#e5e7eb\" />\n  </g>\n</svg>\n`);
}

function SectionHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = HERO_SLIDES.length;
  const current = HERO_SLIDES[activeIndex];

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <section className="py-10" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-[32px] font-bold leading-snug" style={{ color: ASB_DARK_GREY }}>
            {current.title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">{current.body}</p>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={goPrev}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: ASB_ORANGE }}
              aria-label="Previous slide"
            >
              ‹
            </button>

            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="w-2.5 h-2.5 rounded-full border transition-all"
                  style={{
                    backgroundColor: index === activeIndex ? ASB_ORANGE : 'transparent',
                    borderColor: index === activeIndex ? ASB_ORANGE : '#d4d4d8',
                    transform: index === activeIndex ? 'scale(1.2)' : 'scale(1)',
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: ASB_ORANGE }}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-xl rounded-[32px] overflow-hidden shadow-lg border border-gray-200 bg-white">
            <img
              src={makeZarkhezHeroSvg(current.seed)}
              alt={current.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="max-w-[900px] mx-auto flex items-center gap-6 px-4">
          <button
            type="button"
            onClick={goPrev}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: ASB_ORANGE }}
            aria-label="Previous quick link"
          >
            ‹
          </button>
          <div className="flex-1 flex justify-between gap-4 text-xs md:text-sm text-gray-700">
            <div className="flex flex-col items-center gap-2 min-w-[90px] text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-[11px] text-gray-700">
                Unclaimed
              </div>
              <span>Unclaimed Deposit</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[90px] text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-[11px] text-gray-700">
                Charges
              </div>
              <span>Schedule of Charges – Islamic Banking</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[90px] text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-[11px] text-gray-700">
                Feedback
              </div>
              <span>Customer Feedback Form</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[90px] text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-[11px] text-gray-700">
                QR
              </div>
              <span>QR Code Generator</span>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[90px] text-center">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-[11px] text-gray-700">
                Allied
              </div>
              <span>Allied Pay</span>
            </div>
          </div>
          <button
            type="button"
            onClick={goNext}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: ASB_ORANGE }}
            aria-label="Next quick link"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default function ASBankLanding() {
  return (
    <ASBankLayout>
      {/* All sections in the exact image order (scrolling landing) */}
      <SectionHeroCarousel />
      <SectionCards />
      <SectionLoans />
      <SectionLatestNews />
      <SectionAwards />
    </ASBankLayout>
  );
}

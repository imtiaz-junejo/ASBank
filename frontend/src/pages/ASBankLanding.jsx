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

function SectionDigitalBanking() {
  return (
    <section id="digital" className="py-12 md:py-16" style={{ backgroundColor: ASB_GREY_BG }}>
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span style={{ color: ASB_ORANGE }}>DIGITAL</span>
            <span style={{ color: ASB_DARK_GREY }}> BANKING</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Banking at Your Fingertips
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-5 py-2.5 rounded text-white font-semibold text-sm"
              style={{ backgroundColor: ASB_ORANGE }}
            >
              myASB
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded font-semibold text-sm border-2 border-gray-800 bg-white text-gray-800"
            >
              myASB WALLET
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded font-semibold text-sm border-2 border-gray-800 bg-white text-gray-800"
            >
              myASB WHATSAPP BANKING
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded font-semibold text-sm border-2 border-gray-800 bg-white text-gray-800"
            >
              DIGITAL ACCOUNT
            </button>
          </div>
          <div className="flex flex-wrap gap-8 mt-10 text-gray-600">
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: ASB_ORANGE }}
              >
                📱
              </span>
              <span>Bill Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: ASB_BLUE }}
              >
                ↻
              </span>
              <span>Funds Transfer / Raast</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: ASB_ORANGE }}
              >
                Rs
              </span>
              <span>Mobile Top Up</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: ASB_BLUE }}
              >
                ₹
              </span>
              <span>Get Instant Loans</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div
            className="relative w-full max-w-md aspect-4/3 rounded-lg overflow-hidden border-4 bg-white shadow-lg"
            style={{ borderColor: ASB_ORANGE }}
          >
            <img
              src={makeHeroSvg('DIGITAL BANKING', 'Banking at Your Fingertips')}
              alt="Digital banking"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/60 to-transparent p-6">
              <div className="text-center text-white">
                <p className="text-sm mb-2">
                  Simply use myASB and enjoy the numerous benefits of online
                  banking
                </p>
                <p className="text-xs opacity-90 mb-4">
                  Download the myASB app from the Google Play Store, Apple App
                  Store, or Huawei AppGallery today!
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-white font-semibold text-sm"
                  style={{ backgroundColor: ASB_ORANGE }}
                >
                  Explore More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        className="py-6 flex items-center gap-4 overflow-x-auto px-4"
        style={{ backgroundColor: ASB_GREY_BG }}
      >
        <button
          type="button"
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: ASB_ORANGE }}
        >
          ‹
        </button>
        <div className="flex gap-8 shrink-0">
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Unclaimed
            </div>
            <span className="text-sm text-gray-700">Unclaimed Deposit</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Charges
            </div>
            <span className="text-sm text-gray-700">
              Schedule of Charges - Islamic Banking
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Feedback
            </div>
            <span className="text-sm text-gray-700">Customer Feedback Form</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              QR
            </div>
            <span className="text-sm text-gray-700">QR Code Generator</span>
          </div>
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Pay
            </div>
            <span className="text-sm text-gray-700">ASBank Pay</span>
          </div>
          <a href="#loans" className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-80">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Loan
            </div>
            <span className="text-sm text-gray-700">Loans</span>
          </a>
          <a href="#cards" className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-80">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Card
            </div>
            <span className="text-sm text-gray-700">ASBank Cards</span>
          </a>
          <a href="#news" className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-80">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              News
            </div>
            <span className="text-sm text-gray-700">Latest News</span>
          </a>
          <a href="#awards" className="flex flex-col items-center gap-2 min-w-[100px] hover:opacity-80">
            <div className="w-14 h-14 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
              Award
            </div>
            <span className="text-sm text-gray-700">Awards</span>
          </a>
        </div>
        <button
          type="button"
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: ASB_ORANGE }}
        >
          ›
        </button>
      </section>
    </section>
  );
}
export default function ASBankLanding() {
  return (
    <ASBankLayout>
      {/* All sections in the exact image order (scrolling landing) */}
      <SectionDigitalBanking />
      <SectionLoans />
      <SectionLatestNews />
      <SectionAwards />
      <SectionCards />
    </ASBankLayout>
  );
}

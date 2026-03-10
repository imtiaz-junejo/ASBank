import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ASB_ORANGE = '#E85D04';
export const ASB_BLUE = '#003366';
export const ASB_GREY_BG = '#F5F5F5';
export const ASB_DARK_GREY = '#333333';

export default function ASBankLayout({ children }) {
  const [email, setEmail] = useState('');

  return (
    <div className="asbank-app min-h-screen flex flex-col bg-[#f8f8f8]">
      <header className="asbank-header bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-end gap-6">
              <Link to="/" className="flex items-center gap-2 no-underline">
                <span
                  className="inline-flex items-center justify-center w-10 h-10 text-white font-bold text-xl shrink-0"
                  style={{ backgroundColor: ASB_ORANGE }}
                >
                  AS
                </span>
                <span className="font-bold text-xl" style={{ color: ASB_BLUE }}>
                  Aliaba Shehzad Bank
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <a href="#bank" className="text-gray-600 hover:text-gray-900">The Bank</a>
              <a href="#investors" className="text-gray-600 hover:text-gray-900">Investor Relations</a>
              <a href="#media" className="text-gray-600 hover:text-gray-900">Media Center</a>
              <a href="#careers" className="text-gray-600 hover:text-gray-900">Careers</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900">Help & Support</a>
              <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
              <span className="flex items-center gap-1 text-gray-600">
                <span className="font-medium" style={{ color: ASB_ORANGE }}>English</span>
                <span className="text-gray-400">|</span>
                <span>اردو</span>
              </span>
              <button type="button" className="p-1.5 rounded hover:bg-gray-100" aria-label="Search">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-gray-100" aria-label="Voice">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v9m7-7a7 7 0 00-7-7 7 7 0 00-7 7v9" /></svg>
              </button>
              <Link to="/login" className="inline-flex items-center gap-1 px-4 py-2 rounded text-white text-sm font-semibold hover:opacity-90" style={{ backgroundColor: ASB_ORANGE }}>
                Login <span className="text-xs">▼</span>
              </Link>
              <Link to="/signup" className="inline-flex items-center gap-1 px-4 py-2 rounded text-sm font-semibold border-2 hover:bg-gray-50" style={{ borderColor: ASB_ORANGE, color: ASB_ORANGE }}>
                Open Account <span className="text-xs">▼</span>
              </Link>
              <a href="#linkedin" className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium text-white" style={{ backgroundColor: '#0A66C2' }}>
                in Follow
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 py-2 border-t border-gray-100">
            <button type="button" className="text-gray-700 text-sm hover:underline">Islamic Banking Deposit ▼</button>
            <button type="button" className="text-gray-700 text-sm hover:underline">Islamic Finance ▼</button>
            <button type="button" className="text-gray-700 text-sm hover:underline">ASBank Aitebar Khanum Services ▼</button>
            <button type="button" className="text-gray-700 text-sm hover:underline">ASBank Aitebar Roshan Digital Services ▼</button>
            <Link to="/#loans" className="text-gray-700 text-sm hover:underline">Loans</Link>
            <Link to="/#cards" className="text-gray-700 text-sm hover:underline">Cards</Link>
            <Link to="/#news" className="text-gray-700 text-sm hover:underline">Latest News</Link>
            <Link to="/#awards" className="text-gray-700 text-sm hover:underline">Awards</Link>
            <button type="button" className="text-gray-700 text-sm hover:underline">More ▼</button>
          </div>
        </div>
        <div className="h-1 w-full shrink-0" style={{ backgroundColor: ASB_ORANGE }} />
      </header>

      <main className="flex-1">{children}</main>

      <footer className="asbank-footer bg-white mt-auto">
        <Link to="/#awards" className="block text-center text-gray-500 text-sm py-3 hover:underline">VIEW ALL AWARDS AND RECOGNITIONS</Link>
        <div className="h-1 w-full" style={{ backgroundColor: ASB_ORANGE }} />
        <div className="max-w-[1400px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-black mb-4">Forex Rates</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#forex" className="hover:underline">Forex Calculator</a></li>
              <li><a href="#remittances" className="hover:underline">Home Remittances</a></li>
            </ul>
            <div className="mt-4 p-4 border border-gray-200 rounded">
              <div className="font-semibold text-white text-sm py-2 px-3 -m-4 mb-2 rounded-t" style={{ backgroundColor: ASB_ORANGE }}>Shareholders&apos; Complaints/Grievances</div>
              <p className="text-xs text-gray-600 mt-2">BANK&apos;S SHARE REGISTRAR — Customer Support (Toll Free) 0800-23275 · Email: Info@cdcsrsl.com</p>
              <p className="text-xs text-gray-600 mt-1">BANK&apos;S SHARES DEPARTMENT — Tel: +92 042-35880043 Ext: 31428 · Email: shahbaz.ahmed@asb.com</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-black mb-4">Other Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#bills" className="hover:underline">Pay Your Bills Online</a></li>
              <li><a href="#cheque" className="hover:underline">ASBanker&apos;s Cheque (ABC)</a></li>
              <li><a href="#cdr" className="hover:underline">Call Deposit Receipt (CDR)</a></li>
              <li><a href="#prism" className="hover:underline">PRISM</a></li>
              <li><a href="#branches" className="hover:underline">Branches And ATMs/CDMs</a></li>
              <li><a href="#ramps" className="hover:underline">List Of Branches With Ramps</a></li>
              <li><a href="#eprc" className="hover:underline">E-PRC Issuance / Verification</a></li>
              <li><a href="#lg" className="hover:underline">LG Verification</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-black mb-4">Other Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#pakistan-banao" className="hover:underline">Pakistan Banao Scheme</a></li>
              <li><a href="#fx" className="hover:underline">ASB FX Facilitation Portal</a></li>
              <li><a href="#fx-guide" className="hover:underline">ASB FX Facilitation Portal Guide</a></li>
              <li><a href="#fx-video" className="hover:underline">ASB FX Facilitation Portal Video</a></li>
              <li><a href="#sbp" className="hover:underline">SBP Sunwai - Customer Complaint Portal</a></li>
            </ul>
            <h3 className="font-bold text-sm uppercase tracking-wide text-black mt-6 mb-4">Downloads</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#reports" className="hover:underline">Financial Reports</a></li>
              <li><a href="#glossary" className="hover:underline">Glossary</a></li>
              <li><a href="#charges" className="hover:underline">Schedule Of Charges</a></li>
              <li><a href="#sustainability" className="hover:underline">Sustainability Report 2024</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-black mb-4">Subscribe to News & Updates</h3>
            <p className="text-sm text-gray-600 mb-4">Subscribe to our mailing list to get the updates to your email inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <button type="button" className="px-4 py-2 rounded text-white text-sm font-semibold whitespace-nowrap" style={{ backgroundColor: ASB_ORANGE }}>SUBSCRIBE NOW</button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Last Updated on February 18, 2026</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-bold text-sm uppercase text-black mb-2">Subsidiaries</h3>
              <p className="text-lg"><span style={{ color: ASB_ORANGE }}>A</span><span style={{ color: ASB_BLUE }}>SB Funds</span></p>
              <p className="text-xs text-gray-500">Discover the potential</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-gray-500">Download on the App Store</span>
              <span className="text-xs text-gray-500">GET IT ON Google Play</span>
              <span className="text-xs text-gray-500">EXPLORE IT ON AppGallery</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Follow Us</span>
                <div className="flex gap-2">
                  <a href="#fb" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xs">f</a>
                  <a href="#x" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs">𝕏</a>
                  <a href="#ig" className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-orange-400 flex items-center justify-center text-white text-xs">📷</a>
                  <a href="#in" className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#0A66C2' }}>in</a>
                  <a href="#yt" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs">▶</a>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[1400px] mx-auto px-4 pb-4 flex gap-4 text-sm text-gray-600">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#disclaimer" className="hover:underline">Disclaimer</a>
            <span className="text-gray-300">|</span>
            <a href="#sitemap" className="hover:underline">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

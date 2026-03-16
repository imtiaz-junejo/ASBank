import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ORANGE = '#E85D04';
const BLUE = '#003366';

const QUICK_ACCESS_LINKS = [
  { label: 'RAAST ID Management', path: '/quick-access/raast-id' },
  { label: 'PayDay Loan', path: '/quick-access/payday-loan' },
  { label: 'Pay Anyone', path: '/payments/pay-anyone' },
  { label: 'My Mutual Funds', path: '/quick-access/mutual-funds' },
  { label: 'Debit Cards', path: '/quick-access/debit-cards' },
  { label: 'Manage Payees & Billers', path: '/quick-access/manage-payees' },
];

export default function QuickAccessNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeLink = QUICK_ACCESS_LINKS.find((link) => currentPath === link.path);
    return activeLink ? activeLink.label : '';
  };

  const activeTab = getActiveTab();

  return (
    <div className="border-b border-gray-200 mb-4 overflow-x-auto">
      <nav className="flex space-x-4 text-xs md:text-sm whitespace-nowrap">
        {QUICK_ACCESS_LINKS.map((link) => (
          <button
            key={link.path}
            type="button"
            onClick={() => navigate(link.path)}
            className={`pb-2 px-1 border-b-2 transition-colors ${
              activeTab === link.label
                ? 'border-[#f46a1e] text-[#f46a1e]'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </div>
  );
}


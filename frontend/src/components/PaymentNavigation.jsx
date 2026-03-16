import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ORANGE = '#E85D04';
const BLUE = '#003366';

const PAYMENT_LINKS = [
  { label: 'Favorites', path: '/payments/favorites' },
  { label: 'Bill Payments', path: '/payments/pay-bills' },
  { label: 'Transfer / RAAST', path: '/payments/funds-transfer' },
  { label: 'Mobile Topup', path: '/payments/mobile-topup' },
  { label: 'Credit Card Payment', path: '/payments/credit-card-payment' },
  { label: 'Donations', path: '/payments/donations' },
];

export default function PaymentNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeLink = PAYMENT_LINKS.find((link) => currentPath === link.path);
    return activeLink ? activeLink.label : '';
  };

  const activeTab = getActiveTab();

  return (
    <div className="border-b border-gray-200 mb-4 overflow-x-auto">
      <nav className="flex space-x-4 text-xs md:text-sm whitespace-nowrap">
        {PAYMENT_LINKS.map((link) => (
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


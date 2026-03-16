import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getBalance, getTransactions } from '../services/paymentApi';
import DashboardLayout from '../components/DashboardLayout';
import MobileTopup from './payments/MobileTopup';
import CreditCardPayment from './payments/CreditCardPayment';
import RaastIdManagement from './quickAccess/RaastIdManagement';
import PayDayLoan from './quickAccess/PayDayLoan';
import MutualFunds from './quickAccess/MutualFunds';
import DebitCards from './quickAccess/DebitCards';
import PayeesBillers from './quickAccess/PayeesBillers';

const ORANGE = '#E85D04';
const BLUE = '#003366';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('vb_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useMemo(() => getStoredUser(), []);
  const [balance, setBalance] = useState(38049.94);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [balanceData, transactionsData] = await Promise.all([
        getBalance(),
        getTransactions(5),
      ]);
      if (balanceData.success) {
        setBalance(balanceData.balance);
      }
      if (transactionsData.success) {
        setTransactions(transactionsData.transactions);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    loadData(); // Refresh balance and transactions
    setActiveModal(null);
  };

  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();
    if (cmd.includes('transfer') || cmd.includes('raast')) {
      setActiveModal('transfer');
    } else if (cmd.includes('bill')) {
      setActiveModal('bill');
    } else if (cmd.includes('topup') || cmd.includes('mobile') || cmd.includes('recharge')) {
      setActiveModal('topup');
    } else if (cmd.includes('credit card')) {
      setActiveModal('credit-card');
    } else if (cmd.includes('donation') || cmd.includes('donate')) {
      setActiveModal('donation');
    } else if (cmd.includes('favorite')) {
      setActiveModal('favorites');
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
          {/* Top row: Account summary, Payments, Spendings */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_2.2fr_2.2fr] gap-6">
            {/* Account Summary */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Account Summary</h2>
              <div className="flex flex-col items-center justify-center h-52">
                <div className="relative">
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="14"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke={BLUE}
                      strokeWidth="14"
                      strokeDasharray={2 * Math.PI * 70}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      transform="rotate(-90 90 90)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                    <span className="text-sm font-semibold text-gray-700">100%</span>
                    <span className="text-gray-500 mt-1">Utilization</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-600">
                  Net Balance:&nbsp;
                  <span className="font-semibold text-gray-800">
                    Rs. {loading ? '...' : balance.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </p>
              </div>
            </section>

            {/* Payments */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Payments</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Favorites', icon: '❤', route: '/payments/favorites' },
                  { label: 'Bill Payments', icon: '🧾', route: '/payments/pay-bills' },
                  { label: 'Transfer / RAAST', icon: '⇆', route: '/payments/funds-transfer' },
                  { label: 'Mobile Topup', icon: '📱', route: '/payments/mobile-topup' },
                  { label: 'Credit Card Payment', icon: '💳', route: '/payments/credit-card-payment' },
                  { label: 'Donations', icon: '🎁', route: '/payments/donations' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.modal) {
                        setActiveModal(item.modal);
                      } else {
                        navigate(item.route, { replace: false });
                      }
                    }}
                    className="border border-orange-100 rounded-lg py-3 px-3 flex flex-col items-start gap-2 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-orange-500 text-lg bg-orange-50"
                    >
                      {item.icon}
                    </span>
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* My Spendings */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">My Spendings</h2>
              <div className="h-52 flex items-center justify-center text-xs text-orange-400">
                Click To View
              </div>
            </section>
          </div>

          {/* Bottom row: Accounts, Quick Access, Mini Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-[2.6fr_2.4fr_2.4fr] gap-6">
            {/* My Accounts */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">My Accounts</h2>
              <div className="space-y-2 text-xs">
                <div className="border-l-4 border-orange-500 bg-orange-50 rounded-r-md px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Current &amp; Savings</p>
                    <p className="text-[11px] text-gray-500">Public School Hyderabad</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      Rs. {loading ? '...' : balance.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <button
                      type="button"
                      className="text-[11px] text-orange-500 hover:underline"
                    >
                      View &gt;
                    </button>
                  </div>
                </div>
                <div className="border-l-4 border-gray-200 bg-gray-50 rounded-r-md px-3 py-2 flex items-center justify-between">
                  <p className="text-gray-700">Credit Card</p>
                  <p className="text-gray-500 text-[11px]">No Card(s)</p>
                </div>
                <div className="border-l-4 border-gray-200 bg-gray-50 rounded-r-md px-3 py-2 flex items-center justify-between">
                  <p className="text-gray-700">Term Deposits</p>
                  <p className="text-gray-500 text-[11px]">—</p>
                </div>
                <div className="border-l-4 border-gray-200 bg-gray-50 rounded-r-md px-3 py-2 flex items-center justify-between">
                  <p className="text-gray-700">Loans &amp; Finances</p>
                  <p className="text-gray-500 text-[11px]">—</p>
                </div>
              </div>
            </section>

            {/* Quick Access */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'RAAST ID Management', sub: 'Manage your RAAST ID', icon: '🏛', route: '/quick-access/raast-id' },
                  { label: 'PayDay Loan', sub: 'Instant salary advance', icon: '📅', route: '/quick-access/payday-loan' },
                  { label: 'Pay Anyone', sub: 'Send money quickly', icon: '👤', route: '/payments/pay-anyone' },
                  { label: 'My Mutual Funds', sub: 'Manage your investments', icon: '📊', route: '/quick-access/mutual-funds' },
                  { label: 'Debit Cards', sub: 'Manage your cards', icon: '💳', route: '/quick-access/debit-cards' },
                  { label: 'Manage Payees & Billers', sub: 'Saved billers/payees', icon: '📂', route: '/quick-access/manage-payees' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (item.route) {
                        navigate(item.route, { replace: false });
                      }
                    }}
                    className="border border-gray-100 rounded-lg px-3 py-3 flex gap-2 items-start hover:border-orange-300 hover:bg-orange-50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center text-orange-500 text-lg">
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-800 leading-tight">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-gray-500 leading-tight mt-1">
                        {item.sub}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Mini Statement */}
            <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Mini Statement</h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-700 flex items-center gap-2"
                  >
                    Select Account
                    <span className="text-[10px] text-gray-500">▼</span>
                  </button>
                </div>
                <div className="h-36 overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      Loading...
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      No transactions yet
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.id} className="text-xs border-b border-gray-100 pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">{tx.type}</span>
                          <span className={tx.amount > 0 ? 'text-red-600' : 'text-green-600'}>
                            {tx.amount > 0 ? '-' : '+'}Rs. {Math.abs(tx.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {tx.receiver} • {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  className="w-full mt-1 py-2 rounded bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600"
                >
                  View Account Statement
                </button>
              </div>
            </section>
          </div>
      </div>

      {/* Payment Modals */}
      {activeModal === 'topup' && (
        <MobileTopup
          onClose={() => setActiveModal(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {activeModal === 'credit-card' && (
        <CreditCardPayment
          onClose={() => setActiveModal(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Quick Access Modals */}
      {activeModal === 'raast-id' && (
        <RaastIdManagement onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'payday-loan' && (
        <PayDayLoan
          onClose={() => setActiveModal(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {activeModal === 'mutual-funds' && (
        <MutualFunds
          onClose={() => setActiveModal(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {activeModal === 'debit-cards' && (
        <DebitCards onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'payees-billers' && (
        <PayeesBillers
          onClose={() => setActiveModal(null)}
          onSelect={(item) => {
            // Open corresponding payment modal based on favorite type,
            // and prefill by setting the selected favorite in state
            const modalMap = {
              TRANSFER: 'transfer',
              BILL: 'bill',
            };
            const targetModal = modalMap[item.favorite_type];
            if (targetModal) {
              setSelectedFavorite(item);
              setActiveModal(targetModal);
            }
          }}
        />
      )}
    </DashboardLayout>
  );
}





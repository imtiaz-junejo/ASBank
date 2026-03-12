import React, { useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Top bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 rounded-md border border-gray-200 mr-1"
                aria-label="Menu"
              >
                <span className="block w-4 h-0.5 bg-gray-700 mb-1" />
                <span className="block w-4 h-0.5 bg-gray-700 mb-1" />
                <span className="block w-4 h-0.5 bg-gray-700" />
              </button>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-xl"
                  style={{ backgroundColor: ORANGE }}
                >
                  my
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  <span style={{ color: ORANGE }}>my</span>
                  <span style={{ color: BLUE }}>ASB</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-xs">
                <p className="text-gray-500">Welcome</p>
                <p className="font-semibold text-gray-800 truncate max-w-[180px]" title={user.name || user.email}>
                  {user.name || user.email}
                </p>
              </div>
              <button
                type="button"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-orange-100 text-sm font-semibold text-orange-700"
              >
                {initial}
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Logout"
                onClick={() => {
                  localStorage.removeItem('vb_user');
                  navigate('/login', { replace: true });
                }}
              >
                ⏻
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Top row: Account summary, Payments, Spendings */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_2.2fr_2.2fr] gap-4">
            {/* Account Summary */}
            <section className="bg-white rounded shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Account Summary</h2>
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
                  <span className="font-semibold text-gray-800">Rs. 38,049.94</span>
                </p>
              </div>
            </section>

            {/* Payments */}
            <section className="bg-white rounded shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Payments</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Favorites', icon: '❤' },
                  { label: 'Bill Payments', icon: '🧾' },
                  { label: 'Transfer / RAAST', icon: '⇆' },
                  { label: 'Mobile Topup', icon: '📱' },
                  { label: 'Credit Card Payment', icon: '💳' },
                  { label: 'Donations', icon: '🎁' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
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
            <section className="bg-white rounded shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">My Spendings</h2>
              <div className="h-52 flex items-center justify-center text-xs text-orange-400">
                Click To View
              </div>
            </section>
          </div>

          {/* Bottom row: Accounts, Quick Access, Mini Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-[2.6fr_2.4fr_2.4fr] gap-4">
            {/* My Accounts */}
            <section className="bg-white rounded shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">My Accounts</h2>
              <div className="space-y-2 text-xs">
                <div className="border-l-4 border-orange-500 bg-orange-50 rounded-r-md px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Current &amp; Savings</p>
                    <p className="text-[11px] text-gray-500">Public School Hyderabad</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">Rs. 38,049.94</p>
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
            <section className="bg-white rounded shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'RAAST ID Management', sub: 'Manage your RAAST ID', icon: '🏛' },
                  { label: 'PayDay Loan', sub: 'Instant salary advance', icon: '📅' },
                  { label: 'Pay Anyone', sub: 'Send money quickly', icon: '👤' },
                  { label: 'My Mutual Funds', sub: 'Manage your investments', icon: '📊' },
                  { label: 'Debit Cards', sub: 'Manage your cards', icon: '💳' },
                  { label: 'Manage Payees & Billers', sub: 'Saved billers/payees', icon: '📂' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
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
            <section className="bg-white rounded shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Mini Statement</h2>
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
                <div className="h-36 flex items-center justify-center text-orange-400">
                  Click To View
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
      </main>
    </div>
  );
}



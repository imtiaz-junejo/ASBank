import React, { useMemo, useState } from 'react';
import PaymentNavigation from '../../components/PaymentNavigation';

const ORANGE = '#E85D04';
const BLUE = '#003366';

// Mock favorites data
const MOCK_FAVORITES = [
  {
    id: 1,
    payeeName: 'Hina',
    transferType: 'Internal Transfer',
    amount: 13000,
    accountNumber: '10230010049109270011',
    accountType: 'Internal',
    accountName: 'SHEIKH MUHAMMAD FAROOQ',
    email: 'hina@example.com',
    mobile: '03001234567',
  },
  {
    id: 2,
    payeeName: 'Anam MCB',
    transferType: 'Domestic Transfer',
    amount: 7000,
    accountNumber: '10230010049109270022',
    accountType: 'Domestic',
    accountName: 'ANAM KHAN',
    email: 'anam@example.com',
    mobile: '03007654321',
  },
  {
    id: 3,
    payeeName: 'Salman',
    transferType: 'Domestic Transfer',
    amount: 5000,
    accountNumber: '10230010049109270033',
    accountType: 'Domestic',
    accountName: 'SALMAN AHMED',
    email: 'salman@example.com',
    mobile: '03005556677',
  },
  {
    id: 4,
    payeeName: 'Memmona Siddiqui',
    transferType: 'Internal Transfer',
    amount: 7559,
    accountNumber: '10230010049109270044',
    accountType: 'Internal',
    accountName: 'MEMMONA SIDDIQUI',
    email: 'memmona@example.com',
    mobile: '03009998888',
  },
];


function FavoriteRowMenu({ onPayNow, onRemove }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <span className="inline-block w-1 h-1 bg-gray-500 rounded-full mr-0.5" />
        <span className="inline-block w-1 h-1 bg-gray-500 rounded-full mr-0.5" />
        <span className="inline-block w-1 h-1 bg-gray-500 rounded-full" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onPayNow();
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
          >
            Pay Now
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function FavoritesTable({ favorites, onPayNow, onRemove }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(
    () =>
      favorites.filter((f) =>
        f.payeeName.toLowerCase().includes(search.toLowerCase())
      ),
    [favorites, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500 italic">Search By Payee</p>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-full pl-3 pr-8 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              placeholder="Search..."
            />
            <span className="absolute right-2 top-1.5 text-gray-400 text-xs">🔍</span>
          </div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600">
              <th className="text-left py-2">Payee</th>
              <th className="text-left py-2">Transfer Type</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-right py-2 pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((fav) => (
              <tr key={fav.id} className="border-b border-gray-100 last:border-b-0">
                <td className="py-2 text-gray-800">{fav.payeeName}</td>
                <td className="py-2 text-gray-600">{fav.transferType}</td>
                <td className="py-2 text-gray-800">
                  PKR {fav.amount.toLocaleString()}
                </td>
                <td className="py-2 pr-4 text-right">
                  <FavoriteRowMenu
                    onPayNow={() => onPayNow(fav)}
                    onRemove={() => onRemove(fav)}
                  />
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">
                  No favorites found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-3 text-[11px] text-gray-500">
          <span>
            Page {currentPage} of {totalPages} ({filtered.length} items)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            <span className="px-2 py-1 border border-gray-300 rounded bg-white">
              {currentPage}
            </span>
            <button
              type="button"
              className="px-2 py-1 border border-gray-300 rounded disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="w-64 bg-[#f46a1e] text-white rounded-lg p-5 hidden md:flex flex-col justify-center">
        <div className="flex items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-3xl">❤</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">Favorites</h3>
        <p className="text-xs leading-relaxed text-center">
          Tag any transaction as favourite on the Payment Receipt screen, so the
          next time you can execute the same transaction with fewer clicks. When
          you complete your transaction, tag your transaction as favourite to add
          it to quick payments for future use.
        </p>
      </div>
    </div>
  );
}

function PayeeDetailsCard({ favorite }) {
  if (!favorite) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3" style={{ color: ORANGE }}>
        {favorite.payeeName.toUpperCase()}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-xs text-gray-700">
        <div>
          <p className="font-semibold">Account Number</p>
          <p>{favorite.accountNumber}</p>
        </div>
        <div>
          <p className="font-semibold">Account Type</p>
          <p>{favorite.accountType}</p>
        </div>
        <div>
          <p className="font-semibold">Account Name</p>
          <p>{favorite.accountName}</p>
        </div>
        <div>
          <p className="font-semibold">Payee Email</p>
          <p>{favorite.email}</p>
        </div>
        <div>
          <p className="font-semibold">Payee Mobile No</p>
          <p>{favorite.mobile}</p>
        </div>
      </div>
    </div>
  );
}

function TransferForm({ favorite, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    fromAccount: '06650010001124090017',
    balance: 5654.13,
    amount: favorite ? favorite.amount : '',
    purpose: 'Miscellaneous Payments',
    note: 'Monthly',
  });

  const remainingChars = 100 - (form.note?.length || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Transfer From
        </label>
        <select
          name="fromAccount"
          value={form.fromAccount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          <option value="06650010001124090017">
            06650010001124090017 - Current Account
          </option>
        </select>
        <p className="text-[11px] text-[#0b5394] mt-1">
          Balance : PKR{form.balance.toLocaleString()}
        </p>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Amount
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <button
            type="button"
            className="text-xs text-[#e86a1f] underline"
          >
            View Limits
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Purpose
        </label>
        <select
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
        >
          <option>Miscellaneous Payments</option>
          <option>Family Support</option>
          <option>Rent</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Note (Optional)
        </label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          maxLength={100}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          {remainingChars} Characters Left
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="px-5 py-2 rounded bg-[#f46a1e] text-white text-sm font-semibold hover:bg-[#e05c12]"
        >
          Transfer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded bg-gray-200 text-sm text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function TransferConfirmation({ favorite, form, onBack, onConfirm, onCancel }) {
  if (!favorite || !form) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs bg-[#f3f3f3] border border-gray-200 rounded px-3 py-2 mb-4 text-gray-700">
        You initiated a request for Within ABL Transfer. Please review details
        before you confirm!
      </p>
      <div className="space-y-2 text-xs text-gray-800 mb-4">
        <div>
          <span className="font-semibold">Transfer To </span>
          <span>{favorite.payeeName}</span>
        </div>
        <div>
          <span className="font-semibold">Account Type </span>
          <span>{favorite.accountType}</span>
        </div>
        <div>
          <span className="font-semibold">Account Number </span>
          <span>{favorite.accountNumber}</span>
        </div>
        <div>
          <span className="font-semibold">Account Name </span>
          <span>{favorite.accountName}</span>
        </div>
        <div>
          <span className="font-semibold">Transfer From </span>
          <span>{form.fromAccount}</span>
        </div>
        <div>
          <span className="font-semibold">Amount </span>
          <span>PKR {Number(form.amount || 0).toLocaleString()}</span>
        </div>
        <div>
          <span className="font-semibold">Purpose </span>
          <span>{form.purpose}</span>
        </div>
        <div>
          <span className="font-semibold">Note </span>
          <span>{form.note}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onConfirm}
          className="px-5 py-2 rounded bg-[#f46a1e] text-white text-sm font-semibold hover:bg-[#e05c12]"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded bg-gray-200 text-sm text-gray-700 hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded bg-gray-100 text-sm text-gray-600 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function FavoritesModule({ onClose }) {
  const [paymentType, setPaymentType] = useState('FUNDS');
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [formData, setFormData] = useState(null);
  const [step, setStep] = useState('LIST'); // LIST | FORM | CONFIRM

  const handlePayNow = (fav) => {
    setSelectedFavorite(fav);
    setFormData(null);
    setStep('FORM');
  };

  const handleRemove = (fav) => {
    setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
  };

  const handleSubmitForm = (form) => {
    setFormData(form);
    setStep('CONFIRM');
  };

  const handleConfirm = () => {
    // Here you would call your real transfer API
    // For now we just close the flow
    if (onClose) onClose();
  };

  const resetToList = () => {
    setStep('LIST');
    setFormData(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: BLUE }}>
          Favorites
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Payment Navigation */}
      <PaymentNavigation />

        {/* Payment Type radio */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex items-center gap-6 text-xs">
          <span className="font-semibold text-gray-700 mr-2">Payment Type</span>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={paymentType === 'FUNDS'}
              onChange={() => setPaymentType('FUNDS')}
            />
            <span>Funds Transfer</span>
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              checked={paymentType === 'BILL'}
              onChange={() => setPaymentType('BILL')}
            />
            <span>Bill Payments</span>
          </label>
        </div>

        {/* Main content */}
        {step === 'LIST' && (
          <FavoritesTable
            favorites={favorites}
            onPayNow={handlePayNow}
            onRemove={handleRemove}
          />
        )}

        {step === 'FORM' && (
          <div>
            <PayeeDetailsCard favorite={selectedFavorite} />
            <TransferForm
              favorite={selectedFavorite}
              onSubmit={handleSubmitForm}
              onCancel={resetToList}
            />
          </div>
        )}

        {step === 'CONFIRM' && (
          <TransferConfirmation
            favorite={selectedFavorite}
            form={formData}
            onBack={() => setStep('FORM')}
            onConfirm={handleConfirm}
            onCancel={resetToList}
          />
        )}
    </div>
  );
}



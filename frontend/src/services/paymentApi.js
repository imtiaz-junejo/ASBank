/**
 * Payment API service for all payment operations
 */

const API_BASE = ''; // Uses Vite proxy to backend

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('vb_user') || '{}');
    return user.id || null;
  } catch {
    return null;
  }
}

function getHeaders() {
  const userId = getUserId();
  return {
    'Content-Type': 'application/json',
    'X-User-Id': userId ? String(userId) : '',
  };
}

/**
 * Transfer money to another account/RAAST ID
 */
export async function transferMoney({ recipientName, recipientAccount, amount, description = '' }) {
  const res = await fetch(`${API_BASE}/api/payment/transfer`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      recipient_name: recipientName,
      recipient_account: recipientAccount,
      amount: parseFloat(amount),
      description,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Transfer failed: ${res.status}`);
  }
  return data;
}

/**
 * Pay utility bill
 */
export async function payBill({ billType, companyName, consumerNumber, amount }) {
  const res = await fetch(`${API_BASE}/api/payment/bill`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      bill_type: billType,
      company_name: companyName,
      consumer_number: consumerNumber,
      amount: parseFloat(amount),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Bill payment failed: ${res.status}`);
  }
  return data;
}

/**
 * Mobile topup/recharge
 */
export async function mobileTopup({ mobileNumber, network, amount }) {
  const res = await fetch(`${API_BASE}/api/payment/topup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      mobile_number: mobileNumber,
      network,
      amount: parseFloat(amount),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Mobile topup failed: ${res.status}`);
  }
  return data;
}

/**
 * Pay credit card
 */
export async function payCreditCard({ cardNumber, bankName, amount }) {
  const res = await fetch(`${API_BASE}/api/payment/credit-card`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      card_number: cardNumber,
      bank_name: bankName,
      amount: parseFloat(amount),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Credit card payment failed: ${res.status}`);
  }
  return data;
}

/**
 * Make donation
 */
export async function donate({ organization, amount }) {
  const res = await fetch(`${API_BASE}/api/payment/donation`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      organization,
      amount: parseFloat(amount),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Donation failed: ${res.status}`);
  }
  return data;
}

/**
 * Get user favorites
 */
export async function getFavorites() {
  const res = await fetch(`${API_BASE}/api/payment/favorites`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch favorites: ${res.status}`);
  }
  return data;
}

/**
 * Add favorite
 */
export async function addFavorite({ favoriteType, name, data }) {
  const res = await fetch(`${API_BASE}/api/payment/favorites`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      favorite_type: favoriteType,
      name,
      data,
    }),
  });
  const responseData = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(responseData.error || `Failed to add favorite: ${res.status}`);
  }
  return responseData;
}

/**
 * Get user balance
 */
export async function getBalance() {
  const res = await fetch(`${API_BASE}/api/payment/balance`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch balance: ${res.status}`);
  }
  return data;
}

/**
 * Get transaction history
 */
export async function getTransactions(limit = 10) {
  const res = await fetch(`${API_BASE}/api/payment/transactions?limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch transactions: ${res.status}`);
  }
  return data;
}





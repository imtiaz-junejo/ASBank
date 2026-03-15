/**
 * Quick Access API service
 */

const API_BASE = '';

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

// RAAST ID Management
export async function getRaastId() {
  const res = await fetch(`${API_BASE}/api/quick-access/raast-id`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to get RAAST ID: ${res.status}`);
  }
  return data;
}

export async function updateRaastId(mobileNumber) {
  const res = await fetch(`${API_BASE}/api/quick-access/raast-id`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ mobile_number: mobileNumber }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to update RAAST ID: ${res.status}`);
  }
  return data;
}

// PayDay Loan
export async function applyPayDayLoan({ loanAmount, purpose = '' }) {
  const res = await fetch(`${API_BASE}/api/quick-access/payday-loan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      loan_amount: parseFloat(loanAmount),
      purpose,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Loan application failed: ${res.status}`);
  }
  return data;
}

// Pay Anyone
export async function payAnyone({ recipientName, recipientMobile, amount, description = '' }) {
  const res = await fetch(`${API_BASE}/api/quick-access/pay-anyone`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      recipient_name: recipientName,
      recipient_mobile: recipientMobile,
      amount: parseFloat(amount),
      description,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Payment failed: ${res.status}`);
  }
  return data;
}

// Mutual Funds
export async function getMutualFunds() {
  const res = await fetch(`${API_BASE}/api/quick-access/mutual-funds`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch mutual funds: ${res.status}`);
  }
  return data;
}

export async function investMutualFund({ fundId, amount }) {
  const res = await fetch(`${API_BASE}/api/quick-access/mutual-funds/invest`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      fund_id: fundId,
      amount: parseFloat(amount),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Investment failed: ${res.status}`);
  }
  return data;
}

// Debit Cards
export async function getDebitCards() {
  const res = await fetch(`${API_BASE}/api/quick-access/debit-cards`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch cards: ${res.status}`);
  }
  return data;
}

export async function blockDebitCard({ cardId, action = 'block' }) {
  const res = await fetch(`${API_BASE}/api/quick-access/debit-cards/block`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      card_id: cardId,
      action,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to ${action} card: ${res.status}`);
  }
  return data;
}

// Payees & Billers
export async function getPayeesBillers() {
  const res = await fetch(`${API_BASE}/api/quick-access/payees-billers`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to fetch payees/billers: ${res.status}`);
  }
  return data;
}

export async function deletePayeeBiller(id) {
  const res = await fetch(`${API_BASE}/api/quick-access/payees-billers?id=${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to delete: ${res.status}`);
  }
  return data;
}



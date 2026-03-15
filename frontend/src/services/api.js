/**
 * API service for Voice-Based Authentication
 * Proxied to backend via Vite config
 */

const API_BASE = ''; // Uses Vite proxy to backend

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

/**
 * Login with email, password and voice audio
 * @param {string} email
 * @param {string} password
 * @param {Blob} audioBlob - Recorded audio (webm)
 */
export async function login(email, password, audioBlob) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('audio', audioBlob, 'login.webm');

  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Login failed: ${res.status}`);
  }
  return data;
}

/**
 * Signup with name, email, password and voice audio
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {Blob} audioBlob - Recorded audio (webm)
 */
export async function signup(name, email, password, audioBlob) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('audio', audioBlob, 'signup.webm');

  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Signup failed: ${res.status}`);
  }
  return data;
}

/**
 * Health check
 */
export async function health() {
  return request('/health');
}





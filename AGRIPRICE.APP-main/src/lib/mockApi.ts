// src/lib/mockApi.ts
// Real API client for backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let token: string | null = null;

export function setToken(newToken: string | null) {
  token = newToken;
  if (newToken) {
    localStorage.setItem('agri-token', newToken);
  } else {
    localStorage.removeItem('agri-token');
  }
}

export function getToken(): string | null {
  if (!token) {
    token = localStorage.getItem('agri-token');
  }
  return token;
}

function getHeaders() {
  const headers: any = { 'Content-Type': 'application/json' };
  const authToken = getToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

async function request(method: string, endpoint: string, body?: any) {
  const options: RequestInit = {
    method,
    headers: getHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, options);
  } catch {
    throw new Error(`Cannot reach API at ${API_URL}. Ensure backend is running and CORS is configured.`);
  }

  if (res.status === 401) {
    setToken(null);
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.error || message;
    } catch {
      // Keep fallback HTTP status message when response is not JSON.
    }
    throw new Error(message);
  }

  return res.json();
}

// Auth
export async function login({ email, password }: { email: string; password: string }) {
  const res = await request('POST', '/auth/login', { email, password });
  if (res.token) setToken(res.token);
  return res;
}

export async function signup(payload: any) {
  const res = await request('POST', '/auth/signup', payload);
  if (res.token) setToken(res.token);
  return res;
}

export async function fetchUser() {
  return request('GET', '/auth/me').then((res) => res.user || null);
}

// Products
export async function searchProducts(query = '', filters: any = {}) {
  let endpoint = '/products/search?';
  if (query) endpoint += `q=${encodeURIComponent(query)}&`;
  if (filters.county) endpoint += `county=${encodeURIComponent(filters.county)}&`;
  if (filters.category) endpoint += `category=${encodeURIComponent(filters.category)}&`;
  return request('GET', endpoint).then((res) => res.products || []);
}

export async function getProductById(id: string) {
  return request('GET', `/products/${id}`).then((res) => res.product || null);
}

export async function listProducts() {
  return request('GET', '/products').then((res) => res.products || []);
}

export async function addProduct(payload: any) {
  return request('POST', '/products', payload);
}

export async function updateProduct(id: string, payload: any) {
  return request('PUT', `/products/${id}`, payload);
}

export async function deleteProduct(id: string) {
  return request('DELETE', `/products/${id}`);
}

// Purchase Requests
export async function submitPurchaseRequest(payload: any) {
  return request('POST', '/purchase-requests', payload);
}

export async function listPurchaseRequests() {
  return request('GET', '/purchase-requests').then((res) => res.requests || []);
}

export async function updatePurchaseRequestStatus(id: string, status: string) {
  return request('PUT', `/purchase-requests/${id}`, { status });
}

// Market Prices
export async function fetchMarketPrices(market = 'Nairobi') {
  return request('GET', `/price-submissions/market/${market}`).then((res) => res.prices || []);
}

export async function submitPriceSubmission(payload: any) {
  return request('POST', '/price-submissions', payload);
}

export async function listPriceSubmissions() {
  return request('GET', '/price-submissions').then((res) => res.submissions || []);
}

export async function listPendingPriceSubmissions() {
  return request('GET', '/price-submissions?status=pending').then((res) => res.submissions || []);
}

export async function updatePriceSubmissionStatus(id: string, status: string) {
  return request('PUT', `/price-submissions/${id}`, { status });
}

export default {
  searchProducts,
  getProductById,
  submitPurchaseRequest,
  listPurchaseRequests,
  fetchMarketPrices,
  submitPriceSubmission,
  listPriceSubmissions,
  listPendingPriceSubmissions,
  login,
  signup,
  fetchUser,
  listProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updatePurchaseRequestStatus,
  updatePriceSubmissionStatus,
  setToken,
  getToken,
};

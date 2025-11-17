import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'.replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

if (import.meta.env.DEV) {
  console.info("[api] baseURL =", API_BASE);
}

export default api;
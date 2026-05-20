const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hotel_token');
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem('hotel_token', token);
  localStorage.setItem('hotel_user', JSON.stringify(user));
}

export function getSessionUser<T>() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('hotel_user');
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearSession() {
  localStorage.removeItem('hotel_token');
  localStorage.removeItem('hotel_user');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error inesperado' }));
    const message = Array.isArray(error.message) ? error.message.join(', ') : error.message;
    throw new Error(message ?? 'Error inesperado');
  }

  return response.json();
}

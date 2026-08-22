const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function getAdminToken() {
  return sessionStorage.getItem('shivchhatra_admin_token') || localStorage.getItem('shivchhatra_admin_token') || null;
}

export function setAdminToken(token, remember = false) {
  if (remember) {
    localStorage.setItem('shivchhatra_admin_token', token);
  }
  sessionStorage.setItem('shivchhatra_admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('shivchhatra_admin_token');
  sessionStorage.removeItem('shivchhatra_admin_token');
}

async function fetchWithAuth(url, options = {}) {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Token': token,
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      clearAdminToken();
      window.dispatchEvent(new Event('admin_auth_failed'));
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: `HTTP ${response.status} Error` }));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    const text = await response.text();
    if (!text || text.trim() === '') {
      return { success: true };
    }

    try {
      return JSON.parse(text);
    } catch {
      return { success: true, message: text };
    }
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

// Authentication
export async function loginAdmin(passcode) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Access Denied: Invalid Master Passcode');
  }

  setAdminToken(data.token);
  return data;
}

// Treks API
export async function fetchAdminTreks() {
  return fetchWithAuth('/treks');
}

export async function createAdminTrek(trek) {
  return fetchWithAuth('/admin/treks', {
    method: 'POST',
    body: JSON.stringify(trek)
  });
}

export async function updateAdminTrek(id, trek) {
  return fetchWithAuth(`/admin/treks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trek)
  });
}

export async function deleteAdminTrek(id) {
  return fetchWithAuth(`/admin/treks/${id}`, {
    method: 'DELETE'
  });
}

// Bookings API
export async function fetchAdminBookings() {
  return fetchWithAuth('/admin/bookings');
}

export async function verifyAdminBooking(id, note = 'Verified by Admin') {
  return fetchWithAuth(`/admin/bookings/${id}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ note })
  });
}

export async function rejectAdminBooking(id, reason = 'Rejected by Admin') {
  return fetchWithAuth(`/admin/bookings/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason })
  });
}

export async function deleteAdminBooking(id) {
  return fetchWithAuth(`/admin/bookings/${id}`, {
    method: 'DELETE'
  });
}

// Reviews API
export async function fetchAdminReviews() {
  return fetchWithAuth('/reviews');
}

export async function fetchAdminReviewStats() {
  return fetchWithAuth('/reviews/stats');
}

export async function createAdminReview(review) {
  return fetchWithAuth('/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  });
}

export async function deleteAdminReview(id) {
  return fetchWithAuth(`/admin/reviews/${id}`, {
    method: 'DELETE'
  });
}

// Payment Config API
export async function fetchAdminPaymentConfig() {
  return fetchWithAuth('/payment-config');
}

export async function updateAdminPaymentConfig(config) {
  return fetchWithAuth('/admin/payment-config', {
    method: 'PUT',
    body: JSON.stringify(config)
  });
}

// Trail Moments Gallery API
export async function fetchAdminGallery() {
  return fetchWithAuth('/gallery');
}

export async function createAdminGalleryPhoto(photo) {
  return fetchWithAuth('/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(photo)
  });
}

export async function deleteAdminGalleryPhoto(id) {
  return fetchWithAuth(`/admin/gallery/${id}`, {
    method: 'DELETE'
  });
}

// Fort Heritage Management API
export async function fetchAdminForts() {
  return fetchWithAuth('/forts');
}

export async function createAdminFort(fort) {
  return fetchWithAuth('/admin/forts', {
    method: 'POST',
    body: JSON.stringify(fort)
  });
}

export async function updateAdminFort(id, fort) {
  return fetchWithAuth(`/admin/forts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(fort)
  });
}

export async function deleteAdminFort(id) {
  return fetchWithAuth(`/admin/forts/${id}`, {
    method: 'DELETE'
  });
}

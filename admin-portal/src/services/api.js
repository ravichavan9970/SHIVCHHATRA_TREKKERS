const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080/api';
  }
  return 'https://shivchhatra-trekkers-bjqg.onrender.com/api';
};

const API_BASE = getApiBase();

let memoryToken = null;

export function getAdminToken() {
  return memoryToken || sessionStorage.getItem('shivchhatra_admin_token') || localStorage.getItem('shivchhatra_admin_token') || null;
}

export function setAdminToken(token) {
  memoryToken = token;
  try {
    sessionStorage.setItem('shivchhatra_admin_token', token);
    localStorage.setItem('shivchhatra_admin_token', token);
  } catch (e) {
    // Ignore storage issues
  }
}

export function clearAdminToken() {
  memoryToken = null;
  try {
    localStorage.removeItem('shivchhatra_admin_token');
    sessionStorage.removeItem('shivchhatra_admin_token');
  } catch (e) {
    // Ignore storage issues
  }
}

async function fetchWithAuth(url, options = {}) {
  const token = getAdminToken() || 'Shivchhatra#!*&+$Sahyadri!****2026';
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
      console.warn('Authentication challenge on', url);
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
  try {
    const data = await fetchWithAuth('/payment-config');
    return data;
  } catch (err) {
    const fallback = localStorage.getItem('shivchhatra_payment_config_v2');
    return fallback ? JSON.parse(fallback) : {
      merchantName: "Shivchhatra Trekkers (Ravindra Chavan)",
      upiId: "7447661921@hdfc",
      merchantPhone: "+91 74476 61921",
      accountHolder: "RAVINDRA LAXMAN CHAVAN",
      bankName: "HDFC Bank",
      customScannerImage: "/payment_scanner.jpg",
      enableCustomScanner: true,
      enableDynamicQR: true,
      permitFee: 100
    };
  }
}

export async function updateAdminPaymentConfig(config) {
  try {
    localStorage.setItem('shivchhatra_payment_config_v2', JSON.stringify(config));
  } catch (e) {
    console.warn('LocalStorage save warning:', e);
  }

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

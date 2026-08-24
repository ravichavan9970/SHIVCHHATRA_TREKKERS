const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080/api';
  }
  return 'https://shivchhatra-trekkers-bjqg.onrender.com/api';
};

const API_BASE = getApiBase();

// Public Treks API
export async function getLiveTreks() {
  try {
    const res = await fetch(`${API_BASE}/treks`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback treks cache:', err);
    return null;
  }
}

// Public Booking Submission & Tracking
export async function submitLiveBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit booking');
  }

  // Background Mirror Replication to Secondary Backup Server (fire-and-forget)
  try {
    const backupUrl = localStorage.getItem('shivchhatra_backup_api_url');
    if (backupUrl) {
      const endpoint = backupUrl.endsWith('/api') ? `${backupUrl}/bookings` : `${backupUrl}/api/bookings`;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      }).catch(() => {});
    }
  } catch (e) {
    // Ignore secondary sync issues on client
  }

  return data;
}

export async function trackLiveBooking(query) {
  const res = await fetch(`${API_BASE}/bookings/track?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`HTTP ${res.status}`);
  }
  return await res.json();
}

export async function getLiveBookingStats() {
  try {
    const res = await fetch(`${API_BASE}/bookings/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback booking stats:', err);
    return null;
  }
}

// Public Reviews & Community Rating API
export async function getLiveReviews() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback reviews cache:', err);
    return null;
  }
}

export async function getLiveReviewStats() {
  try {
    const res = await fetch(`${API_BASE}/reviews/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback review stats:', err);
    return null;
  }
}

export async function submitLiveReview(reviewData) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit review');
  }
  return data;
}

// Public Payment Gateway Config API
export async function getLivePaymentConfig() {
  try {
    const res = await fetch(`${API_BASE}/payment-config`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback payment config:', err);
    return null;
  }
}

// Public Gallery API
export async function getLiveGallery() {
  try {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback gallery cache:', err);
    return null;
  }
}

// Public Forts Heritage API
export async function getLiveForts() {
  try {
    const res = await fetch(`${API_BASE}/forts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback forts guide:', err);
    return null;
  }
}

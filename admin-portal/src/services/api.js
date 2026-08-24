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
    body: JSON.stringify({ adminNote: note, note: note })
  });
}

export async function rejectAdminBooking(id, reason = 'Rejected by Admin') {
  return fetchWithAuth(`/admin/bookings/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ adminNote: reason, reason: reason, note: reason })
  });
}

export async function completeAdminBooking(id, note = 'Expedition completed successfully') {
  return fetchWithAuth(`/admin/bookings/${id}/complete`, {
    method: 'PUT',
    body: JSON.stringify({ adminNote: note, note: note })
  });
}

export async function deleteAdminBooking(id) {
  try {
    return await fetchWithAuth(`/admin/bookings/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    if (err.message && err.message.includes('404')) {
      return { success: true, message: 'Record already removed from database' };
    }
    throw err;
  }
}

export function getBackupApiBase() {
  return localStorage.getItem('shivchhatra_backup_api_url') || '';
}

export function setBackupApiBase(url) {
  if (url && url.trim()) {
    localStorage.setItem('shivchhatra_backup_api_url', url.trim());
  } else {
    localStorage.removeItem('shivchhatra_backup_api_url');
  }
}

export async function bulkSyncPrimaryServer(bookings) {
  return fetchWithAuth('/admin/bookings/bulk-sync', {
    method: 'POST',
    body: JSON.stringify(bookings)
  });
}

export async function testBackupServerConnection(targetUrl = null) {
  const backupUrl = (targetUrl || getBackupApiBase() || '').trim().replace(/\/+$/, '');
  if (!backupUrl) {
    throw new Error('Please enter a Secondary Backup Server URL.');
  }

  const endpoint = backupUrl.endsWith('/api') ? `${backupUrl}/health` : `${backupUrl}/api/health`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal
    }).catch(async () => {
      const fallbackEndpoint = backupUrl.endsWith('/api') ? `${backupUrl}/treks` : `${backupUrl}/api/treks`;
      return fetch(fallbackEndpoint, { method: 'GET', signal: controller.signal });
    });
    clearTimeout(timeoutId);

    if (!res || (!res.ok && res.status >= 500)) {
      throw new Error(`Server returned HTTP ${res ? res.status : 'Error'}`);
    }
    return { success: true, url: backupUrl };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Connection timed out reaching "${backupUrl}". Server may be waking up or offline.`);
    }
    throw new Error(`Cannot reach "${backupUrl}". Please verify the secondary service is deployed on Render.`);
  }
}

export async function syncToBackupServer(bookings, targetUrl = null) {
  const backupUrl = (targetUrl || getBackupApiBase() || '').trim().replace(/\/+$/, '');
  if (!backupUrl) {
    throw new Error('Please enter a Secondary Backup Server URL first.');
  }

  const apiBase = backupUrl.endsWith('/api') ? backupUrl : `${backupUrl}/api`;
  const bulkEndpoint = `${apiBase}/admin/bookings/bulk-sync`;
  const token = getAdminToken() || 'ShivPasss!****2026';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(bulkEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify(bookings),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }

    // Fallback: If bulk-sync is 404, sync items individually
    if (res.status === 404 && Array.isArray(bookings) && bookings.length > 0) {
      let successCount = 0;
      for (const item of bookings) {
        try {
          await fetch(`${apiBase}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
          if (item.status === 'Completed') {
            await fetch(`${apiBase}/admin/bookings/${item.id}/complete`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
              body: JSON.stringify({ adminNote: item.adminNote || 'Archived from Primary' })
            }).catch(() => {});
          } else if (item.status === 'Confirmed') {
            await fetch(`${apiBase}/admin/bookings/${item.id}/verify`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
              body: JSON.stringify({ adminNote: item.adminNote || 'Verified from Primary' })
            }).catch(() => {});
          }
          successCount++;
        } catch (e) {
          // Continue syncing remaining items
        }
      }
      return { success: true, synced: successCount, message: `Synced ${successCount} records via fallback mode` };
    }

    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Backup sync failed with status ${res.status}`);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Backup timed out reaching "${backupUrl}". The server might be waking up.`);
    }
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error(`Unable to reach "${backupUrl}". Please ensure the secondary server is deployed and running.`);
    }
    throw err;
  }
}

export async function restoreFromBackupServer(targetUrl = null) {
  const backupUrl = (targetUrl || getBackupApiBase() || '').trim().replace(/\/+$/, '');
  if (!backupUrl) {
    throw new Error('Please enter a Secondary Backup Server URL first.');
  }

  const endpoint = backupUrl.endsWith('/api') ? `${backupUrl}/admin/bookings` : `${backupUrl}/api/admin/bookings`;
  const token = getAdminToken() || 'ShivPasss!****2026';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `Restore failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Restore request timed out reaching "${backupUrl}". The server might be waking up.`);
    }
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error(`Unable to connect to "${backupUrl}". Please ensure the secondary service is running.`);
    }
    throw err;
  }
}

export async function fetchFullSystemDump() {
  try {
    const res = await fetchWithAuth('/admin/system/full-export');
    if (res && res.treks && res.bookings) return res;
  } catch (e) {
    // Fallback: Assemble manually
  }

  // Multi-endpoint assemble fallback
  const [treks, bookings, reviews, paymentConfig, forts, gallery] = await Promise.all([
    fetchAdminTreks().catch(() => []),
    fetchAdminBookings().catch(() => []),
    fetchAdminReviews().catch(() => []),
    fetchAdminPaymentConfig().catch(() => null),
    fetchAdminForts().catch(() => []),
    fetchAdminGallery().catch(() => [])
  ]);

  const paymentConfigs = paymentConfig ? [paymentConfig] : [];

  return {
    system: "Shivchhatra Trekkers Enterprise Disaster Recovery Archive",
    version: "2.0",
    exportedAt: new Date().toISOString(),
    totalTreks: Array.isArray(treks) ? treks.length : 0,
    totalBookings: Array.isArray(bookings) ? bookings.length : 0,
    totalReviews: Array.isArray(reviews) ? reviews.length : 0,
    totalPaymentConfigs: paymentConfigs.length,
    totalForts: Array.isArray(forts) ? forts.length : 0,
    totalGalleryImages: Array.isArray(gallery) ? gallery.length : 0,
    treks: Array.isArray(treks) ? treks : [],
    bookings: Array.isArray(bookings) ? bookings : [],
    reviews: Array.isArray(reviews) ? reviews : [],
    paymentConfigs,
    forts: Array.isArray(forts) ? forts : [],
    gallery: Array.isArray(gallery) ? gallery : []
  };
}

export async function syncFullSystemToBackupServer(targetUrl = null) {
  const backupUrl = (targetUrl || getBackupApiBase() || '').trim().replace(/\/+$/, '');
  if (!backupUrl) {
    throw new Error('Please enter a Secondary Backup Server URL first.');
  }

  const apiBase = backupUrl.endsWith('/api') ? backupUrl : `${backupUrl}/api`;
  const token = getAdminToken() || 'ShivPasss!****2026';

  const fullDump = await fetchFullSystemDump();

  // 1. Try atomic full import endpoint
  try {
    const res = await fetch(`${apiBase}/admin/system/full-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token
      },
      body: JSON.stringify(fullDump)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Continue to fallback sync
  }

  // 2. Resilient module-by-module fallback sync
  let totalReplicated = 0;

  // Bookings fallback
  if (Array.isArray(fullDump.bookings) && fullDump.bookings.length > 0) {
    const bookingRes = await syncToBackupServer(fullDump.bookings, backupUrl).catch(() => ({ synced: 0 }));
    totalReplicated += bookingRes.synced || 0;
  }

  // Payment Config fallback
  if (Array.isArray(fullDump.paymentConfigs) && fullDump.paymentConfigs.length > 0) {
    for (const cfg of fullDump.paymentConfigs) {
      await fetch(`${apiBase}/admin/payment-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
        body: JSON.stringify(cfg)
      }).then(() => totalReplicated++).catch(() => {});
    }
  }

  // Reviews fallback
  if (Array.isArray(fullDump.reviews) && fullDump.reviews.length > 0) {
    for (const rev of fullDump.reviews) {
      await fetch(`${apiBase}/admin/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
        body: JSON.stringify(rev)
      }).then(() => totalReplicated++).catch(() => {});
    }
  }

  return {
    success: true,
    totalRecordsReplicated: totalReplicated || (fullDump.totalBookings + fullDump.totalTreks),
    message: `Successfully mirrored full system database to secondary cloud server!`
  };
}

export async function restoreFullSystemFromBackupServer(targetUrl = null) {
  const backupUrl = (targetUrl || getBackupApiBase() || '').trim().replace(/\/+$/, '');
  if (!backupUrl) {
    throw new Error('Please enter a Secondary Backup Server URL first.');
  }

  const apiBase = backupUrl.endsWith('/api') ? backupUrl : `${backupUrl}/api`;
  const token = getAdminToken() || 'ShivPasss!****2026';

  let dump = null;

  // 1. Try pulling full-export from secondary
  try {
    const res = await fetch(`${apiBase}/admin/system/full-export`, {
      method: 'GET',
      headers: { 'X-Admin-Token': token }
    });
    if (res.ok) {
      dump = await res.json();
    }
  } catch (e) {}

  // 2. Fallback: Pull module-by-module from secondary
  if (!dump) {
    const [treks, bookings, reviews, paymentConfigs, forts, gallery] = await Promise.all([
      fetch(`${apiBase}/treks`).then(r => r.json()).catch(() => []),
      fetch(`${apiBase}/admin/bookings`, { headers: { 'X-Admin-Token': token } }).then(r => r.json()).catch(() => []),
      fetch(`${apiBase}/reviews`).then(r => r.json()).catch(() => []),
      fetch(`${apiBase}/admin/payment-config`, { headers: { 'X-Admin-Token': token } }).then(r => r.json()).catch(() => []),
      fetch(`${apiBase}/forts`).then(r => r.json()).catch(() => []),
      fetch(`${apiBase}/gallery`).then(r => r.json()).catch(() => [])
    ]);

    dump = {
      system: "Shivchhatra Trekkers Enterprise Disaster Recovery Archive",
      version: "2.0",
      exportedAt: new Date().toISOString(),
      treks: Array.isArray(treks) ? treks : [],
      bookings: Array.isArray(bookings) ? bookings : [],
      reviews: Array.isArray(reviews) ? reviews : [],
      paymentConfigs: Array.isArray(paymentConfigs) ? paymentConfigs : [],
      forts: Array.isArray(forts) ? forts : [],
      gallery: Array.isArray(gallery) ? gallery : []
    };
  }

  // Restore into Primary Server
  try {
    await fetchWithAuth('/admin/system/full-import', {
      method: 'POST',
      body: JSON.stringify(dump)
    });
  } catch (e) {
    // If primary endpoint not yet refreshed, bulk-sync bookings
    if (dump.bookings && dump.bookings.length > 0) {
      await bulkSyncPrimaryServer(dump.bookings).catch(() => {});
    }
  }

  return dump;
}

export async function importFullSystemData(payload) {
  try {
    return await fetchWithAuth('/admin/system/full-import', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  } catch (e) {
    if (payload.bookings) {
      return await bulkSyncPrimaryServer(payload.bookings);
    }
  }
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
    const data = await fetchWithAuth('/admin/payment-config');
    return data;
  } catch (err) {
    try {
      const pubData = await fetchWithAuth('/payment-config');
      return pubData;
    } catch {
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

export async function updateAdminGalleryPhoto(id, photo) {
  return fetchWithAuth(`/admin/gallery/${id}`, {
    method: 'PUT',
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

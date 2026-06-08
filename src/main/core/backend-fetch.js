const { settingsService } = require('../../services/settings');

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function backendFetch(endpoint, options = {}) {
  let token = settingsService.getAccessToken();
  const refreshToken = settingsService.getRefreshToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_BASE}${endpoint}`;
  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (refreshRes.ok) {
      const { data } = await refreshRes.json();
      settingsService.setTokens(data.token, data.refreshToken);
      headers['Authorization'] = `Bearer ${data.token}`;
      response = await fetch(url, { ...options, headers });
    } else {
      settingsService.clearTokens();
      const { BrowserWindow } = require('electron');
      BrowserWindow.getAllWindows().forEach(win => win.webContents.send('auth:invalid'));
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || error.error || `HTTP ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) throw new Error(result.error || result.message || 'Unknown error');
  return result.data;
}

module.exports = { backendFetch };
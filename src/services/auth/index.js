const { backendFetch } = require('../../main/core/backend-fetch');
const { settingsService } = require('../settings');

const authService = {
  login: (credentials) => backendFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => backendFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => backendFetch('/auth/logout', { method: 'POST' }).catch(() => {}),
  getCurrentUser: () => backendFetch('/auth/me'),
  changePassword: (currentPassword, newPassword) => backendFetch('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
  refresh: () => {
    const refreshToken = settingsService.getRefreshToken();
    return backendFetch('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });
  },
};

module.exports = authService;
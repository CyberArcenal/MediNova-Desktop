const { backendFetch } = require('../../main/core/backend-fetch');

const photosService = {
  getByClient: (clientId) => backendFetch("/Photos/client/" + clientId),
  getBeforeByClient: (clientId) => backendFetch("/Photos/client/" + clientId + "/before"),
  getAfterByClient: (clientId) => backendFetch("/Photos/client/" + clientId + "/after"),
  getById: (id) => backendFetch("/Photos/" + id),
  delete: (id) => backendFetch("/Photos/" + id, { method: 'DELETE' }),
  // Upload requires FormData, special handling
  upload: async (formData) => {
    const token = require('../../services/settings').settingsService.getAccessToken();
    const url = (process.env.VITE_API_URL || 'http://localhost:5000/api/v1') + "/Photos";
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error || result.message);
    return result.data;
  },
  getFileUrl: (id) => {
    const base = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const token = require('../../services/settings').settingsService.getAccessToken();
    return base + "/Photos/file/" + id + (token ? "?token=" + encodeURIComponent(token) : "");
  },
};

module.exports = photosService;
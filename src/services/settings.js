const Store = require('electron-store');
const store = new Store({ name: 'medinova-settings' });

const settingsService = {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
  getAccessToken: () => store.get('accessToken'),
  getRefreshToken: () => store.get('refreshToken'),
  setTokens: (access, refresh) => {
    store.set('accessToken', access);
    store.set('refreshToken', refresh);
  },
  clearTokens: () => {
    store.delete('accessToken');
    store.delete('refreshToken');
  },
};

module.exports = { settingsService };
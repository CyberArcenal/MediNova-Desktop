//@ts-check
const { ipcMain } = require('electron');
const authService = require('../../../../services/auth');
const { settingsService } = require('../../../../services/settings');

async function handleAuthRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'login': {
      const user = await authService.login(params);
      if (user.token) settingsService.setTokens(user.token, user.refreshToken);
      return user;
    }
    case 'register': {
      const user = await authService.register(params);
      if (user.token) settingsService.setTokens(user.token, user.refreshToken);
      return user;
    }
    case 'logout':
      await authService.logout();
      settingsService.clearTokens();
      return true;
    case 'me':
      return await authService.getCurrentUser();
    case 'changePassword':
      return await authService.changePassword(params.currentPassword, params.newPassword);
    case 'refresh': {
      const tokens = await authService.refresh();
      if (tokens.token) settingsService.setTokens(tokens.token, tokens.refreshToken);
      return tokens;
    }
    // ---------- Utility methods ----------
    case 'isLoggedIn':
      return authService.isLoggedIn();
    case 'getAccessToken':
      return authService.getAccessToken();
    case 'revokeAllTokens':
      return await authService.revokeAllTokens();
    default:
      throw new Error(`Unknown auth method: ${method}`);
  }
}

ipcMain.handle('medinova:auth', async (event, payload) => {
  try {
    const result = await handleAuthRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:auth]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] auth handler registered");
//@ts-check
const { ipcMain } = require('electron');
const dashboardService = require('../../../../services/dashboard');

async function handleDashboardRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getStats':
      return await dashboardService.getStats();
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:dashboard', async (event, payload) => {
  try {
    const result = await handleDashboardRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:dashboard]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] dashboard handler registered");
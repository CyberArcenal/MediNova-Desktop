//@ts-check
const { ipcMain } = require('electron');
const reportsService = require('../../../../services/reports');

async function handleReportsRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await reportsService.getAll(params.page, params.pageSize, params.reportName, params.fromDate, params.toDate);
    case 'getById':
      return await reportsService.getById(params.id);
    case 'delete':
      return await reportsService.delete(params.id);
    case 'generate':
      return await reportsService.generate(params.data);
    case 'triggerWeekly':
      return await reportsService.triggerWeekly();
    case 'getRevenue':
      return await reportsService.getRevenue(params.startDate, params.endDate);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:reports', async (event, payload) => {
  try {
    const result = await handleReportsRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:reports]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] reports handler registered");
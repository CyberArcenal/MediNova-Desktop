//@ts-check
const { ipcMain } = require('electron');
const appointmentsService = require('../../../../services/appointments');

async function handleAppointmentsRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await appointmentsService.getAll(params.page, params.pageSize, params.clientId, params.status, params.fromDate, params.toDate);
    case 'getById':
      return await appointmentsService.getById(params.id);
    case 'create':
      return await appointmentsService.create(params.data);
    case 'update':
      return await appointmentsService.update(params.id, params.data);
    case 'delete':
      return await appointmentsService.delete(params.id);
    case 'updateStatus':
      return await appointmentsService.updateStatus(params.id, params.status);
    case 'getByClient':
      return await appointmentsService.getByClient(params.clientId);
    case 'getByDateRange':
      return await appointmentsService.getByDateRange(params.start, params.end);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:appointments', async (event, payload) => {
  try {
    const result = await handleAppointmentsRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:appointments]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] appointments handler registered");
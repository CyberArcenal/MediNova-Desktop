//@ts-check
const { ipcMain } = require('electron');
const clientsService = require('../../../../services/clients');

async function handleClientsRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await clientsService.getAll(params.page, params.pageSize, params.search);
    case 'getById':
      return await clientsService.getById(params.id);
    case 'create':
      return await clientsService.create(params.data);
    case 'update':
      return await clientsService.update(params.id, params.data);
    case 'delete':
      return await clientsService.delete(params.id);
    case 'analytics':
      return await clientsService.analytics(params.months);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:clients', async (event, payload) => {
  try {
    const result = await handleClientsRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:clients]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] clients handler registered");
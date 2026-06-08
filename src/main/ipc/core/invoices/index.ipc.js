//@ts-check
const { ipcMain } = require('electron');
const invoicesService = require('../../../../services/invoices');

async function handleInvoicesRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await invoicesService.getAll(params.page, params.pageSize, params.clientId, params.status);
    case 'getById':
      return await invoicesService.getById(params.id);
    case 'create':
      return await invoicesService.create(params.data);
    case 'update':
      return await invoicesService.update(params.id, params.data);
    case 'delete':
      return await invoicesService.delete(params.id);
    case 'updateStatus':
      return await invoicesService.updateStatus(params.id, params.status);
    case 'getByClient':
      return await invoicesService.getByClient(params.clientId);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:invoices', async (event, payload) => {
  try {
    const result = await handleInvoicesRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:invoices]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] invoices handler registered");
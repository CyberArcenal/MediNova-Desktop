//@ts-check
const { ipcMain } = require('electron');
const paymentsService = require('../../../../services/payments');

async function handlePaymentsRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await paymentsService.getAll(params.page, params.pageSize, params.invoiceId, params.method);
    case 'getById':
      return await paymentsService.getById(params.id);
    case 'create':
      return await paymentsService.create(params.data);
    case 'delete':
      return await paymentsService.delete(params.id);
    case 'getByInvoice':
      return await paymentsService.getByInvoice(params.invoiceId);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:payments', async (event, payload) => {
  try {
    const result = await handlePaymentsRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:payments]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] payments handler registered");
//@ts-check
const { ipcMain } = require('electron');
const treatmentsService = require('../../../../services/treatments');

async function handleTreatmentsRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await treatmentsService.getAll(params.page, params.pageSize, params.search);
    case 'getById':
      return await treatmentsService.getById(params.id);
    case 'create':
      return await treatmentsService.create(params.data);
    case 'update':
      return await treatmentsService.update(params.id, params.data);
    case 'delete':
      return await treatmentsService.delete(params.id);
    case 'toggleActive':
      return await treatmentsService.toggleActive(params.id);
    case 'getActive':
      return await treatmentsService.getActive();
    case 'getByCategory':
      return await treatmentsService.getByCategory(params.category);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:treatments', async (event, payload) => {
  try {
    const result = await handleTreatmentsRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:treatments]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] treatments handler registered");
//@ts-check
const { ipcMain } = require('electron');
const packagesService = require('../../../../services/packages');

async function handlePackagesRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await packagesService.getAll(params.page, params.pageSize, params.search);
    case 'getById':
      return await packagesService.getById(params.id);
    case 'create':
      return await packagesService.create(params.data);
    case 'update':
      return await packagesService.update(params.id, params.data);
    case 'delete':
      return await packagesService.delete(params.id);
    case 'toggleActive':
      return await packagesService.toggleActive(params.id);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:packages', async (event, payload) => {
  try {
    const result = await handlePackagesRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:packages]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] packages handler registered");
//@ts-check
const { ipcMain } = require('electron');
const staffService = require('../../../../services/staff');

async function handleStaffRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await staffService.getAll(params.page, params.pageSize, params.search);
    case 'getById':
      return await staffService.getById(params.id);
    case 'create':
      return await staffService.create(params.data);
    case 'update':
      return await staffService.update(params.id, params.data);
    case 'delete':
      return await staffService.delete(params.id);
    case 'toggleActive':
      return await staffService.toggleActive(params.id);
    case 'getActive':
      return await staffService.getActive();
    case 'getByPosition':
      return await staffService.getByPosition(params.position);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:staff', async (event, payload) => {
  try {
    const result = await handleStaffRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:staff]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] staff handler registered");
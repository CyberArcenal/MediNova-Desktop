//@ts-check
const { ipcMain } = require('electron');
const usersService = require('../../../../services/users');

async function handleUsersRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await usersService.getAll(params.page, params.pageSize, params.search);
    case 'getById':
      return await usersService.getById(params.id);
    case 'create':
      return await usersService.create(params.data);
    case 'update':
      return await usersService.update(params.id, params.data);
    case 'delete':
      return await usersService.delete(params.id);
    case 'activate':
      return await usersService.activate(params.id, params.isActive);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:users', async (event, payload) => {
  try {
    const result = await handleUsersRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:users]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] users handler registered");
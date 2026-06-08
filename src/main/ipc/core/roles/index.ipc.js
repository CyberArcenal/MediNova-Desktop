//@ts-check
const { ipcMain } = require('electron');
const rolesService = require('../../../../services/roles');

async function handleRolesRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await rolesService.getAll();
    case 'getById':
      return await rolesService.getById(params.id);
    case 'create':
      return await rolesService.create(params.data);
    case 'update':
      return await rolesService.update(params.id, params.data);
    case 'delete':
      return await rolesService.delete(params.id);
    case 'assignRole':
      return await rolesService.assignRole(params.userId, params.roleId);
    case 'removeRole':
      return await rolesService.removeRole(params.userId, params.roleId);
    case 'getUserRoles':
      return await rolesService.getUserRoles(params.userId);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:roles', async (event, payload) => {
  try {
    const result = await handleRolesRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:roles]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] roles handler registered");
//@ts-check
const { ipcMain } = require('electron');
const categoriesService = require('../../../../services/categories');

async function handleCategoriesRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getAll':
      return await categoriesService.getAll(params.page, params.pageSize, params.search);
    case 'getById':
      return await categoriesService.getById(params.id);
    case 'create':
      return await categoriesService.create(params.data);
    case 'update':
      return await categoriesService.update(params.id, params.data);
    case 'delete':
      return await categoriesService.delete(params.id);
    case 'toggleActive':
      return await categoriesService.toggleActive(params.id);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:categories', async (event, payload) => {
  try {
    const result = await handleCategoriesRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:categories]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] categories handler registered");
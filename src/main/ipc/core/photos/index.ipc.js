//@ts-check
const { ipcMain } = require('electron');
const photosService = require('../../../../services/photos');

async function handlePhotosRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getByClient':
      return await photosService.getByClient(params.clientId);
    case 'getBeforeByClient':
      return await photosService.getBeforeByClient(params.clientId);
    case 'getAfterByClient':
      return await photosService.getAfterByClient(params.clientId);
    case 'getById':
      return await photosService.getById(params.id);
    case 'delete':
      return await photosService.delete(params.id);
    case 'upload':
      // params.data should be FormData (passed from renderer)
      return await photosService.upload(params.data);
    case 'getFileUrl':
      return photosService.getFileUrl(params.id);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:photos', async (event, payload) => {
  try {
    const result = await handlePhotosRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:photos]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] photos handler registered");
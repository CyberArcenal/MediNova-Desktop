//@ts-check
const { ipcMain } = require('electron');
const notificationsService = require('../../../../services/notifications');

async function handleNotificationsRequest(event, payload) {
  const { method, params = {} } = payload;
  switch (method) {
    case 'getUserNotifications':
      return await notificationsService.getUserNotifications(params.userId, params.limit);
    case 'getById':
      return await notificationsService.getById(params.id);
    case 'delete':
      return await notificationsService.delete(params.id);
    case 'getUnread':
      return await notificationsService.getUnread(params.userId);
    case 'getUnreadCount':
      return await notificationsService.getUnreadCount(params.userId);
    case 'markAsRead':
      return await notificationsService.markAsRead(params.id);
    case 'markAllAsRead':
      return await notificationsService.markAllAsRead(params.userId);
    case 'getTemplates':
      return await notificationsService.getTemplates(params.page, params.pageSize, params.search);
    case 'getTemplateById':
      return await notificationsService.getTemplateById(params.id);
    case 'createTemplate':
      return await notificationsService.createTemplate(params.data);
    case 'updateTemplate':
      return await notificationsService.updateTemplate(params.id, params.data);
    case 'deleteTemplate':
      return await notificationsService.deleteTemplate(params.id);
    case 'getLogs':
      return await notificationsService.getLogs(params.page, params.pageSize, params.recipientEmail, params.status, params.channel);
    case 'getLogById':
      return await notificationsService.getLogById(params.id);
    case 'deleteLog':
      return await notificationsService.deleteLog(params.id);
    case 'retryLog':
      return await notificationsService.retryLog(params.id);
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

ipcMain.handle('medinova:notifications', async (event, payload) => {
  try {
    const result = await handleNotificationsRequest(event, payload);
    return { status: true, message: 'OK', data: result };
  } catch (err) {
    console.error('[IPC:notifications]', err);
    return { status: false, message: err.message, data: null };
  }
});

console.log("[IPC] notifications handler registered");
const { backendFetch } = require('../../main/core/backend-fetch');

const notificationsService = {
  getUserNotifications: (userId, limit = 20) => backendFetch("/notifications/user/" + userId + "?limit=" + limit),
  getById: (id) => backendFetch("/notifications/" + id),
  delete: (id) => backendFetch("/notifications/" + id, { method: 'DELETE' }),
  getUnread: (userId) => backendFetch("/notifications/user/" + userId + "/unread"),
  getUnreadCount: (userId) => backendFetch("/notifications/user/" + userId + "/unread-count"),
  markAsRead: (id) => backendFetch("/notifications/" + id + "/read", { method: 'PATCH' }),
  markAllAsRead: (userId) => backendFetch("/notifications/user/" + userId + "/read-all", { method: 'POST' }),
  getTemplates: (page = 1, pageSize = 10, search = '') => {
    let url = "/notification-templates?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getTemplateById: (id) => backendFetch("/notification-templates/" + id),
  createTemplate: (data) => backendFetch("/notification-templates", { method: 'POST', body: JSON.stringify(data) }),
  updateTemplate: (id, data) => backendFetch("/notification-templates/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTemplate: (id) => backendFetch("/notification-templates/" + id, { method: 'DELETE' }),
  getLogs: (page = 1, pageSize = 10, recipientEmail = null, status = null, channel = null) => {
    let url = "/notify-logs?page=" + page + "&pageSize=" + pageSize;
    if (recipientEmail) url = url + "&recipientEmail=" + encodeURIComponent(recipientEmail);
    if (status) url = url + "&status=" + encodeURIComponent(status);
    if (channel) url = url + "&channel=" + encodeURIComponent(channel);
    return backendFetch(url);
  },
  getLogById: (id) => backendFetch("/notify-logs/" + id),
  deleteLog: (id) => backendFetch("/notify-logs/" + id, { method: 'DELETE' }),
  retryLog: (id) => backendFetch("/notify-logs/" + id + "/retry", { method: 'POST' }),
};

module.exports = notificationsService;
const { backendFetch } = require('../../main/core/backend-fetch');

const invoicesService = {
  getAll: (page = 1, pageSize = 10, clientId = null, status = null) => {
    let url = "/Invoices?page=" + page + "&pageSize=" + pageSize;
    if (clientId) url = url + "&clientId=" + clientId;
    if (status) url = url + "&status=" + encodeURIComponent(status);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/Invoices/" + id),
  create: (data) => backendFetch("/Invoices", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/Invoices/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/Invoices/" + id, { method: 'DELETE' }),
  updateStatus: (id, status) => backendFetch("/Invoices/" + id + "/status", { method: 'PATCH', body: JSON.stringify({ status: status }) }),
  getByClient: (clientId) => backendFetch("/Invoices/client/" + clientId),
};

module.exports = invoicesService;
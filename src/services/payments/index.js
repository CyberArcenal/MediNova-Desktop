const { backendFetch } = require('../../main/core/backend-fetch');

const paymentsService = {
  getAll: (page = 1, pageSize = 10, invoiceId = null, method = null) => {
    let url = "/Payments?page=" + page + "&pageSize=" + pageSize;
    if (invoiceId) url = url + "&invoiceId=" + invoiceId;
    if (method) url = url + "&method=" + encodeURIComponent(method);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/Payments/" + id),
  create: (data) => backendFetch("/Payments", { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/Payments/" + id, { method: 'DELETE' }),
  getByInvoice: (invoiceId) => backendFetch("/Payments/invoice/" + invoiceId),
};

module.exports = paymentsService;
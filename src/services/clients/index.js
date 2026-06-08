const { backendFetch } = require('../../main/core/backend-fetch');

const clientsService = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    let url = "/Clients?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/Clients/" + id),
  create: (data) => backendFetch("/Clients", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/Clients/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/Clients/" + id, { method: 'DELETE' }),
  analytics: (months = 12) => backendFetch("/analytics/clients?months=" + months),
};

module.exports = clientsService;
const { backendFetch } = require('../../main/core/backend-fetch');

const packagesService = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    let url = "/packages?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/packages/" + id),
  create: (data) => backendFetch("/packages", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/packages/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/packages/" + id, { method: 'DELETE' }),
  toggleActive: (id) => backendFetch("/packages/" + id + "/toggle-active", { method: 'PATCH' }),
};

module.exports = packagesService;
const { backendFetch } = require('../../main/core/backend-fetch');

const categoriesService = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    let url = "/categories?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/categories/" + id),
  create: (data) => backendFetch("/categories", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/categories/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/categories/" + id, { method: 'DELETE' }),
  toggleActive: (id) => backendFetch("/categories/" + id + "/toggle-active", { method: 'PATCH' }),
};

module.exports = categoriesService;
const { backendFetch } = require('../../main/core/backend-fetch');

const staffService = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    let url = "/Staff?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/Staff/" + id),
  create: (data) => backendFetch("/Staff", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/Staff/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/Staff/" + id, { method: 'DELETE' }),
  toggleActive: (id) => backendFetch("/Staff/" + id + "/toggle-active", { method: 'PATCH' }),
  getActive: () => backendFetch("/Staff/active"),
  getByPosition: (position) => backendFetch("/Staff/position/" + encodeURIComponent(position)),
};

module.exports = staffService;
const { backendFetch } = require('../../main/core/backend-fetch');

const usersService = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    let url = "/users?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/users/" + id),
  create: (data) => backendFetch("/users", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/users/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/users/" + id, { method: 'DELETE' }),
  activate: (id, isActive = true) => backendFetch("/users/" + id + "/activate?isActive=" + isActive, { method: 'PATCH' }),
};

module.exports = usersService;
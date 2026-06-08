const { backendFetch } = require('../../main/core/backend-fetch');

const rolesService = {
  getAll: () => backendFetch("/roles"),
  getById: (id) => backendFetch("/roles/" + id),
  create: (data) => backendFetch("/roles", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/roles/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/roles/" + id, { method: 'DELETE' }),
  assignRole: (userId, roleId) => backendFetch("/roles/assign", { method: 'POST', body: JSON.stringify({ userId, roleId }) }),
  removeRole: (userId, roleId) => backendFetch("/roles/remove", { method: 'POST', body: JSON.stringify({ userId, roleId }) }),
  getUserRoles: (userId) => backendFetch("/roles/user/" + userId),
};

module.exports = rolesService;
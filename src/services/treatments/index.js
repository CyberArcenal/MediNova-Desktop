const { backendFetch } = require('../../main/core/backend-fetch');

const treatmentsService = {
  getAll: (page = 1, pageSize = 10, search = '') => {
    let url = "/Treatments?page=" + page + "&pageSize=" + pageSize;
    if (search) url = url + "&search=" + encodeURIComponent(search);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/Treatments/" + id),
  create: (data) => backendFetch("/Treatments", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/Treatments/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/Treatments/" + id, { method: 'DELETE' }),
  toggleActive: (id) => backendFetch("/Treatments/" + id + "/toggle-active", { method: 'PATCH' }),
  getActive: () => backendFetch("/Treatments/active"),
  getByCategory: (category) => backendFetch("/Treatments/category/" + encodeURIComponent(category)),
};

module.exports = treatmentsService;
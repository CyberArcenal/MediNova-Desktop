const { backendFetch } = require('../../main/core/backend-fetch');

const appointmentsService = {
  getAll: (page = 1, pageSize = 10, clientId = null, status = null, fromDate = null, toDate = null) => {
    let url = "/Appointments?page=" + page + "&pageSize=" + pageSize;
    if (clientId) url = url + "&clientId=" + clientId;
    if (status) url = url + "&status=" + encodeURIComponent(status);
    if (fromDate) url = url + "&fromDate=" + encodeURIComponent(fromDate);
    if (toDate) url = url + "&toDate=" + encodeURIComponent(toDate);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/Appointments/" + id),
  create: (data) => backendFetch("/Appointments", { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => backendFetch("/Appointments/" + id, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => backendFetch("/Appointments/" + id, { method: 'DELETE' }),
  updateStatus: (id, status) => backendFetch("/Appointments/" + id + "/status", { method: 'PATCH', body: JSON.stringify({ status: status }) }),
  getByClient: (clientId) => backendFetch("/Appointments/client/" + clientId),
  getByDateRange: (start, end) => backendFetch("/Appointments/daterange?start=" + start + "&end=" + end),
};

module.exports = appointmentsService;
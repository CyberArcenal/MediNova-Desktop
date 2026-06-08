const { backendFetch } = require('../../main/core/backend-fetch');

const reportsService = {
  getAll: (page = 1, pageSize = 10, reportName = null, fromDate = null, toDate = null) => {
    let url = "/reports?page=" + page + "&pageSize=" + pageSize;
    if (reportName) url = url + "&reportName=" + encodeURIComponent(reportName);
    if (fromDate) url = url + "&fromDate=" + encodeURIComponent(fromDate);
    if (toDate) url = url + "&toDate=" + encodeURIComponent(toDate);
    return backendFetch(url);
  },
  getById: (id) => backendFetch("/reports/" + id),
  delete: (id) => backendFetch("/reports/" + id, { method: 'DELETE' }),
  generate: (data) => backendFetch("/reports/generate", { method: 'POST', body: JSON.stringify(data) }),
  triggerWeekly: () => backendFetch("/reports/trigger-weekly-report", { method: 'POST' }),
  getRevenue: (startDate, endDate) => {
    let url = "/reports/revenue";
    if (startDate) url = url + "?startDate=" + encodeURIComponent(startDate);
    if (endDate) url = url + (startDate ? "&endDate=" : "?endDate=") + encodeURIComponent(endDate);
    return backendFetch(url);
  },
};

module.exports = reportsService;
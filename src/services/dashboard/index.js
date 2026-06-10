// src/services/dashboard/index.js
const { backendFetch } = require('../../main/core/backend-fetch');

const dashboardService = {
  getStats: () => backendFetch('/dashboard/stats'),
};

module.exports = dashboardService;
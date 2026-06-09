// src/renderer/api/core/dashboard.ts

export interface DashboardStatsDto {
  kpis: {
    revenueThisMonth: number;
    revenueLastMonth: number;
    revenueChangePercent: number;
    appointmentsThisMonth: number;
    appointmentsLastMonth: number;
    appointmentsChangePercent: number;
    newClientsThisMonth: number;
    newClientsLastMonth: number;
    newClientsChangePercent: number;
    averageTicket: number;
  };
  dailyRevenue: Array<{ date: string; revenue: number; appointments: number }>;
  topServices: Array<{ serviceName: string; category: string; appointmentCount: number; revenue: number; percentageOfTotal: number }>;
  appointmentFunnel: {
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    completionRate: number;
    cancellationRate: number;
    noShowRate: number;
  };
  clientRetention: {
    totalClients: number;
    newClients30Days: number;
    returningClients30Days: number;
    retentionRate: number;
  };
  staffPerformance: Array<{ staffName: string; completedAppointments: number; revenueGenerated: number; utilizationRate: number }>;
  forecast: {
    projectedRevenueNextWeek: number;
    projectedAppointmentsNextWeek: number;
    note: string;
  };
}

export interface DashboardAPI {
  getStats(): Promise<DashboardStatsDto>;
}

const dashboardAPI: DashboardAPI = {
  async getStats() {
    const response = await window.backendAPI.dashboard('getStats', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default dashboardAPI;
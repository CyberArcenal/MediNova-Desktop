// src/renderer/pages/clients/analytics/index.tsx
import React from 'react';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useClientAnalytics } from './hooks/useClientAnalytics';
import AnalyticsKPICards from './components/AnalyticsKPICards';
import MonthlyTrendsChart from './components/MonthlyTrendsChart';
import TopClientsTable from './components/TopClientsTable';
import CohortRetentionTable from './components/CohortRetentionTable';

const ClientAnalyticsPage: React.FC = () => {
  const { data, loading, error } = useClientAnalytics(12);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading analytics..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-500">
          <p>Failed to load analytics data</p>
          <p className="text-sm text-[var(--text-tertiary)]">{error}</p>
        </div>
      </div>
    );
  }

  const { kpis, topClientsByRevenue, topClientsByAppointments, monthlyTrends, retentionData } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Client Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Insights on client growth, retention, and top performers</p>
      </div>

      {/* KPI Cards */}
      <AnalyticsKPICards
        totalClients={kpis.totalClients}
        activeClients={kpis.activeClients}
        newClientsThisMonth={kpis.newClientsThisMonth}
        retentionRate={kpis.retentionRate}
      />

      {/* Monthly Trends Chart */}
      <MonthlyTrendsChart data={monthlyTrends} />

      {/* Two Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopClientsTable title="Top Clients by Revenue" data={topClientsByRevenue} type="revenue" />
        <TopClientsTable title="Top Clients by Appointments" data={topClientsByAppointments} type="appointments" />
      </div>

      {/* Cohort Retention Table */}
      <CohortRetentionTable cohorts={retentionData.cohorts} overallRetentionRate={retentionData.overallRetentionRate} />
    </div>
  );
};

export default ClientAnalyticsPage;
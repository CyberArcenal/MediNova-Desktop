// src/renderer/pages/analytics/index.tsx
import React from 'react';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { useBusinessAnalytics } from './hooks/useBusinessAnalytics';
import AnalyticsKPICards from './components/AnalyticsKPICards';
import DailyRevenueChart from './components/DailyRevenueChart';
import ClientTrendsChart from './components/ClientTrendsChart';
import TopServicesChart from './components/TopServicesChart';
import RetentionSummary from './components/RetentionSummary';

const AnalyticsPage: React.FC = () => {
  const { dashboardStats, clientAnalytics, loading } = useBusinessAnalytics();

  if (loading || !dashboardStats || !clientAnalytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading analytics..." />
      </div>
    );
  }

  const {
    kpis: dashboardKpis,
    dailyRevenue,
    topServices,
  } = dashboardStats;

  const {
    kpis: clientKpis,
    monthlyTrends,
    retentionData,
  } = clientAnalytics;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Business Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Key metrics and trends at a glance</p>
      </div>

      {/* KPI Cards */}
      <AnalyticsKPICards
        revenueThisMonth={dashboardKpis.revenueThisMonth}
        appointmentsThisMonth={dashboardKpis.appointmentsThisMonth}
        newClientsThisMonth={dashboardKpis.newClientsThisMonth}
        retentionRate={clientKpis.retentionRate}
      />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyRevenueChart data={dailyRevenue} />
        <ClientTrendsChart data={monthlyTrends} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopServicesChart data={topServices.map(s => ({ serviceName: s.serviceName, revenue: s.revenue }))} />
        <RetentionSummary retentionRate={clientKpis.retentionRate} overallRetentionRate={retentionData.overallRetentionRate} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
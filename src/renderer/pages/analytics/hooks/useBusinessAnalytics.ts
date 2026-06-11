// src/renderer/pages/analytics/hooks/useBusinessAnalytics.ts
import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';
import dashboardAPI, { type DashboardStatsDto } from '../../../api/core/dashboard';
import clientsAPI, { type ClientAnalyticsDto } from '../../../api/core/clients';

export interface BusinessAnalyticsData {
  dashboard: DashboardStatsDto | null;
  clientAnalytics: ClientAnalyticsDto | null;
  loading: boolean;
}

export const useBusinessAnalytics = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsDto | null>(null);
  const [clientAnalytics, setClientAnalytics] = useState<ClientAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [stats, analytics] = await Promise.all([
          dashboardAPI.getStats(),
          clientsAPI.analytics(12),
        ]);
        setDashboardStats(stats);
        setClientAnalytics(analytics);
      } catch (error) {
        console.error('Failed to fetch analytics data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { dashboardStats, clientAnalytics, loading };
};
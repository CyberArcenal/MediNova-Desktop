// src/renderer/pages/clients/analytics/hooks/useClientAnalytics.ts
import { useState, useEffect } from 'react';
import clientsAPI, { type ClientAnalyticsDto } from '../../../../api/core/clients';

export const useClientAnalytics = (months: number = 12) => {
  const [data, setData] = useState<ClientAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await clientsAPI.analytics(months);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [months]);

  return { data, loading, error };
};
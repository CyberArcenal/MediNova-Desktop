// src/renderer/pages/reports/clients/hooks/useClientRetention.ts
import { useState, useEffect } from 'react';
import clientsAPI, { type ClientAnalyticsDto } from '../../../../api/core/clients';

export const useClientRetention = () => {
  const [data, setData] = useState<ClientAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const result = await clientsAPI.analytics(12); // months = 12 for cohort data
        setData(result);
      } catch (error) {
        console.error('Failed to load client retention data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return { data, loading };
};
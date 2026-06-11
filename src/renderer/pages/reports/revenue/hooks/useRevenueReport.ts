// src/renderer/pages/reports/revenue/hooks/useRevenueReport.ts
import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';
import reportsAPI, { type RevenueReportDto } from '../../../../api/core/reports';

export const useRevenueReport = () => {
  const [data, setData] = useState<RevenueReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const startISO = formatISO(startDate, { representation: 'date' });
      const endISO = formatISO(endDate, { representation: 'date' });
      const result = await reportsAPI.getRevenueReport(startISO, endISO);
      setData(result);
    } catch (error) {
      console.error('Failed to fetch revenue report', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const resetDates = () => {
    setStartDate(startOfMonth(new Date()));
    setEndDate(endOfMonth(new Date()));
  };

  return {
    data,
    loading,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    resetDates,
    refetch: fetchReport,
  };
};
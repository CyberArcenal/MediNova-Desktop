// src/renderer/pages/reports/appointments/hooks/useAppointmentsReport.ts
import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, formatISO, eachDayOfInterval, isSameDay } from 'date-fns';
import appointmentsAPI, { type AppointmentResponseDto } from '../../../../api/core/appointments';

export interface DailyAppointmentCount {
  date: string;
  count: number;
}

export const useAppointmentsReport = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const startISO = formatISO(startDate, { representation: 'complete' });
      const endISO = formatISO(endDate, { representation: 'complete' });
      const data = await appointmentsAPI.getByDateRange(startISO, endISO);
      setAppointments(data);
      setTotalPages(Math.ceil(data.length / pageSize));
      setPage(1); // reset to first page on new date range
    } catch (error) {
      console.error('Failed to fetch appointments report', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, pageSize]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Compute daily counts for chart
  const dailyCounts: DailyAppointmentCount[] = useCallback(() => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.map(day => ({
      date: formatISO(day, { representation: 'date' }),
      count: appointments.filter(apt => isSameDay(new Date(apt.appointmentDateTime), day)).length,
    }));
  }, [appointments, startDate, endDate])();

  const paginatedAppointments = appointments.slice((page - 1) * pageSize, page * pageSize);

  const resetDates = () => {
    setStartDate(startOfMonth(new Date()));
    setEndDate(endOfMonth(new Date()));
  };

  return {
    appointments: paginatedAppointments,
    allAppointments: appointments,
    loading,
    startDate,
    endDate,
    page,
    totalPages,
    dailyCounts,
    setStartDate,
    setEndDate,
    setPage,
    resetDates,
    refetch: fetchAppointments,
  };
};
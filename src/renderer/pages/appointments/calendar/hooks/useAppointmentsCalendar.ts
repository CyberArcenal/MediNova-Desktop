// src/renderer/pages/appointments/calendar/hooks/useAppointmentsCalendar.ts (updated)
import { useState, useEffect, useCallback, useRef } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, formatISO } from 'date-fns';
import appointmentsAPI, { type AppointmentResponseDto } from '../../../../api/core/appointments';

export const useAppointmentsCalendar = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentViewRef = useRef<'month' | 'week' | 'day'>('month');

  const fetchAppointments = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const startISO = formatISO(start, { representation: 'complete' });
      const endISO = formatISO(end, { representation: 'complete' });
      const data = await appointmentsAPI.getByDateRange(startISO, endISO);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments for calendar', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onNavigate = useCallback((newDate: Date, view?: string) => {
    setCurrentDate(newDate);
    const currentView = (view as 'month' | 'week' | 'day') || currentViewRef.current;
    currentViewRef.current = currentView;
    let start: Date, end: Date;
    if (currentView === 'month') {
      start = startOfMonth(newDate);
      end = endOfMonth(newDate);
    } else if (currentView === 'week') {
      start = startOfWeek(newDate, { weekStartsOn: 1 });
      end = endOfWeek(newDate, { weekStartsOn: 1 });
    } else {
      start = newDate;
      end = newDate;
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }
    fetchAppointments(start, end);
  }, [fetchAppointments]);

  const refresh = useCallback(() => {
    // Re-fetch based on current date and view
    const view = currentViewRef.current;
    let start: Date, end: Date;
    if (view === 'month') {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    } else if (view === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      start = currentDate;
      end = currentDate;
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }
    fetchAppointments(start, end);
  }, [currentDate, fetchAppointments]);

  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    fetchAppointments(start, end);
  }, []);

  return {
    appointments,
    loading,
    currentDate,
    onNavigate,
    refresh,
  };
};
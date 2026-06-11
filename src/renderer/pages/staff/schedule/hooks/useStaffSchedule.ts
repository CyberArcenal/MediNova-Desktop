// src/renderer/pages/staff/schedule/hooks/useStaffSchedule.ts
import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';
import staffAPI, { type StaffResponseDto } from '../../../../api/core/staff';
import appointmentsAPI, { type AppointmentResponseDto } from '../../../../api/core/appointments';

export const useStaffSchedule = () => {
  const [staffList, setStaffList] = useState<StaffResponseDto[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load staff list
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const result = await staffAPI.getAll(1, 1000);
        setStaffList(result.items);
        if (result.items.length > 0 && !selectedStaffId) {
          setSelectedStaffId(result.items[0].id);
        }
      } catch (error) {
        console.error('Failed to load staff', error);
      }
    };
    loadStaff();
  }, []);

  const fetchAppointments = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const startISO = formatISO(start, { representation: 'complete' });
      const endISO = formatISO(end, { representation: 'complete' });
      const data = await appointmentsAPI.getByDateRange(startISO, endISO);
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch for current month
  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    fetchAppointments(start, end);
  }, [currentDate, fetchAppointments]);

  const onNavigate = useCallback((newDate: Date, view?: string) => {
    setCurrentDate(newDate);
    let start: Date, end: Date;
    if (view === 'month') {
      start = startOfMonth(newDate);
      end = endOfMonth(newDate);
    } else {
      // For week/day, we can fetch a larger range or just month; for simplicity, fetch month view only
      start = startOfMonth(newDate);
      end = endOfMonth(newDate);
    }
    fetchAppointments(start, end);
  }, [fetchAppointments]);

  const selectedStaff = staffList.find(s => s.id === selectedStaffId);
  const staffName = selectedStaff?.name || '';

  // Filter appointments by assigned staff name
  const filteredAppointments = staffName
    ? appointments.filter(apt => apt.assignedStaff === staffName)
    : [];

  return {
    staffList,
    selectedStaffId,
    setSelectedStaffId,
    appointments: filteredAppointments,
    loading,
    currentDate,
    onNavigate,
    staffName,
  };
};
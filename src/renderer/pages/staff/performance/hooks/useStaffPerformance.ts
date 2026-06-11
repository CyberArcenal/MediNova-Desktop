// src/renderer/pages/staff/performance/hooks/useStaffPerformance.ts
import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, formatISO } from 'date-fns';
import staffAPI, { type StaffResponseDto } from '../../../../api/core/staff';
import appointmentsAPI, { type AppointmentResponseDto } from '../../../../api/core/appointments';
import treatmentsAPI, { type TreatmentResponseDto } from '../../../../api/core/treatments';

export interface StaffPerformanceData {
  staffId: number;
  staffName: string;
  position: string;
  completedAppointments: number;
  revenue: number;
  utilizationRate: number;
}

export const useStaffPerformance = () => {
  const [staffList, setStaffList] = useState<StaffResponseDto[]>([]);
  const [performanceData, setPerformanceData] = useState<StaffPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch staff
      const staffResult = await staffAPI.getAll(1, 1000);
      const staff = staffResult.items;

      // Fetch treatments for price mapping
      const treatmentsResult = await treatmentsAPI.getAll(1, 1000);
      const treatmentMap = new Map<number, number>();
      treatmentsResult.items.forEach(t => treatmentMap.set(t.id, t.price));

      // Fetch appointments in date range
      const fromISO = formatISO(fromDate, { representation: 'complete' });
      const toISO = formatISO(toDate, { representation: 'complete' });
      // Use a large pageSize to get all (or loop if needed)
      const appointmentsResult = await appointmentsAPI.getAll({
        page: 1,
        pageSize: 1000,
        fromDate: fromISO,
        toDate: toISO,
      });
      const appointments = appointmentsResult.items;

      // Filter completed appointments
      const completedAppointments = appointments.filter(apt => apt.status === 'Completed');

      // Aggregate per staff (by assignedStaff name)
      const staffMap = new Map<number, { completed: number; revenue: number }>();
      staff.forEach(s => staffMap.set(s.id, { completed: 0, revenue: 0 }));

      // Also handle case where staff name may not match exactly? We'll match by staff name string.
      // Since assignedStaff is a string, we need to map staff name to staff id.
      const nameToId = new Map<string, number>();
      staff.forEach(s => nameToId.set(s.name, s.id));

      for (const apt of completedAppointments) {
        const staffName = apt.assignedStaff;
        if (staffName && nameToId.has(staffName)) {
          const staffId = nameToId.get(staffName)!;
          const treatmentPrice = treatmentMap.get(apt.treatmentId) || 0;
          const current = staffMap.get(staffId)!;
          staffMap.set(staffId, {
            completed: current.completed + 1,
            revenue: current.revenue + treatmentPrice,
          });
        }
      }

      // Calculate total completed across all staff
      let totalCompleted = 0;
      staffMap.forEach(val => totalCompleted += val.completed);

      // Build result array
      const result: StaffPerformanceData[] = staff.map(s => {
        const data = staffMap.get(s.id)!;
        const utilRate = totalCompleted > 0 ? (data.completed / totalCompleted) * 100 : 0;
        return {
          staffId: s.id,
          staffName: s.name,
          position: s.position || '—',
          completedAppointments: data.completed,
          revenue: data.revenue,
          utilizationRate: utilRate,
        };
      }).sort((a, b) => b.revenue - a.revenue); // sort by revenue descending

      setPerformanceData(result);
    } catch (error) {
      console.error('Failed to load performance data', error);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetDates = () => {
    setFromDate(startOfMonth(new Date()));
    setToDate(endOfMonth(new Date()));
  };

  return {
    performanceData,
    loading,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    resetDates,
    refetch: fetchData,
  };
};
// src/renderer/pages/staff/schedule/index.tsx
import React from 'react';
import { useStaffSchedule } from './hooks/useStaffSchedule';
import StaffScheduleCalendar from './components/StaffScheduleCalendar';
import AppointmentViewModal from '../../appointments/list/components/AppointmentViewModal';
import type { AppointmentResponseDto } from '../../../api/core/appointments';
import { useModal } from '../../../hooks/useModal';

const StaffSchedulePage: React.FC = () => {
  const {
    staffList,
    selectedStaffId,
    setSelectedStaffId,
    appointments,
    loading,
    currentDate,
    onNavigate,
    staffName,
  } = useStaffSchedule();

  const viewModal = useModal();
  const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentResponseDto | null>(null);

  const handleSelectEvent = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    viewModal.open();
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Staff Schedule</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">View appointments assigned to each staff member</p>
      </div>

      {/* Staff Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Select Staff:</label>
        <select
          value={selectedStaffId || ''}
          onChange={(e) => setSelectedStaffId(Number(e.target.value) || null)}
          className="px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
        >
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.name} {staff.position ? `(${staff.position})` : ''}
            </option>
          ))}
        </select>
        {staffName && (
          <span className="text-sm text-[var(--text-tertiary)]">
            Showing appointments for <span className="font-medium text-[var(--text-primary)]">{staffName}</span>
          </span>
        )}
      </div>

      {/* Calendar */}
      <StaffScheduleCalendar
        appointments={appointments}
        loading={loading}
        currentDate={currentDate}
        onNavigate={onNavigate}
        onSelectEvent={handleSelectEvent}
      />

      {/* Reuse Appointment View Modal */}
      <AppointmentViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default StaffSchedulePage;
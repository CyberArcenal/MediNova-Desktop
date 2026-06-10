// src/renderer/pages/appointments/calendar/index.tsx
import React from 'react';
import { useAppointmentsCalendar } from './hooks/useAppointmentsCalendar';
import CalendarView from './components/CalendarView';
import AppointmentViewModal from '../list/components/AppointmentViewModal';
import AppointmentFormModal from '../list/components/AppointmentFormModal';
import { useModal } from '../../../hooks/useModal';
import type { AppointmentResponseDto } from '../../../api/core/appointments';

const AppointmentsCalendarPage: React.FC = () => {
const { appointments, loading, currentDate, onNavigate, refresh } = useAppointmentsCalendar();

  const viewModal = useModal();
  const formModal = useModal();
  const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentResponseDto | null>(null);
  const [preselectedDateTime, setPreselectedDateTime] = React.useState<Date | undefined>(undefined);

  const handleSelectEvent = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    viewModal.open();
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setPreselectedDateTime(slotInfo.start);
    formModal.open();
  };

 // sa handleFormSuccess
const handleFormSuccess = () => {
  formModal.close();
  refresh();  // ← tawagin ang refresh mula sa hook
  setPreselectedDateTime(undefined);
};

  // Para mag‑refresh, kailangan nating tawagin ang fetchAppointments mula sa hook.
  // I‑a‑adjust ang hook: ibalik ang `refresh` na function.
  // Sa ibaba, ipapakita ko ang updated hook.

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Appointments Calendar</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">View, add, or edit appointments</p>
      </div>

      <CalendarView
        appointments={appointments}
        loading={loading}
        currentDate={currentDate}
        onNavigate={onNavigate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
      />

      <AppointmentViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        appointment={selectedAppointment}
      />

      <AppointmentFormModal
        isOpen={formModal.isOpen}
        onClose={() => {
          formModal.close();
          setPreselectedDateTime(undefined);
        }}
        onSuccess={handleFormSuccess}
        initialData={null}
        preselectedDateTime={preselectedDateTime}
      />
    </div>
  );
};

export default AppointmentsCalendarPage;
// src/renderer/pages/reports/appointments/index.tsx
import React from 'react';
import { useAppointmentsReport } from './hooks/useAppointmentsReport';
import DailyAppointmentsChart from './components/DailyAppointmentsChart';
import AppointmentsReportTable from './components/AppointmentsReportTable';
import { useModal } from '../../../hooks/useModal';
import type { AppointmentResponseDto } from '../../../api/core/appointments';
import DatePicker from 'react-datepicker';
import Button from '../../../components/UI/Button';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import AppointmentViewModal from '../../appointments/list/components/AppointmentViewModal';

const AppointmentsReportPage: React.FC = () => {
  const {
    appointments,
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
    refetch,
  } = useAppointmentsReport();

  const viewModal = useModal();
  const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentResponseDto | null>(null);

  const handleView = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    viewModal.open();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Appointments Report</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">View appointments by date range</p>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">From:</span>
          <DatePicker selected={startDate} onChange={(date: any) => setStartDate(date || new Date())} dateFormat="yyyy-MM-dd" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">To:</span>
          <DatePicker selected={endDate} onChange={(date: any) => setEndDate(date || new Date())} dateFormat="yyyy-MM-dd" />
        </div>
        <Button variant="primary" size="sm" onClick={refetch}>Apply</Button>
        <Button variant="secondary" size="sm" onClick={resetDates}>Reset to Current Month</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          {/* Chart */}
          <DailyAppointmentsChart data={dailyCounts} />

          {/* Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Appointment List</h3>
            <AppointmentsReportTable appointments={appointments} onView={handleView} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}

      <AppointmentViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentsReportPage;
// src/renderer/pages/appointments/list/index.tsx
import React from 'react';
import { Plus, Filter, X } from 'lucide-react';
import Button from '../../../components/UI/Button';
import SearchInput from '../../../components/UI/SearchInput';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import ClientSelect from '../../../components/Selects/ClientSelect';
import AppointmentStatusSelect from '../../../components/Selects/AppointmentStatusSelect';
import DatePicker from '../../../components/UI/DatePicker';
import { useAppointments } from './hooks/useAppointments';
import AppointmentTable from './components/AppointmentTable';
import AppointmentViewModal from './components/AppointmentViewModal';
import AppointmentFormModal from './components/AppointmentFormModal';
import ChangeStatusModal from './components/ChangeStatusModal';

const AppointmentsListPage: React.FC = () => {
  const {
    appointments,
    loading,
    page,
    totalPages,
    totalCount,
    filters,
    selectedAppointment,
    editingAppointment,
    statusToChange,
    viewModal,
    formModal,
    statusModal,
    setPage,
    setClientId,
    setStatus,
    setFromDate,
    setToDate,
    handleDelete,
    handleUpdateStatus,
    handleView,
    handleEdit,
    handleAddNew,
    handleChangeStatusClick,
    handleFormSuccess,
    handleStatusChangeSuccess,
    resetFilters,
  } = useAppointments();

  const hasFilters = !!(filters.clientId || filters.status || filters.fromDate || filters.toDate);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Appointments</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage all appointments</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Book Appointment
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--border-color)] space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ClientSelect
            value={filters.clientId}
            onChange={(id) => { setClientId(id); setPage(1); }}
            placeholder="Filter by client"
          />
          <AppointmentStatusSelect
            value={filters.status}
            onChange={(val) => { setStatus(val); setPage(1); }}
          />
          <DatePicker
            selected={filters.fromDate ? new Date(filters.fromDate) : null}
            onChange={(date) => setFromDate(date ? date.toISOString() : '')}
            placeholderText="From Date"
          />
          <DatePicker
            selected={filters.toDate ? new Date(filters.toDate) : null}
            onChange={(date) => setToDate(date ? date.toISOString() : '')}
            placeholderText="To Date"
          />
        </div>
        {hasFilters && (
          <div className="flex justify-end">
            <button onClick={resetFilters} className="text-xs text-[var(--primary-color)] hover:underline flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <AppointmentTable
            appointments={appointments}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeStatus={handleChangeStatusClick}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} appointment{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Modals */}
      <AppointmentViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        appointment={selectedAppointment}
      />
      <AppointmentFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingAppointment}
      />
      {statusToChange && (
        <ChangeStatusModal
          isOpen={statusModal.isOpen}
          onClose={statusModal.close}
          onConfirm={(newStatus) => handleUpdateStatus(statusToChange.id, newStatus).then(handleStatusChangeSuccess)}
          currentStatus={statusToChange.currentStatus}
        />
      )}
    </div>
  );
};

export default AppointmentsListPage;
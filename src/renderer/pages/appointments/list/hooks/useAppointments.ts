// src/renderer/pages/appointments/list/hooks/useAppointments.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import appointmentsAPI, { type AppointmentResponseDto, type AppointmentListParams } from '../../../../api/core/appointments';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const useAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [clientId, setClientId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Selected appointment for modals
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponseDto | null>(null);

  // Modals
  const viewModal = useModal();
  const formModal = useModal();
  const statusModal = useModal();
  const [editingAppointment, setEditingAppointment] = useState<AppointmentResponseDto | null>(null);
  const [statusToChange, setStatusToChange] = useState<{ id: number; currentStatus: string } | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params: AppointmentListParams = {
        page,
        pageSize,
        clientId: clientId || undefined,
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };
      const result = await appointmentsAPI.getAll(params);
      setAppointments(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, clientId, status, fromDate, toDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Appointment',
      message: 'Are you sure you want to delete this appointment? This action cannot be undone.',
    });
    if (confirmed) {
      try {
        await appointmentsAPI.delete(id);
        await fetchAppointments();
      } catch (error) {
        console.error('Failed to delete appointment', error);
      }
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await appointmentsAPI.updateStatus(id, newStatus);
      await fetchAppointments();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleView = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    viewModal.open();
  };

  const handleEdit = (appointment: AppointmentResponseDto) => {
    setEditingAppointment(appointment);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingAppointment(null);
    formModal.open();
  };

  const handleChangeStatusClick = (id: number, currentStatus: string) => {
    setStatusToChange({ id, currentStatus });
    statusModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingAppointment(null);
    fetchAppointments();
  };

  const handleStatusChangeSuccess = () => {
    statusModal.close();
    setStatusToChange(null);
    fetchAppointments();
  };

  const resetFilters = () => {
    setClientId(null);
    setStatus('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  return {
    // State
    appointments,
    loading,
    page,
    totalPages,
    totalCount,
    filters: { clientId, status, fromDate, toDate },
    selectedAppointment,
    editingAppointment,
    statusToChange,
    // Modal states
    viewModal,
    formModal,
    statusModal,
    // Setters
    setPage,
    setClientId,
    setStatus,
    setFromDate,
    setToDate,
    // Handlers
    handleDelete,
    handleUpdateStatus,
    handleView,
    handleEdit,
    handleAddNew,
    handleChangeStatusClick,
    handleFormSuccess,
    handleStatusChangeSuccess,
    resetFilters,
  };
};
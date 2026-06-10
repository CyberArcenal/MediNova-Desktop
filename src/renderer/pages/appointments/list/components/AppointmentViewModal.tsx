// src/renderer/pages/appointments/list/components/AppointmentViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { AppointmentResponseDto } from '../../../../api/core/appointments';

interface AppointmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentResponseDto | null;
}

const AppointmentViewModal: React.FC<AppointmentViewModalProps> = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status.toLowerCase()) {
      case 'scheduled': return `${base} bg-blue-100 text-blue-800`;
      case 'confirmed': return `${base} bg-green-100 text-green-800`;
      case 'completed': return `${base} bg-emerald-100 text-emerald-800`;
      case 'cancelled': return `${base} bg-red-100 text-red-800`;
      default: return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      size="md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Client</label>
            <p className="text-[var(--text-primary)]">{appointment.clientName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Treatment</label>
            <p className="text-[var(--text-primary)]">{appointment.treatmentName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Assigned Staff</label>
            <p className="text-[var(--text-primary)]">{appointment.assignedStaff || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Duration</label>
            <p className="text-[var(--text-primary)]">{appointment.durationMinutes} minutes</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Date & Time</label>
            <p className="text-[var(--text-primary)]">{formatDateTime(appointment.appointmentDateTime)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <p><span className={getStatusBadge(appointment.status)}>{appointment.status}</span></p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Notes</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{appointment.notes || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Created At</label>
            <p className="text-[var(--text-secondary)]">{new Date(appointment.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentViewModal;
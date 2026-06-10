// src/renderer/pages/appointments/list/components/AppointmentTable.tsx
import React from 'react';
import { Eye, Edit, Trash2, Repeat } from 'lucide-react';
import type { AppointmentResponseDto } from '../../../../api/core/appointments';

interface AppointmentTableProps {
  appointments: AppointmentResponseDto[];
  onView: (appointment: AppointmentResponseDto) => void;
  onEdit: (appointment: AppointmentResponseDto) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, currentStatus: string) => void;
}

const getStatusBadge = (status: string) => {
  const base = 'px-2 py-1 text-xs rounded-full font-medium';
  switch (status.toLowerCase()) {
    case 'scheduled':
      return `${base} bg-blue-100 text-blue-800`;
    case 'confirmed':
      return `${base} bg-green-100 text-green-800`;
    case 'completed':
      return `${base} bg-emerald-100 text-emerald-800`;
    case 'cancelled':
      return `${base} bg-red-100 text-red-800`;
    case 'noshow':
      return `${base} bg-gray-100 text-gray-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No appointments found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Client</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Treatment</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Staff</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Date & Time</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)]">{apt.clientName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{apt.treatmentName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{apt.assignedStaff || '—'}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDateTime(apt.appointmentDateTime)}</td>
              <td className="py-2.5 px-4">
                <span className={getStatusBadge(apt.status)}>{apt.status}</span>
              </td>
              <td className="py-2.5 px-4">
                <div className="flex gap-2">
                  <button onClick={() => onView(apt)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(apt)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onChangeStatus(apt.id, apt.status)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Change Status">
                    <Repeat className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(apt.id)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
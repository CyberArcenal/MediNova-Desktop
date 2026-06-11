// src/renderer/pages/reports/appointments/components/AppointmentsReportTable.tsx
import React from 'react';
import { Eye } from 'lucide-react';
import type { AppointmentResponseDto } from '../../../../api/core/appointments';

interface AppointmentsReportTableProps {
  appointments: AppointmentResponseDto[];
  onView: (appointment: AppointmentResponseDto) => void;
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

const formatDateTime = (dateTimeStr: string) => {
  return new Date(dateTimeStr).toLocaleString();
};

const AppointmentsReportTable: React.FC<AppointmentsReportTableProps> = ({ appointments, onView }) => {
  if (appointments.length === 0) {
    return <div className="text-center py-8 text-[var(--text-tertiary)]">No appointments in this period.</div>;
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
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Status</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)]">{apt.clientName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{apt.treatmentName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{apt.assignedStaff || '—'}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDateTime(apt.appointmentDateTime)}</td>
              <td className="py-2.5 px-4 text-center">
                <span className={getStatusBadge(apt.status)}>{apt.status}</span>
              </td>
              <td className="py-2.5 px-4 text-center">
                <button onClick={() => onView(apt)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsReportTable;
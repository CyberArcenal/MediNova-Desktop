// src/renderer/pages/clients/analytics/components/TopClientsTable.tsx
import React from 'react';
import type { TopClientDto } from '../../../../api/core/clients';

interface TopClientsTableProps {
  title: string;
  data: TopClientDto[];
  type: 'revenue' | 'appointments';
}

const TopClientsTable: React.FC<TopClientsTableProps> = ({ title, data, type }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!data.length) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        <div className="text-center py-8 text-[var(--text-tertiary)]">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-4 shadow-sm border border-[var(--border-color)]">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
            <tr>
              <th className="text-left py-2 px-3 font-semibold text-[var(--text-secondary)]">Client Name</th>
              <th className="text-left py-2 px-3 font-semibold text-[var(--text-secondary)]">Email</th>
              {type === 'revenue' ? (
                <th className="text-right py-2 px-3 font-semibold text-[var(--text-secondary)]">Total Spent</th>
              ) : (
                <th className="text-right py-2 px-3 font-semibold text-[var(--text-secondary)]">Appointments</th>
              )}
              <th className="text-left py-2 px-3 font-semibold text-[var(--text-secondary)]">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((client) => (
              <tr key={client.clientId} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)]">
                <td className="py-2 px-3 text-[var(--text-primary)]">{client.clientName}</td>
                <td className="py-2 px-3 text-[var(--text-secondary)]">{client.email}</td>
                <td className="py-2 px-3 text-right font-medium text-[var(--text-primary)]">
                  {type === 'revenue' ? formatCurrency(client.totalSpent) : client.appointmentCount}
                </td>
                <td className="py-2 px-3 text-[var(--text-secondary)]">{formatDate(client.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopClientsTable;
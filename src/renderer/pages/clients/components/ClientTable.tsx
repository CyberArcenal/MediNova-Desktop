// src/renderer/pages/clients/components/ClientTable.tsx
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import type { ClientResponseDto } from '../../../api/core/clients';

interface ClientTableProps {
  clients: ClientResponseDto[];
  onView: (client: ClientResponseDto) => void;
  onEdit: (client: ClientResponseDto) => void;
  onDelete: (id: number, name: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onView, onEdit, onDelete }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No clients found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Full Name</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Phone</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Registration Date</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)]">{client.fullName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{client.email}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{client.phoneNumber || '—'}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDate(client.createdAt)}</td>
              <td className="py-2.5 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(client)}
                    className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(client)}
                    className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(client.id, client.fullName)}
                    className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500"
                    title="Delete"
                  >
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

export default ClientTable;
// src/renderer/pages/staff/list/components/StaffTable.tsx
import React from 'react';
import { Eye, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import type { StaffResponseDto } from '../../../../api/core/staff';

interface StaffTableProps {
  staff: StaffResponseDto[];
  onView: (staff: StaffResponseDto) => void;
  onEdit: (staff: StaffResponseDto) => void;
  onDelete: (id: number, name: string) => void;
  onToggleActive: (id: number, currentActive: boolean) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  if (staff.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No staff members found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Phone</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Position</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Active</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-medium">{member.name}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{member.email || '—'}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{member.phone || '—'}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{member.position || '—'}</td>
              <td className="py-2.5 px-4 text-center">
                {member.isActive ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Inactive</span>
                )}
              </td>
              <td className="py-2.5 px-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onView(member)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(member)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onToggleActive(member.id, member.isActive)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title={member.isActive ? 'Deactivate' : 'Activate'}>
                    {member.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onDelete(member.id, member.name)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
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

export default StaffTable;
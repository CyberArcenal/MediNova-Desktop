// src/renderer/pages/treatments/list/components/TreatmentTable.tsx
import React from 'react';
import { Eye, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import type { TreatmentResponseDto } from '../../../../api/core/treatments';

interface TreatmentTableProps {
  treatments: TreatmentResponseDto[];
  onView: (treatment: TreatmentResponseDto) => void;
  onEdit: (treatment: TreatmentResponseDto) => void;
  onDelete: (id: number, name: string) => void;
  onToggleActive: (id: number, currentActive: boolean) => void;
}

const TreatmentTable: React.FC<TreatmentTableProps> = ({
  treatments,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
  };

  if (treatments.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No treatments found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Category</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Duration (min)</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Price</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Active</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((treatment) => (
            <tr key={treatment.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-medium">{treatment.name}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{treatment.categoryName || '—'}</td>
              <td className="py-2.5 px-4 text-right text-[var(--text-secondary)]">{treatment.durationMinutes}</td>
              <td className="py-2.5 px-4 text-right font-medium text-[var(--text-primary)]">{formatCurrency(treatment.price)}</td>
              <td className="py-2.5 px-4 text-center">
                {treatment.isActive ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Inactive</span>
                )}
              </td>
              <td className="py-2.5 px-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onView(treatment)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(treatment)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onToggleActive(treatment.id, treatment.isActive)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title={treatment.isActive ? 'Deactivate' : 'Activate'}>
                    {treatment.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onDelete(treatment.id, treatment.name)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
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

export default TreatmentTable;
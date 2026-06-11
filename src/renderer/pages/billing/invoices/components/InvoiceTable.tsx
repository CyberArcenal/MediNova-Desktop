// src/renderer/pages/billing/invoices/components/InvoiceTable.tsx
import React from 'react';
import { Eye, Edit, Trash2, Repeat, CreditCard } from 'lucide-react';
import type { InvoiceResponseDto } from '../../../../api/core/invoices';

interface InvoiceTableProps {
  invoices: InvoiceResponseDto[];
  onView: (invoice: InvoiceResponseDto) => void;
  onEdit: (invoice: InvoiceResponseDto) => void;
  onDelete: (id: number, invoiceNumber: string) => void;
  onChangeStatus: (id: number, currentStatus: string) => void;
  onAddPayment: (invoice: InvoiceResponseDto) => void;
}

const getStatusBadge = (status: string) => {
  const base = 'px-2 py-1 text-xs rounded-full font-medium';
  switch (status.toLowerCase()) {
    case 'paid': return `${base} bg-green-100 text-green-800`;
    case 'unpaid': return `${base} bg-red-100 text-red-800`;
    case 'overdue': return `${base} bg-orange-100 text-orange-800`;
    case 'draft': return `${base} bg-gray-100 text-gray-800`;
    case 'sent': return `${base} bg-blue-100 text-blue-800`;
    default: return `${base} bg-gray-100 text-gray-800`;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  onEdit,
  onDelete,
  onChangeStatus,
  onAddPayment,
}) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No invoices found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Invoice #</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Client</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Issue Date</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Due Date</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Total</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Balance Due</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-mono text-xs">{inv.invoiceNumber}</td>
              <td className="py-2.5 px-4 text-[var(--text-primary)]">{inv.clientName}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDate(inv.issueDate)}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{inv.dueDate ? formatDate(inv.dueDate) : '—'}</td>
              <td className="py-2.5 px-4 text-right font-medium text-[var(--text-primary)]">{formatCurrency(inv.total)}</td>
              <td className="py-2.5 px-4 text-center">
                <span className={getStatusBadge(inv.status)}>{inv.status}</span>
              </td>
              <td className="py-2.5 px-4 text-right font-medium text-red-600">{formatCurrency(inv.balanceDue)}</td>
              <td className="py-2.5 px-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onView(inv)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEdit(inv)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onChangeStatus(inv.id, inv.status)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Change Status">
                    <Repeat className="w-4 h-4" />
                  </button>
                  <button onClick={() => onAddPayment(inv)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Add Payment">
                    <CreditCard className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(inv.id, inv.invoiceNumber)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
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

export default InvoiceTable;
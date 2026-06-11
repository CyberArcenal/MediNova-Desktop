// src/renderer/pages/billing/payments/components/PaymentTable.tsx
import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { PaymentResponseDto } from '../../../../api/core/payments';

interface PaymentTableProps {
  payments: PaymentResponseDto[];
  onView: (payment: PaymentResponseDto) => void;
  onDelete: (id: number, invoiceNumber: string, amount: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onView, onDelete }) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No payments found
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
            <th className="text-right py-3 px-4 font-semibold text-[var(--text-secondary)]">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Payment Date</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Method</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Reference</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Notes</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors">
              <td className="py-2.5 px-4 font-mono text-xs text-[var(--text-primary)]">{payment.invoiceNumber}</td>
              <td className="py-2.5 px-4 text-[var(--text-primary)]">{payment.invoiceNumber.split('-')[0] || '—'} {/* We don't have client name directly, but we can show invoice number again or leave as — */} —</td>
              <td className="py-2.5 px-4 text-right font-medium text-[var(--text-primary)]">{formatCurrency(payment.amount)}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDate(payment.paymentDate)}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{payment.method}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{payment.referenceNumber || '—'}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)] max-w-xs truncate">{payment.notes || '—'}</td>
              <td className="py-2.5 px-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onView(payment)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(payment.id, payment.invoiceNumber, payment.amount)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
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

export default PaymentTable;
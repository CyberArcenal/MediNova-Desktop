// src/renderer/pages/billing/invoices/components/InvoiceViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { InvoiceResponseDto } from '../../../../api/core/invoices';
import type { PaymentResponseDto } from '../../../../api/core/payments';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceResponseDto | null;
  payments: PaymentResponseDto[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ isOpen, onClose, invoice, payments }) => {
  if (!invoice) return null;

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status.toLowerCase()) {
      case 'paid': return `${base} bg-green-100 text-green-800`;
      case 'unpaid': return `${base} bg-red-100 text-red-800`;
      case 'overdue': return `${base} bg-orange-100 text-orange-800`;
      default: return `${base} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice ${invoice.invoiceNumber}`}
      size="lg"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Client</label>
            <p className="text-[var(--text-primary)]">{invoice.clientName}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <div><span className={getStatusBadge(invoice.status)}>{invoice.status}</span></div>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Invoice Date</label>
            <p className="text-[var(--text-primary)]">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Due Date</label>
            <p className="text-[var(--text-primary)]">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</p>
          </div>
          {invoice.appointmentId && (
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)]">Appointment ID</label>
              <p className="text-[var(--text-primary)]">{invoice.appointmentId}</p>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Notes</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{invoice.notes || '—'}</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <label className="text-xs text-[var(--text-tertiary)]">Subtotal</label>
            <p className="text-[var(--text-primary)]">{formatCurrency(invoice.subtotal)}</p>
          </div>
          <div>
            <label className="text-xs text-[var(--text-tertiary)]">Tax</label>
            <p className="text-[var(--text-primary)]">{formatCurrency(invoice.tax)}</p>
          </div>
          <div>
            <label className="text-xs text-[var(--text-tertiary)]">Total</label>
            <p className="text-lg font-bold text-[var(--text-primary)]">{formatCurrency(invoice.total)}</p>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Payment History</h4>
          {payments.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)]">No payments recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[var(--text-secondary)] border-b border-[var(--border-color)]">
                  <tr>
                    <th className="text-left py-1">Date</th>
                    <th className="text-left py-1">Method</th>
                    <th className="text-right py-1">Amount</th>
                    <th className="text-left py-1">Reference</th>
                    <th className="text-left py-1">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b border-[var(--border-color)]">
                      <td className="py-1 text-[var(--text-secondary)]">{formatDate(p.paymentDate)}</td>
                      <td className="py-1 text-[var(--text-secondary)]">{p.method}</td>
                      <td className="py-1 text-right font-medium text-[var(--text-primary)]">{formatCurrency(p.amount)}</td>
                      <td className="py-1 text-[var(--text-secondary)]">{p.referenceNumber || '—'}</td>
                      <td className="py-1 text-[var(--text-secondary)]">{p.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="pt-2 font-semibold text-[var(--text-primary)]">Total Paid</td>
                    <td className="pt-2 text-right font-semibold text-green-600">{formatCurrency(invoice.amountPaid)}</td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-semibold text-[var(--text-primary)]">Balance Due</td>
                    <td className="text-right font-bold text-red-600">{formatCurrency(invoice.balanceDue)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceViewModal;
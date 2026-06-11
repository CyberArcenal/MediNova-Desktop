// src/renderer/pages/billing/payments/components/PaymentViewModal.tsx
import React from 'react';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import type { PaymentResponseDto } from '../../../../api/core/payments';

interface PaymentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentResponseDto | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const PaymentViewModal: React.FC<PaymentViewModalProps> = ({ isOpen, onClose, payment }) => {
  if (!payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Details"
      size="md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Invoice Number</label>
            <p className="text-[var(--text-primary)]">{payment.invoiceNumber}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Amount</label>
            <p className="text-lg font-bold text-[var(--text-primary)]">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Payment Date</label>
            <p className="text-[var(--text-primary)]">{formatDate(payment.paymentDate)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Method</label>
            <p className="text-[var(--text-primary)]">{payment.method}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Reference Number</label>
            <p className="text-[var(--text-primary)]">{payment.referenceNumber || '—'}</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Notes</label>
            <p className="text-[var(--text-primary)] whitespace-pre-wrap">{payment.notes || '—'}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Created At</label>
            <p className="text-[var(--text-secondary)]">{formatDate(payment.createdAt)}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentViewModal;
// src/renderer/pages/billing/invoices/components/AddPaymentModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import DatePicker from '../../../../components/UI/DatePicker';
import PaymentMethodSelect from '../../../../components/Selects/PaymentMethodSelect';
import paymentsAPI, { type CreatePaymentDto } from '../../../../api/core/payments';
import type { InvoiceResponseDto } from '../../../../api/core/invoices';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoice: InvoiceResponseDto | null;
}

type FormData = {
  amount: number;
  paymentDate: Date;
  method: string;
  referenceNumber: string;
  notes: string;
};

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ isOpen, onClose, onSuccess, invoice }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  useEffect(() => {
    if (isOpen && invoice) {
      reset({
        amount: invoice.balanceDue,
        paymentDate: new Date(),
        method: 'Cash',
        referenceNumber: '',
        notes: '',
      });
    }
  }, [isOpen, invoice, reset]);

  const onSubmit = async (data: FormData) => {
    if (!invoice) return;
    try {
      const payload: CreatePaymentDto = {
        invoiceId: invoice.id,
        amount: data.amount,
        paymentDate: data.paymentDate.toISOString(),
        method: data.method,
        referenceNumber: data.referenceNumber || undefined,
        notes: data.notes || undefined,
      };
      await paymentsAPI.create(payload);
      onSuccess();
    } catch (error) {
      console.error('Failed to add payment', error);
    }
  };

  if (!invoice) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Payment for Invoice ${invoice.invoiceNumber}`}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="paymentForm" loading={isSubmitting}>
            Add Payment
          </Button>
        </div>
      }
    >
      <form id="paymentForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount *</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('amount', { required: 'Amount is required', min: 0.01 })}
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Balance due: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(invoice.balanceDue)}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Payment Date *</label>
          <DatePicker
            selected={watch('paymentDate')}
            onChange={(date) => setValue('paymentDate', date || new Date())}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Payment Method *</label>
          <PaymentMethodSelect
            value={watch('method')}
            onChange={(val) => setValue('method', val)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Reference Number</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('referenceNumber')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Notes</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('notes')}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddPaymentModal;
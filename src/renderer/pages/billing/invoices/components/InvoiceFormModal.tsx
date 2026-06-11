// src/renderer/pages/billing/invoices/components/InvoiceFormModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import ClientSelect from '../../../../components/Selects/ClientSelect';
import DatePicker from '../../../../components/UI/DatePicker';
import invoicesAPI, { type InvoiceResponseDto, type CreateInvoiceDto, type UpdateInvoiceDto } from '../../../../api/core/invoices';
import appointmentsAPI, { type AppointmentResponseDto } from '../../../../api/core/appointments';
import treatmentsAPI from '../../../../api/core/treatments';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: InvoiceResponseDto | null;
}

type FormData = {
  clientId: number;
  appointmentId: number | null;
  issueDate: Date;
  dueDate: Date | null;
  subtotal: number;
  tax: number;
  notes: string;
};

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const isEditing = !!initialData;

  const selectedClientId = watch('clientId');
  const selectedAppointmentId = watch('appointmentId');
  const subtotal = watch('subtotal') || 0;
  const tax = watch('tax') || 0;
  const total = subtotal + tax;

  // Load appointments for selected client
  useEffect(() => {
    if (selectedClientId && !isEditing) {
      setLoadingAppointments(true);
      appointmentsAPI.getByClient(selectedClientId)
        .then(data => setAppointments(data.filter(apt => apt.status === 'Completed')))
        .catch(console.error)
        .finally(() => setLoadingAppointments(false));
    } else {
      setAppointments([]);
    }
  }, [selectedClientId, isEditing]);

  // When appointment selected, fetch treatment price to prefill subtotal
  useEffect(() => {
    if (selectedAppointmentId && !isEditing) {
      const apt = appointments.find(a => a.id === selectedAppointmentId);
      if (apt) {
        treatmentsAPI.getById(apt.treatmentId).then(treatment => {
          setValue('subtotal', treatment.price);
        }).catch(console.error);
      }
    }
  }, [selectedAppointmentId, appointments, setValue, isEditing]);

  useEffect(() => {
    if (initialData) {
      reset({
        clientId: initialData.clientId,
        appointmentId: initialData.appointmentId || null,
        issueDate: new Date(initialData.issueDate),
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
        subtotal: initialData.subtotal,
        tax: initialData.tax,
        notes: initialData.notes || '',
      });
    } else {
      reset({
        clientId: 0,
        appointmentId: null,
        issueDate: new Date(),
        dueDate: null,
        subtotal: 0,
        tax: 0,
        notes: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        clientId: data.clientId,
        appointmentId: data.appointmentId || undefined,
        issueDate: data.issueDate.toISOString(),
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        subtotal: data.subtotal,
        tax: data.tax,
        notes: data.notes || undefined,
      };
      if (isEditing && initialData) {
        await invoicesAPI.update(initialData.id, payload as UpdateInvoiceDto);
      } else {
        await invoicesAPI.create(payload as CreateInvoiceDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save invoice', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Invoice' : 'Create Invoice'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="invoiceForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="invoiceForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client *</label>
          <ClientSelect
            value={watch('clientId') || null}
            onChange={(id) => setValue('clientId', id || 0, { shouldValidate: true })}
            disabled={isEditing}
          />
          {errors.clientId && <p className="text-xs text-red-500 mt-1">Client is required</p>}
        </div>

        {!isEditing && selectedClientId && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Appointment (Optional)</label>
            <select
              value={selectedAppointmentId || ''}
              onChange={(e) => setValue('appointmentId', e.target.value ? Number(e.target.value) : null)}
              disabled={loadingAppointments}
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="">-- Select appointment (optional) --</option>
              {appointments.map(apt => (
                <option key={apt.id} value={apt.id}>
                  {new Date(apt.appointmentDateTime).toLocaleDateString()} - {apt.treatmentName} ({apt.clientName})
                </option>
              ))}
            </select>
            {loadingAppointments && <p className="text-xs text-[var(--text-tertiary)] mt-1">Loading appointments...</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Issue Date *</label>
            <DatePicker
              selected={watch('issueDate')}
              onChange={(date) => setValue('issueDate', date || new Date())}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Due Date (Optional)</label>
            <DatePicker
              selected={watch('dueDate')}
              onChange={(date) => setValue('dueDate', date)}
              placeholderText="Select due date"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subtotal *</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('subtotal', { required: 'Subtotal is required', min: 0 })}
            />
            {errors.subtotal && <p className="text-xs text-red-500 mt-1">{errors.subtotal.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tax</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('tax', { min: 0 })}
            />
          </div>
        </div>

        <div className="bg-[var(--card-secondary-bg)] p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Total:</span>
            <span className="font-bold text-[var(--text-primary)]">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(total)}</span>
          </div>
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

export default InvoiceFormModal;
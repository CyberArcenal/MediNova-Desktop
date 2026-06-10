// src/renderer/pages/appointments/list/components/AppointmentFormModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import ClientSelect from '../../../../components/Selects/ClientSelect';
import TreatmentSelect from '../../../../components/Selects/TreatmentSelect';
import StaffSelect from '../../../../components/Selects/StaffSelect';
import DatePicker from '../../../../components/UI/DatePicker';
import appointmentsAPI, { type AppointmentResponseDto, type CreateAppointmentDto, type UpdateAppointmentDto } from '../../../../api/core/appointments';
import treatmentsAPI, { type TreatmentResponseDto } from '../../../../api/core/treatments';

// Sa AppointmentFormModalProps
interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AppointmentResponseDto | null;
  preselectedDateTime?: Date;  // ← idagdag
}

type FormData = {
  clientId: number;
  treatmentId: number;
  assignedStaff?: string;
  appointmentDateTime: Date;
  notes?: string;
};

const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ isOpen, onClose, onSuccess, initialData, preselectedDateTime }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentResponseDto | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  const isEditing = !!initialData;
  const selectedTreatmentId = watch('treatmentId');

  // Fetch treatment details when treatmentId changes
  useEffect(() => {
    if (selectedTreatmentId) {
      treatmentsAPI.getById(selectedTreatmentId).then(treatment => {
        setSelectedTreatment(treatment);
        setDurationMinutes(treatment.durationMinutes);
      }).catch(console.error);
    } else {
      setSelectedTreatment(null);
      setDurationMinutes(60);
    }
  }, [selectedTreatmentId]);

  useEffect(() => {
    if (initialData) {
      reset({
        clientId: initialData.clientId,
        treatmentId: initialData.treatmentId,
        assignedStaff: initialData.assignedStaff || '',
        appointmentDateTime: new Date(initialData.appointmentDateTime),
        notes: initialData.notes || '',
      });
      if (initialData.treatmentId) {
        treatmentsAPI.getById(initialData.treatmentId).then(t => {
          setSelectedTreatment(t);
          setDurationMinutes(t.durationMinutes);
        }).catch(console.error);
      }
    } else {
      reset({
        clientId: 0,
        treatmentId: 0,
        assignedStaff: '',
        appointmentDateTime: preselectedDateTime || new Date(),
        notes: '',
      });
      setSelectedTreatment(null);
      setDurationMinutes(60);
    }
  }, [initialData, reset, isOpen, preselectedDateTime]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        clientId: data.clientId,
        treatmentId: data.treatmentId,
        assignedStaff: data.assignedStaff || undefined,
        appointmentDateTime: data.appointmentDateTime.toISOString(),
        notes: data.notes || undefined,
      };
      if (isEditing && initialData) {
        const updateData: UpdateAppointmentDto = { ...payload };
        await appointmentsAPI.update(initialData.id, updateData);
      } else {
        await appointmentsAPI.create(payload as CreateAppointmentDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save appointment', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Appointment' : 'Book Appointment'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="appointmentForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="appointmentForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client *</label>
          <ClientSelect
            value={watch('clientId') || null}
            onChange={(id) => setValue('clientId', id || 0, { shouldValidate: true })}
          />
          {errors.clientId && <p className="text-xs text-red-500 mt-1">Client is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Treatment *</label>
          <TreatmentSelect
            value={watch('treatmentId') || null}
            onChange={(id) => setValue('treatmentId', id || 0, { shouldValidate: true })}
          />
          {errors.treatmentId && <p className="text-xs text-red-500 mt-1">Treatment is required</p>}
        </div>

        {selectedTreatment && (
          <div className="text-sm text-[var(--text-tertiary)] -mt-2">
            Duration: {selectedTreatment.durationMinutes} minutes | Price: ₱{selectedTreatment.price}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Assigned Staff (Optional)</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('assignedStaff')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date & Time *</label>
          <DatePicker
            selected={watch('appointmentDateTime')}
            onChange={(date) => setValue('appointmentDateTime', date || new Date(), { shouldValidate: true })}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
          />
          {errors.appointmentDateTime && <p className="text-xs text-red-500 mt-1">Date & Time is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Notes</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('notes')}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentFormModal;
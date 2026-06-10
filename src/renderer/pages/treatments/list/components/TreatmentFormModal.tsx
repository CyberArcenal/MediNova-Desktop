// src/renderer/pages/treatments/list/components/TreatmentFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import CategorySelect from '../../../../components/Selects/CategorySelect';
import treatmentsAPI, { type TreatmentResponseDto, type CreateTreatmentDto, type UpdateTreatmentDto } from '../../../../api/core/treatments';

interface TreatmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: TreatmentResponseDto | null;
}

type FormData = {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  categoryId: number | null;
};

const TreatmentFormModal: React.FC<TreatmentFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        durationMinutes: initialData.durationMinutes,
        price: initialData.price,
        isActive: initialData.isActive,
        categoryId: initialData.categoryId || null,
      });
    } else {
      reset({
        name: '',
        description: '',
        durationMinutes: 60,
        price: 0,
        isActive: true,
        categoryId: null,
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        durationMinutes: data.durationMinutes,
        price: data.price,
        isActive: data.isActive,
        categoryId: data.categoryId || undefined,
      };
      if (isEditing && initialData) {
        await treatmentsAPI.update(initialData.id, payload as UpdateTreatmentDto);
      } else {
        await treatmentsAPI.create(payload as CreateTreatmentDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save treatment', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Treatment' : 'Add New Treatment'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="treatmentForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="treatmentForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name *</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
          <CategorySelect
            value={watch('categoryId')}
            onChange={(id) => setValue('categoryId', id)}
            placeholder="Select category (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Duration (minutes) *</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('durationMinutes', { required: 'Duration is required', min: 1 })}
            />
            {errors.durationMinutes && <p className="text-xs text-red-500 mt-1">{errors.durationMinutes.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('price', { required: 'Price is required', min: 0 })}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('description')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm text-[var(--text-secondary)]">Active (available for booking)</label>
        </div>
      </form>
    </Modal>
  );
};

export default TreatmentFormModal;
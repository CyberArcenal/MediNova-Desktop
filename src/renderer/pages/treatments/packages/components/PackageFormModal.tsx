// src/renderer/pages/treatments/packages/components/PackageFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import TreatmentMultiSelect from '../../../../components/Selects/TreatmentMultiSelect';
import packagesAPI, { type PackageResponseDto, type CreatePackageDto, type UpdatePackageDto } from '../../../../api/core/packages';

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PackageResponseDto | null;
}

type FormData = {
  name: string;
  description: string;
  discountedPrice: number;
  isActive: boolean;
  treatmentIds: number[];
};

const PackageFormModal: React.FC<PackageFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        discountedPrice: initialData.discountedPrice,
        isActive: initialData.isActive,
        treatmentIds: initialData.treatments.map(t => t.treatmentId),
      });
    } else {
      reset({
        name: '',
        description: '',
        discountedPrice: 0,
        isActive: true,
        treatmentIds: [],
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        discountedPrice: data.discountedPrice,
        isActive: data.isActive,
        treatmentIds: data.treatmentIds,
      };
      if (isEditing && initialData) {
        await packagesAPI.update(initialData.id, payload as UpdatePackageDto);
      } else {
        await packagesAPI.create(payload as CreatePackageDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save package', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Package' : 'Add New Package'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="packageForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="packageForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Discounted Price *</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('discountedPrice', { required: 'Discounted price is required', min: 0 })}
          />
          {errors.discountedPrice && <p className="text-xs text-red-500 mt-1">{errors.discountedPrice.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Treatments (Select multiple)</label>
          <TreatmentMultiSelect
            value={watch('treatmentIds') || []}
            onChange={(ids) => setValue('treatmentIds', ids, { shouldValidate: true })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm text-[var(--text-secondary)]">Active (package available for purchase)</label>
        </div>
      </form>
    </Modal>
  );
};

export default PackageFormModal;
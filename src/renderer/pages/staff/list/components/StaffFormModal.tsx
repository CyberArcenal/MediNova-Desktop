// src/renderer/pages/staff/list/components/StaffFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import staffAPI, { type StaffResponseDto, type CreateStaffDto, type UpdateStaffDto } from '../../../../api/core/staff';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: StaffResponseDto | null;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  position: string;
  isActive: boolean;
};

const StaffFormModal: React.FC<StaffFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email || '',
        phone: initialData.phone || '',
        position: initialData.position || '',
        isActive: initialData.isActive,
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        position: '',
        isActive: true,
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        position: data.position || undefined,
        isActive: data.isActive,
      };
      if (isEditing && initialData) {
        await staffAPI.update(initialData.id, payload as UpdateStaffDto);
      } else {
        await staffAPI.create(payload as CreateStaffDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save staff', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="staffForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="staffForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('email', {
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('phone')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Position</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('position')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm text-[var(--text-secondary)]">Active (staff available for appointment assignment)</label>
        </div>
      </form>
    </Modal>
  );
};

export default StaffFormModal;
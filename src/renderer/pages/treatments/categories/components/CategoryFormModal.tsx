// src/renderer/pages/treatments/categories/components/CategoryFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import categoriesAPI, { type CategoryResponseDto, type CreateCategoryDto, type UpdateCategoryDto } from '../../../../api/core/categories';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CategoryResponseDto | null;
}

type FormData = {
  name: string;
  description: string;
  isActive: boolean;
};

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        isActive: initialData.isActive,
      });
    } else {
      reset({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        isActive: data.isActive,
      };
      if (isEditing && initialData) {
        await categoriesAPI.update(initialData.id, payload as UpdateCategoryDto);
      } else {
        await categoriesAPI.create(payload as CreateCategoryDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Add New Category'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="categoryForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="categoryForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm text-[var(--text-secondary)]">Active (category visible in dropdowns)</label>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
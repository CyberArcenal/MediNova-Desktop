// src/renderer/pages/clients/components/ClientFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/UI/Modal';
import Button from '../../../components/UI/Button';
import type { ClientResponseDto, CreateClientDto, UpdateClientDto } from '../../../api/core/clients';
import clientsAPI from '../../../api/core/clients';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ClientResponseDto | null;
}

type FormData = CreateClientDto;

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phoneNumber: initialData.phoneNumber || '',
        dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        skinHistory: initialData.skinHistory || '',
        allergies: initialData.allergies || '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        skinHistory: '',
        allergies: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && initialData) {
        const updateData: UpdateClientDto = { ...data };
        await clientsAPI.update(initialData.id, updateData);
      } else {
        await clientsAPI.create(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save client', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Client' : 'Add New Client'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="clientForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="clientForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">First Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Last Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email *</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('phoneNumber')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('dateOfBirth')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Skin History</label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('skinHistory')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Allergies</label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('allergies')}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
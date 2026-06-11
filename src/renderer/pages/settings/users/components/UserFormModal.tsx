// src/renderer/pages/settings/users/components/UserFormModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../../components/UI/Modal';
import Button from '../../../../components/UI/Button';
import rolesAPI from '../../../../api/core/roles';
import usersAPI, { type UserResponseDto, type CreateUserDto, type UpdateUserDto } from '../../../../api/core/users';
import RoleMultiSelect from './RoleMultiSelect';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UserResponseDto | null;
}

type FormData = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  isActive: boolean;
  roleIds: number[];
};

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const isEditing = !!initialData;
  const [loadingRoles, setLoadingRoles] = useState(false);

  // Fetch current roles when editing to pre-fill
  useEffect(() => {
    const loadUserRoles = async () => {
      if (initialData && isOpen) {
        setLoadingRoles(true);
        try {
          const roleNames = await rolesAPI.getUserRoles(initialData.id);
          // Need to map role names to role IDs. We'll fetch all roles and match names.
          const allRoles = await rolesAPI.getAll();
          const roleIds = allRoles.filter(r => roleNames.includes(r.name)).map(r => r.id);
          setValue('roleIds', roleIds);
        } catch (error) {
          console.error('Failed to load user roles', error);
        } finally {
          setLoadingRoles(false);
        }
      }
    };
    if (isEditing && isOpen) loadUserRoles();
  }, [initialData, isOpen, setValue, isEditing]);

  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username,
        email: initialData.email,
        password: '',
        fullName: initialData.fullName || '',
        isActive: initialData.isActive,
        roleIds: [],
      });
    } else {
      reset({
        username: '',
        email: '',
        password: '',
        fullName: '',
        isActive: true,
        roleIds: [],
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && initialData) {
        // Update basic info
        const updatePayload: UpdateUserDto = {
          username: data.username,
          email: data.email,
          fullName: data.fullName || undefined,
          isActive: data.isActive,
        };
        await usersAPI.update(initialData.id, updatePayload);

        // Sync roles: get current role IDs, diff, assign/remove
        const currentRoleNames = await rolesAPI.getUserRoles(initialData.id);
        const allRoles = await rolesAPI.getAll();
        const currentRoleIds = allRoles.filter(r => currentRoleNames.includes(r.name)).map(r => r.id);
        const newRoleIds = data.roleIds;

        const toAdd = newRoleIds.filter(id => !currentRoleIds.includes(id));
        const toRemove = currentRoleIds.filter(id => !newRoleIds.includes(id));

        for (const roleId of toAdd) {
          await rolesAPI.assignRole(initialData.id, roleId);
        }
        for (const roleId of toRemove) {
          await rolesAPI.removeRole(initialData.id, roleId);
        }
      } else {
        // Create new user
        const createPayload: CreateUserDto = {
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName || undefined,
          isActive: data.isActive,
          roles: [], // We'll assign roles after creation via separate calls
        };
        const newUser = await usersAPI.create(createPayload);
        // Assign selected roles
        for (const roleId of data.roleIds) {
          await rolesAPI.assignRole(newUser.id, roleId);
        }
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save user', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit User' : 'Add New User'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="userForm" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form id="userForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Username *</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email *</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
            })}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password *</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            {...register('fullName')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 rounded border-[var(--input-border)] text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm text-[var(--text-secondary)]">Active (user can log in)</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Roles</label>
          <RoleMultiSelect
            value={watch('roleIds') || []}
            onChange={(ids) => setValue('roleIds', ids)}
            disabled={loadingRoles}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
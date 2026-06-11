// src/renderer/pages/settings/users/hooks/useUserManagement.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usersAPI, { type UserResponseDto, type CreateUserDto, type UpdateUserDto } from '../../../../api/core/users';
import rolesAPI from '../../../../api/core/roles';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const useUserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [editingUser, setEditingUser] = useState<UserResponseDto | null>(null);
  const formModal = useModal();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await usersAPI.getAll(page, pageSize, search);
      setUsers(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-open create modal when route is /settings/users/add
  useEffect(() => {
    if (window.location.pathname === '/settings/users/add') {
      setEditingUser(null);
      formModal.open();
      navigate('/settings/users', { replace: true });
    }
  }, [navigate]);

  const handleDelete = async (id: number, username: string) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await usersAPI.delete(id);
        await fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await usersAPI.activate(id, !currentActive);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user active status', error);
    }
  };

  const handleEdit = (user: UserResponseDto) => {
    setEditingUser(user);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingUser(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingUser(null);
    fetchUsers();
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    users,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    editingUser,
    formModal,
    handleSearch,
    setPage,
    handleEdit,
    handleDelete,
    handleToggleActive,
    handleAddNew,
    handleFormSuccess,
  };
};
// src/renderer/pages/staff/list/hooks/useStaff.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import staffAPI, { type StaffResponseDto } from '../../../../api/core/staff';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const useStaff = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedStaff, setSelectedStaff] = useState<StaffResponseDto | null>(null);
  const viewModal = useModal();
  const formModal = useModal();
  const [editingStaff, setEditingStaff] = useState<StaffResponseDto | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const result = await staffAPI.getAll(page, pageSize, search);
      setStaff(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch staff', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Auto-open create modal when route is /staff/add
  useEffect(() => {
    if (window.location.pathname === '/staff/add') {
      setEditingStaff(null);
      formModal.open();
      navigate('/staff/list', { replace: true });
    }
  }, [navigate]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Staff Member',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await staffAPI.delete(id);
        await fetchStaff();
      } catch (error) {
        console.error('Failed to delete staff', error);
      }
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await staffAPI.toggleActive(id);
      await fetchStaff();
    } catch (error) {
      console.error('Failed to toggle active status', error);
    }
  };

  const handleView = (staffMember: StaffResponseDto) => {
    setSelectedStaff(staffMember);
    viewModal.open();
  };

  const handleEdit = (staffMember: StaffResponseDto) => {
    setEditingStaff(staffMember);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingStaff(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingStaff(null);
    fetchStaff();
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    staff,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedStaff,
    editingStaff,
    viewModal,
    formModal,
    handleSearch,
    setPage,
    handleView,
    handleEdit,
    handleDelete,
    handleToggleActive,
    handleAddNew,
    handleFormSuccess,
  };
};
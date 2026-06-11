// src/renderer/pages/treatments/packages/hooks/usePackages.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import packagesAPI, { type PackageResponseDto } from '../../../../api/core/packages';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const usePackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedPackage, setSelectedPackage] = useState<PackageResponseDto | null>(null);
  const viewModal = useModal();
  const formModal = useModal();
  const [editingPackage, setEditingPackage] = useState<PackageResponseDto | null>(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await packagesAPI.getAll(page, pageSize, search);
      setPackages(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch packages', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Auto-open create modal when route is /packages/add
  useEffect(() => {
    if (window.location.pathname === '/packages/add') {
      setEditingPackage(null);
      formModal.open();
      navigate('/packages', { replace: true });
    }
  }, [navigate]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Package',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await packagesAPI.delete(id);
        await fetchPackages();
      } catch (error) {
        console.error('Failed to delete package', error);
      }
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await packagesAPI.toggleActive(id);
      await fetchPackages();
    } catch (error) {
      console.error('Failed to toggle active status', error);
    }
  };

  const handleView = (pkg: PackageResponseDto) => {
    setSelectedPackage(pkg);
    viewModal.open();
  };

  const handleEdit = (pkg: PackageResponseDto) => {
    setEditingPackage(pkg);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingPackage(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingPackage(null);
    fetchPackages();
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    packages,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedPackage,
    editingPackage,
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
// src/renderer/pages/treatments/categories/hooks/useCategories.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import categoriesAPI, { type CategoryResponseDto } from '../../../../api/core/categories';
import { useModal } from '../../../../hooks/useModal';
import { dialogs } from '../../../../utils/dialogs';

export const useCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState<CategoryResponseDto | null>(null);
  const viewModal = useModal();
  const formModal = useModal();
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await categoriesAPI.getAll(page, pageSize, search);
      setCategories(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Auto-open create modal when route is /treatments/categories/add
  useEffect(() => {
    if (window.location.pathname === '/treatments/categories/add') {
      setEditingCategory(null);
      formModal.open();
      navigate('/treatments/categories', { replace: true });
    }
  }, [navigate]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${name}"? Treatments in this category may become uncategorized.`,
    });
    if (confirmed) {
      try {
        await categoriesAPI.delete(id);
        await fetchCategories();
      } catch (error) {
        console.error('Failed to delete category', error);
      }
    }
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await categoriesAPI.toggleActive(id);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to toggle active status', error);
    }
  };

  const handleView = (category: CategoryResponseDto) => {
    setSelectedCategory(category);
    viewModal.open();
  };

  const handleEdit = (category: CategoryResponseDto) => {
    setEditingCategory(category);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingCategory(null);
    fetchCategories();
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    categories,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedCategory,
    editingCategory,
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
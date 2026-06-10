// src/renderer/pages/clients/hooks/useClients.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clientsAPI, { type ClientResponseDto } from '../../../api/core/clients';
import { useModal } from '../../../hooks/useModal';
import { dialogs } from '../../../utils/dialogs';

export const useClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<ClientResponseDto | null>(null);

  // Modals using useModal hook
  const viewModal = useModal();
  const formModal = useModal();
  const [editingClient, setEditingClient] = useState<ClientResponseDto | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const result = await clientsAPI.getAll(page, pageSize, search);
      setClients(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to fetch clients', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Auto-open create modal when route is /clients/add
  useEffect(() => {
    if (window.location.pathname === '/clients/add') {
      setEditingClient(null);
      formModal.open();
      navigate('/clients/list', { replace: true });
    }
  }, [navigate]);

  const handleDelete = async (id: number, name: string) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Client',
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
    });
    if (confirmed) {
      try {
        await clientsAPI.delete(id);
        await fetchClients();
      } catch (error) {
        console.error('Failed to delete client', error);
      }
    }
  };

  const handleView = (client: ClientResponseDto) => {
    setSelectedClient(client);
    viewModal.open();
  };

  const handleEdit = (client: ClientResponseDto) => {
    setEditingClient(client);
    formModal.open();
  };

  const handleAddNew = () => {
    setEditingClient(null);
    formModal.open();
  };

  const handleFormSuccess = () => {
    formModal.close();
    setEditingClient(null);
    fetchClients();
  };

  const handleSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return {
    // State
    clients,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedClient,
    editingClient,
    // Modal states
    viewModal,
    formModal,
    // Handlers
    handleSearch,
    handlePageChange: setPage,
    handleView,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleFormSuccess,
    handleFormClose: () => {
      formModal.close();
      setEditingClient(null);
    },
    handleViewClose: () => {
      viewModal.close();
      setSelectedClient(null);
    },
  };
};
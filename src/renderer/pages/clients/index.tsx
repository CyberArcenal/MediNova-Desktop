// src/renderer/pages/clients/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/UI/Button';
import SearchInput from '../../components/UI/SearchInput';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { useClients } from './hooks/useClients';
import ClientViewModal from './components/ClientViewModal';
import ClientFormModal from './components/ClientFormModal';
import ClientTable from './components/ClientTable';

const ClientsPage: React.FC = () => {
  const {
    clients,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedClient,
    editingClient,
    viewModal,
    formModal,
    handleSearch,
    handlePageChange,
    handleView,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleFormSuccess,
    handleFormClose,
    handleViewClose,
  } = useClients();

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clients</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage all registered clients</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Add New Client
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by name or email..."
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <ClientTable
            clients={clients}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} client{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Modals */}
      <ClientViewModal
        isOpen={viewModal.isOpen}
        onClose={handleViewClose}
        client={selectedClient}
      />
      <ClientFormModal
        isOpen={formModal.isOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        initialData={editingClient}
      />
    </div>
  );
};

export default ClientsPage;
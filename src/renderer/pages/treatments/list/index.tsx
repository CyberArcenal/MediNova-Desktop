// src/renderer/pages/treatments/list/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import SearchInput from '../../../components/UI/SearchInput';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useTreatments } from './hooks/useTreatments';
import TreatmentTable from './components/TreatmentTable';
import TreatmentViewModal from './components/TreatmentViewModal';
import TreatmentFormModal from './components/TreatmentFormModal';

const TreatmentsListPage: React.FC = () => {
  const {
    treatments,
    loading,
    search,
    page,
    totalPages,
    totalCount,
    selectedTreatment,
    editingTreatment,
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
  } = useTreatments();

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Treatments</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage all treatments and services</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Add Treatment
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by name..."
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <TreatmentTable
            treatments={treatments}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} treatment{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Modals */}
      <TreatmentViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        treatment={selectedTreatment}
      />
      <TreatmentFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingTreatment}
      />
    </div>
  );
};

export default TreatmentsListPage;
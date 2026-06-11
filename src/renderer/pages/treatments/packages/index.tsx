// src/renderer/pages/treatments/packages/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import SearchInput from '../../../components/UI/SearchInput';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { usePackages } from './hooks/usePackages';
import PackageTable from './components/PackageTable';
import PackageViewModal from './components/PackageViewModal';
import PackageFormModal from './components/PackageFormModal';

const PackagesPage: React.FC = () => {
  const {
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
  } = usePackages();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Packages</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage treatment packages</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Add Package
        </Button>
      </div>

      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by name..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <PackageTable
            packages={packages}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} package{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      <PackageViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        package={selectedPackage}
      />
      <PackageFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingPackage}
      />
    </div>
  );
};

export default PackagesPage;
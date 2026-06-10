// src/renderer/pages/treatments/categories/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import SearchInput from '../../../components/UI/SearchInput';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useCategories } from './hooks/useCategories';
import CategoryTable from './components/CategoryTable';
import CategoryViewModal from './components/CategoryViewModal';
import CategoryFormModal from './components/CategoryFormModal';

const CategoriesPage: React.FC = () => {
  const {
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
  } = useCategories();

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Treatment Categories</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage categories for treatments</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Add Category
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
          <CategoryTable
            categories={categories}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} categor{totalCount !== 1 ? 'ies' : 'y'}
          </div>
        </>
      )}

      {/* Modals */}
      <CategoryViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        category={selectedCategory}
      />
      <CategoryFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingCategory}
      />
    </div>
  );
};

export default CategoriesPage;
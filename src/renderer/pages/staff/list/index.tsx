// src/renderer/pages/staff/list/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import SearchInput from '../../../components/UI/SearchInput';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useStaff } from './hooks/useStaff';
import StaffTable from './components/StaffTable';
import StaffViewModal from './components/StaffViewModal';
import StaffFormModal from './components/StaffFormModal';

const StaffListPage: React.FC = () => {
  const {
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
  } = useStaff();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Staff Directory</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage clinic staff members</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Add Staff
        </Button>
      </div>

      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email, or position..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <StaffTable
            staff={staff}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} staff member{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      <StaffViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        staff={selectedStaff}
      />
      <StaffFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingStaff}
      />
    </div>
  );
};

export default StaffListPage;
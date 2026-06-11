// src/renderer/pages/settings/users/index.tsx
import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/UI/Button';
import SearchInput from '../../../components/UI/SearchInput';
import Pagination from '../../../components/UI/Pagination';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useUserManagement } from './hooks/useUserManagement';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';

const UserManagementPage: React.FC = () => {
  const {
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
  } = useUserManagement();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage system users and roles</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleAddNew}>
          Add User
        </Button>
      </div>

      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by username, email, or full name..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <>
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-xs text-[var(--text-tertiary)] text-right">
            Total: {totalCount} user{totalCount !== 1 ? 's' : ''}
          </div>
        </>
      )}

      <UserFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSuccess={handleFormSuccess}
        initialData={editingUser}
      />
    </div>
  );
};

export default UserManagementPage;
// src/renderer/pages/notifications/index.tsx
import React from 'react';
import { CheckCheck } from 'lucide-react';
import Button from '../../components/UI/Button';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { useNotifications } from './hooks/useNotifications';
import NotificationTable from './components/NotificationTable';
import NotificationViewModal from './components/NotificationViewModal';

const NotificationsPage: React.FC = () => {
  const {
    loading,
    notifications,
    totalPages,
    currentPage,
    setCurrentPage,
    filterRead,
    setFilterRead,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    viewModal,
    selectedNotification,
    viewNotification,
    totalCount,
  } = useNotifications();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your notifications</p>
        </div>
        <Button variant="secondary" size="md" icon={CheckCheck} onClick={markAllAsRead}>
          Mark All Read
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterRead('all')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            filterRead === 'all'
              ? 'bg-[var(--primary-color)] text-white'
              : 'bg-[var(--card-secondary-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterRead('unread')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            filterRead === 'unread'
              ? 'bg-[var(--primary-color)] text-white'
              : 'bg-[var(--card-secondary-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilterRead('read')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            filterRead === 'read'
              ? 'bg-[var(--primary-color)] text-white'
              : 'bg-[var(--card-secondary-bg)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]'
          }`}
        >
          Read
        </button>
      </div>

      {/* Table */}
      <NotificationTable
        notifications={notifications}
        onView={viewNotification}
        onMarkRead={markAsRead}
        onDelete={deleteNotification}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
      <div className="text-xs text-[var(--text-tertiary)] text-right">
        Total: {totalCount} notification{totalCount !== 1 ? 's' : ''}
      </div>

      {/* View Modal */}
      <NotificationViewModal
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        notification={selectedNotification}
      />
    </div>
  );
};

export default NotificationsPage;
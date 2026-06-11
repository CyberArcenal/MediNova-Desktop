// src/renderer/pages/notifications/components/NotificationViewModal.tsx
import React from 'react';
import Modal from '../../../components/UI/Modal';
import Button from '../../../components/UI/Button';
import type { NotificationResponseDto } from '../../../api/core/notifications';

interface NotificationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationResponseDto | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const NotificationViewModal: React.FC<NotificationViewModalProps> = ({ isOpen, onClose, notification }) => {
  if (!notification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Details"
      size="md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-tertiary)]">Title</label>
          <p className="text-lg font-semibold text-[var(--text-primary)]">{notification.title}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-tertiary)]">Message</label>
          <p className="text-[var(--text-primary)] whitespace-pre-wrap">{notification.message}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Type</label>
            <p className="text-[var(--text-primary)]">{notification.type}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Channel</label>
            <p className="text-[var(--text-primary)]">{notification.channel}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Status</label>
            <p>{notification.isRead ? <span className="text-green-600">Read</span> : <span className="text-yellow-600">Unread</span>}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)]">Received At</label>
            <p className="text-[var(--text-primary)]">{formatDate(notification.createdAt)}</p>
          </div>
          {notification.readAt && (
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)]">Read At</label>
              <p className="text-[var(--text-primary)]">{formatDate(notification.readAt)}</p>
            </div>
          )}
          {notification.actionUrl && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-[var(--text-tertiary)]">Action URL</label>
              <p className="text-[var(--text-primary)] break-all">{notification.actionUrl}</p>
            </div>
          )}
          {notification.metadata && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-[var(--text-tertiary)]">Metadata</label>
              <p className="text-[var(--text-primary)] whitespace-pre-wrap">{notification.metadata}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationViewModal;
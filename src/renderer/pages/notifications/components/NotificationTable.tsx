// src/renderer/pages/notifications/components/NotificationTable.tsx
import React from 'react';
import { Eye, Check, Trash2 } from 'lucide-react';
import type { NotificationResponseDto } from '../../../api/core/notifications';

interface NotificationTableProps {
  notifications: NotificationResponseDto[];
  onView: (notification: NotificationResponseDto) => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const NotificationTable: React.FC<NotificationTableProps> = ({ notifications, onView, onMarkRead, onDelete }) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-tertiary)] border border-[var(--border-color)] rounded-xl bg-[var(--card-bg)]">
        No notifications found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--card-secondary-bg)] border-b border-[var(--border-color)]">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Title</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Message</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Channel</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Read</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Received At</th>
            <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notif) => (
            <tr key={notif.id} className={`border-b border-[var(--border-color)] hover:bg-[var(--card-hover-bg)] transition-colors ${!notif.isRead ? 'bg-[var(--primary-color)]/5' : ''}`}>
              <td className="py-2.5 px-4 text-[var(--text-primary)] font-medium">{notif.title}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)] max-w-xs truncate">{notif.message}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{notif.type}</td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{notif.channel}</td>
              <td className="py-2.5 px-4 text-center">
                {notif.isRead ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Read</span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Unread</span>
                )}
              </td>
              <td className="py-2.5 px-4 text-[var(--text-secondary)]">{formatDate(notif.createdAt)}</td>
              <td className="py-2.5 px-4">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onView(notif)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  {!notif.isRead && (
                    <button onClick={() => onMarkRead(notif.id)} className="p-1 rounded hover:bg-[var(--card-hover-bg)] text-[var(--text-secondary)] hover:text-[var(--primary-color)]" title="Mark as read">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => onDelete(notif.id)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-500" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;
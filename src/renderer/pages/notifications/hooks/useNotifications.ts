// src/renderer/pages/notifications/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import notificationsAPI, { type NotificationResponseDto } from '../../../api/core/notifications';
import authAPI from '../../../api/core/auth';
import { useModal } from '../../../hooks/useModal';
import { dialogs } from '../../../utils/dialogs';

export const useNotifications = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [filtered, setFiltered] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const viewModal = useModal();
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponseDto | null>(null);

  // Load current user ID
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        setUserId(user.userId);
      } catch (err) {
        console.error('Failed to get current user', err);
      }
    };
    loadUserId();
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await notificationsAPI.getUserNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  // Filter and paginate
  useEffect(() => {
    let filteredData = [...notifications];
    if (filterRead === 'read') filteredData = filteredData.filter(n => n.isRead);
    if (filterRead === 'unread') filteredData = filteredData.filter(n => !n.isRead);
    // Sort by createdAt descending
    filteredData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setFiltered(filteredData);
    setCurrentPage(1);
  }, [notifications, filterRead]);

  const paginatedNotifications = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const markAsRead = async (id: number) => {
    try {
      await notificationsAPI.markAsRead(id);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      await notificationsAPI.markAllAsRead(userId);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const deleteNotification = async (id: number) => {
    const confirmed = await dialogs.confirm({
      title: 'Delete Notification',
      message: 'Are you sure you want to delete this notification?',
    });
    if (confirmed) {
      try {
        await notificationsAPI.delete(id);
        await fetchNotifications();
      } catch (error) {
        console.error('Failed to delete notification', error);
      }
    }
  };

  const viewNotification = (notification: NotificationResponseDto) => {
    setSelectedNotification(notification);
    viewModal.open();
    // Mark as read when viewed
    if (!notification.isRead) markAsRead(notification.id);
  };

  return {
    userId,
    loading,
    notifications: paginatedNotifications,
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
    totalCount: filtered.length,
  };
};
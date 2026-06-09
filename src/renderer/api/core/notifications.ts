// src/renderer/api/core/notifications.ts

import type { PaginatedResult } from "./types";

export interface NotificationResponseDto {
  id: number;
  recipientId: number;
  recipientName: string;
  title: string;
  message: string;
  type: string;
  channel: string;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: string;
}

export interface NotificationTemplateResponseDto {
  id: number;
  name: string;
  subject: string;
  content: string;
  createdAt: string;
}

export interface CreateNotificationTemplateDto {
  name: string;
  subject: string;
  content: string;
}

export type UpdateNotificationTemplateDto = Partial<CreateNotificationTemplateDto>;

export interface NotifyLogResponseDto {
  id: number;
  recipientEmail: string;
  subject: string;
  payload: string;
  type: string;
  status: string;
  errorMessage?: string;
  channel: string;
  messageId?: string;
  durationMs?: number;
  sentAt?: string;
  createdAt: string;
}

export interface NotificationsAPI {
  // Notifications
  getUserNotifications(userId: number, limit?: number): Promise<NotificationResponseDto[]>;
  getById(id: number): Promise<NotificationResponseDto>;
  delete(id: number): Promise<boolean>;
  getUnread(userId: number): Promise<NotificationResponseDto[]>;
  getUnreadCount(userId: number): Promise<number>;
  markAsRead(id: number): Promise<boolean>;
  markAllAsRead(userId: number): Promise<boolean>;

  // Templates
  getTemplates(page?: number, pageSize?: number, search?: string): Promise<PaginatedResult<NotificationTemplateResponseDto>>;
  getTemplateById(id: number): Promise<NotificationTemplateResponseDto>;
  createTemplate(data: CreateNotificationTemplateDto): Promise<NotificationTemplateResponseDto>;
  updateTemplate(id: number, data: UpdateNotificationTemplateDto): Promise<NotificationTemplateResponseDto>;
  deleteTemplate(id: number): Promise<boolean>;

  // Logs
  getLogs(page?: number, pageSize?: number, recipientEmail?: string, status?: string, channel?: string): Promise<PaginatedResult<NotifyLogResponseDto>>;
  getLogById(id: number): Promise<NotifyLogResponseDto>;
  deleteLog(id: number): Promise<boolean>;
  retryLog(id: number): Promise<boolean>;
}

const notificationsAPI: NotificationsAPI = {
  async getUserNotifications(userId, limit = 20) {
    const response = await window.backendAPI.notifications('getUserNotifications', { userId, limit });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.notifications('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.notifications('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getUnread(userId) {
    const response = await window.backendAPI.notifications('getUnread', { userId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getUnreadCount(userId) {
    const response = await window.backendAPI.notifications('getUnreadCount', { userId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async markAsRead(id) {
    const response = await window.backendAPI.notifications('markAsRead', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async markAllAsRead(userId) {
    const response = await window.backendAPI.notifications('markAllAsRead', { userId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getTemplates(page = 1, pageSize = 10, search = '') {
    const response = await window.backendAPI.notifications('getTemplates', { page, pageSize, search });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getTemplateById(id) {
    const response = await window.backendAPI.notifications('getTemplateById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async createTemplate(data) {
    const response = await window.backendAPI.notifications('createTemplate', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async updateTemplate(id, data) {
    const response = await window.backendAPI.notifications('updateTemplate', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async deleteTemplate(id) {
    const response = await window.backendAPI.notifications('deleteTemplate', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getLogs(page = 1, pageSize = 10, recipientEmail, status, channel) {
    const response = await window.backendAPI.notifications('getLogs', { page, pageSize, recipientEmail, status, channel });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getLogById(id) {
    const response = await window.backendAPI.notifications('getLogById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async deleteLog(id) {
    const response = await window.backendAPI.notifications('deleteLog', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async retryLog(id) {
    const response = await window.backendAPI.notifications('retryLog', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default notificationsAPI;
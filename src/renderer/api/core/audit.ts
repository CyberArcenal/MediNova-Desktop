// src/renderer/api/core/audit.ts

export interface AuditLogDto {
  id: number;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  userId?: number;
  action: string;
  entityType: string;
  entityId?: number;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditAPI {
  getAll(page?: number, pageSize?: number): Promise<AuditLogDto[]>;
  getByEntity(entityType: string, entityId: number): Promise<AuditLogDto[]>;
  getByUser(userId: number): Promise<AuditLogDto[]>;
}

const auditAPI: AuditAPI = {
  async getAll(page = 1, pageSize = 50) {
    const response = await window.backendAPI.audit('getAll', { page, pageSize });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByEntity(entityType, entityId) {
    const response = await window.backendAPI.audit('getByEntity', { entityType, entityId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByUser(userId) {
    const response = await window.backendAPI.audit('getByUser', { userId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default auditAPI;
// src/renderer/api/core/roles.ts

export interface RoleResponseDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export type UpdateRoleDto = Partial<CreateRoleDto>;

export interface AssignRoleDto {
  userId: number;
  roleId: number;
}

export interface RolesAPI {
  getAll(): Promise<RoleResponseDto[]>;
  getById(id: number): Promise<RoleResponseDto>;
  create(data: CreateRoleDto): Promise<RoleResponseDto>;
  update(id: number, data: UpdateRoleDto): Promise<RoleResponseDto>;
  delete(id: number): Promise<boolean>;
  assignRole(userId: number, roleId: number): Promise<boolean>;
  removeRole(userId: number, roleId: number): Promise<boolean>;
  getUserRoles(userId: number): Promise<string[]>;
}

const rolesAPI: RolesAPI = {
  async getAll() {
    const response = await window.backendAPI.roles('getAll', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.roles('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.roles('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.roles('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.roles('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async assignRole(userId, roleId) {
    const response = await window.backendAPI.roles('assignRole', { userId, roleId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async removeRole(userId, roleId) {
    const response = await window.backendAPI.roles('removeRole', { userId, roleId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getUserRoles(userId) {
    const response = await window.backendAPI.roles('getUserRoles', { userId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default rolesAPI;
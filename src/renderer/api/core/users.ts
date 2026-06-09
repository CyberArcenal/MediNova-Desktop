// src/renderer/api/core/users.ts

import type { PaginatedResult } from "./types";

export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles: string[];
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  isActive?: boolean;
  roles?: string[];
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'password'>> & {
  rolesToAdd?: string[];
  rolesToRemove?: string[];
};

export interface UsersAPI {
  getAll(page?: number, pageSize?: number, search?: string): Promise<PaginatedResult<UserResponseDto>>;
  getById(id: number): Promise<UserResponseDto>;
  create(data: CreateUserDto): Promise<UserResponseDto>;
  update(id: number, data: UpdateUserDto): Promise<UserResponseDto>;
  delete(id: number): Promise<boolean>;
  activate(id: number, isActive?: boolean): Promise<boolean>;
}

const usersAPI: UsersAPI = {
  async getAll(page = 1, pageSize = 10, search = '') {
    const response = await window.backendAPI.users('getAll', { page, pageSize, search });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.users('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.users('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.users('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.users('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async activate(id, isActive = true) {
    const response = await window.backendAPI.users('activate', { id, isActive });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default usersAPI;
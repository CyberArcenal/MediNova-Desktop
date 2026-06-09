// src/renderer/api/core/staff.ts

import type { PaginatedResult } from "./types";

export interface StaffResponseDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffDto {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  isActive?: boolean;
}

export type UpdateStaffDto = Partial<CreateStaffDto>;

export interface StaffAPI {
  getAll(page?: number, pageSize?: number, search?: string): Promise<PaginatedResult<StaffResponseDto>>;
  getById(id: number): Promise<StaffResponseDto>;
  create(data: CreateStaffDto): Promise<StaffResponseDto>;
  update(id: number, data: UpdateStaffDto): Promise<StaffResponseDto>;
  delete(id: number): Promise<boolean>;
  toggleActive(id: number): Promise<boolean>;
  getActive(): Promise<StaffResponseDto[]>;
  getByPosition(position: string): Promise<StaffResponseDto[]>;
}

const staffAPI: StaffAPI = {
  async getAll(page = 1, pageSize = 10, search = '') {
    const response = await window.backendAPI.staff('getAll', { page, pageSize, search });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.staff('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.staff('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.staff('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.staff('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async toggleActive(id) {
    const response = await window.backendAPI.staff('toggleActive', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getActive() {
    const response = await window.backendAPI.staff('getActive', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByPosition(position) {
    const response = await window.backendAPI.staff('getByPosition', { position });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default staffAPI;
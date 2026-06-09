// src/renderer/api/core/treatments.ts

import type { PaginatedResult } from "./types";

export interface TreatmentResponseDto {
  id: number;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  categoryId?: number;
  categoryName?: string;
}

export interface CreateTreatmentDto {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive?: boolean;
  categoryId?: number;
}

export type UpdateTreatmentDto = Partial<CreateTreatmentDto>;

export interface TreatmentsAPI {
  getAll(page?: number, pageSize?: number, search?: string): Promise<PaginatedResult<TreatmentResponseDto>>;
  getById(id: number): Promise<TreatmentResponseDto>;
  create(data: CreateTreatmentDto): Promise<TreatmentResponseDto>;
  update(id: number, data: UpdateTreatmentDto): Promise<TreatmentResponseDto>;
  delete(id: number): Promise<boolean>;
  toggleActive(id: number): Promise<boolean>;
  getActive(): Promise<TreatmentResponseDto[]>;
  getByCategory(category: string): Promise<TreatmentResponseDto[]>;
}

const treatmentsAPI: TreatmentsAPI = {
  async getAll(page = 1, pageSize = 10, search = '') {
    const response = await window.backendAPI.treatments('getAll', { page, pageSize, search });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.treatments('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.treatments('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.treatments('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.treatments('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async toggleActive(id) {
    const response = await window.backendAPI.treatments('toggleActive', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getActive() {
    const response = await window.backendAPI.treatments('getActive', {});
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByCategory(category) {
    const response = await window.backendAPI.treatments('getByCategory', { category });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default treatmentsAPI;
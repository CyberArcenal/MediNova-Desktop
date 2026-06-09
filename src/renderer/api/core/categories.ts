// src/renderer/api/core/categories.ts

import type { PaginatedResult } from "./types";

export interface CategoryResponseDto {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  treatmentCount: number;
}

export interface CreateCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface CategoriesAPI {
  getAll(page?: number, pageSize?: number, search?: string): Promise<PaginatedResult<CategoryResponseDto>>;
  getById(id: number): Promise<CategoryResponseDto>;
  create(data: CreateCategoryDto): Promise<CategoryResponseDto>;
  update(id: number, data: UpdateCategoryDto): Promise<CategoryResponseDto>;
  delete(id: number): Promise<boolean>;
  toggleActive(id: number): Promise<boolean>;
}

const categoriesAPI: CategoriesAPI = {
  async getAll(page = 1, pageSize = 10, search = '') {
    const response = await window.backendAPI.categories('getAll', { page, pageSize, search });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.categories('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.categories('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.categories('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.categories('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async toggleActive(id) {
    const response = await window.backendAPI.categories('toggleActive', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default categoriesAPI;
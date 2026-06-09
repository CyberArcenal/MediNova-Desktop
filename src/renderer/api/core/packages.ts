// src/renderer/api/core/packages.ts

import type { PaginatedResult } from "./types";

export interface PackageTreatmentDto {
  treatmentId: number;
  treatmentName: string;
  treatmentPrice: number;
}

export interface PackageResponseDto {
  id: number;
  name: string;
  description?: string;
  discountedPrice: number;
  isActive: boolean;
  createdAt: string;
  treatments: PackageTreatmentDto[];
  totalPrice: number;
  savings: number;
}

export interface CreatePackageDto {
  name?: string;
  description?: string;
  discountedPrice?: number;
  isActive?: boolean;
  treatmentIds?: number[];
}

export type UpdatePackageDto = Partial<CreatePackageDto>;

export interface PackagesAPI {
  getAll(page?: number, pageSize?: number, search?: string): Promise<PaginatedResult<PackageResponseDto>>;
  getById(id: number): Promise<PackageResponseDto>;
  create(data: CreatePackageDto): Promise<PackageResponseDto>;
  update(id: number, data: UpdatePackageDto): Promise<PackageResponseDto>;
  delete(id: number): Promise<boolean>;
  toggleActive(id: number): Promise<boolean>;
}

const packagesAPI: PackagesAPI = {
  async getAll(page = 1, pageSize = 10, search = '') {
    const response = await window.backendAPI.packages('getAll', { page, pageSize, search });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.packages('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.packages('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.packages('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.packages('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async toggleActive(id) {
    const response = await window.backendAPI.packages('toggleActive', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default packagesAPI;
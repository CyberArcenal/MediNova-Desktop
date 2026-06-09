// src/renderer/api/core/clients.ts

import type { PaginatedResult } from "./types";

export interface ClientResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  skinHistory?: string;
  allergies?: string;
  createdAt: string;
}

export interface CreateClientDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  skinHistory?: string;
  allergies?: string;
}

export interface MonthlyTrendDto {
  month: string;
  newClients: number;
  activeClients: number;
  revenue: number;
}

export interface RetentionDataDto {
  cohorts: CohortRetentionDto[];
  overallRetentionRate: number;
}

export interface CohortRetentionDto {
  cohortMonth: string;
  totalClients: number;
  retentionRate1Month: number;
  retentionRate3Month: number;
  retentionRate6Month: number;
}

export type UpdateClientDto = Partial<CreateClientDto>;

export interface TopClientDto {
  clientId: number;
  clientName: string;
  email: string;
  totalSpent: number;
  appointmentCount: number;
  lastVisit: string;
}
export interface ClientAnalyticsDto {
  kpis: {
    totalClients: number;
    activeClients: number;
    newClientsThisMonth: number;
    newClientsLastMonth: number;
    newClientsGrowth: number;
    averageLifetimeValue: number;
    retentionRate: number;
  };
  topClientsByRevenue: TopClientDto[];
  topClientsByAppointments: TopClientDto[];
  monthlyTrends: MonthlyTrendDto[];
  retentionData: RetentionDataDto;
}

export interface ClientsAPI {
  getAll(
    page?: number,
    pageSize?: number,
    search?: string,
  ): Promise<PaginatedResult<ClientResponseDto>>;
  getById(id: number): Promise<ClientResponseDto>;
  create(data: CreateClientDto): Promise<ClientResponseDto>;
  update(id: number, data: UpdateClientDto): Promise<ClientResponseDto>;
  delete(id: number): Promise<boolean>;
  analytics(months?: number): Promise<ClientAnalyticsDto>;
}

const clientsAPI: ClientsAPI = {
  async getAll(page = 1, pageSize = 10, search = "") {
    const response = await window.backendAPI.clients("getAll", {
      page,
      pageSize,
      search,
    });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.clients("getById", { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.clients("create", { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.clients("update", { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.clients("delete", { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async analytics(months = 12) {
    const response = await window.backendAPI.clients("analytics", { months });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default clientsAPI;

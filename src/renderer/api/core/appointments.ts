// src/renderer/api/core/appointments.ts

import type { PaginatedResult } from "./types";

export interface AppointmentResponseDto {
  id: number;
  clientId: number;
  clientName: string;
  treatmentId: number;
  treatmentName: string;
  assignedStaff?: string;
  appointmentDateTime: string;
  durationMinutes: number;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface CreateAppointmentDto {
  clientId: number;
  treatmentId: number;
  assignedStaff?: string;
  appointmentDateTime: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  clientId?: number;
  treatmentId?: number;
  assignedStaff?: string;
  appointmentDateTime?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusDto {
  status: string;
}

export interface AppointmentListParams {
  page?: number;
  pageSize?: number;
  clientId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AppointmentsAPI {
  getAll(params?: AppointmentListParams): Promise<PaginatedResult<AppointmentResponseDto>>;
  getById(id: number): Promise<AppointmentResponseDto>;
  create(data: CreateAppointmentDto): Promise<AppointmentResponseDto>;
  update(id: number, data: UpdateAppointmentDto): Promise<AppointmentResponseDto>;
  delete(id: number): Promise<boolean>;
  updateStatus(id: number, status: string): Promise<boolean>;
  getByClient(clientId: number): Promise<AppointmentResponseDto[]>;
  getByDateRange(start: string, end: string): Promise<AppointmentResponseDto[]>;
}

const appointmentsAPI: AppointmentsAPI = {
  async getAll(params = {}) {
    const response = await window.backendAPI.appointments('getAll', params);
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.appointments('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.appointments('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.appointments('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.appointments('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await window.backendAPI.appointments('updateStatus', { id, status });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByClient(clientId) {
    const response = await window.backendAPI.appointments('getByClient', { clientId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByDateRange(start, end) {
    const response = await window.backendAPI.appointments('getByDateRange', { start, end });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default appointmentsAPI;
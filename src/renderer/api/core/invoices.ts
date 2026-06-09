// src/renderer/api/core/invoices.ts

import type { PaginatedResult } from "./types";

export interface InvoiceResponseDto {
  id: number;
  clientId: number;
  clientName: string;
  appointmentId?: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  notes?: string;
  createdAt: string;
  amountPaid: number;
  balanceDue: number;
}

export interface CreateInvoiceDto {
  clientId: number;
  appointmentId?: number;
  issueDate: string;
  dueDate?: string;
  subtotal: number;
  tax?: number;
  notes?: string;
}

export type UpdateInvoiceDto = Partial<CreateInvoiceDto>;

export interface UpdateInvoiceStatusDto {
  status: string;
}

export interface InvoicesAPI {
  getAll(page?: number, pageSize?: number, clientId?: number, status?: string): Promise<PaginatedResult<InvoiceResponseDto>>;
  getById(id: number): Promise<InvoiceResponseDto>;
  create(data: CreateInvoiceDto): Promise<InvoiceResponseDto>;
  update(id: number, data: UpdateInvoiceDto): Promise<InvoiceResponseDto>;
  delete(id: number): Promise<boolean>;
  updateStatus(id: number, status: string): Promise<boolean>;
  getByClient(clientId: number): Promise<InvoiceResponseDto[]>;
}

const invoicesAPI: InvoicesAPI = {
  async getAll(page = 1, pageSize = 10, clientId, status) {
    const response = await window.backendAPI.invoices('getAll', { page, pageSize, clientId, status });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.invoices('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.invoices('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async update(id, data) {
    const response = await window.backendAPI.invoices('update', { id, data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.invoices('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await window.backendAPI.invoices('updateStatus', { id, status });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByClient(clientId) {
    const response = await window.backendAPI.invoices('getByClient', { clientId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default invoicesAPI;
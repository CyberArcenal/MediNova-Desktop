// src/renderer/api/core/payments.ts

import type { PaginatedResult } from "./types";

export interface PaymentResponseDto {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  method: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePaymentDto {
  invoiceId: number;
  amount: number;
  paymentDate: string;
  method: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentsAPI {
  getAll(page?: number, pageSize?: number, invoiceId?: number, method?: string): Promise<PaginatedResult<PaymentResponseDto>>;
  getById(id: number): Promise<PaymentResponseDto>;
  create(data: CreatePaymentDto): Promise<PaymentResponseDto>;
  delete(id: number): Promise<boolean>;
  getByInvoice(invoiceId: number): Promise<PaymentResponseDto[]>;
}

const paymentsAPI: PaymentsAPI = {
  async getAll(page = 1, pageSize = 10, invoiceId, method) {
    const response = await window.backendAPI.payments('getAll', { page, pageSize, invoiceId, method });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.payments('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async create(data) {
    const response = await window.backendAPI.payments('create', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.payments('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getByInvoice(invoiceId) {
    const response = await window.backendAPI.payments('getByInvoice', { invoiceId });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default paymentsAPI;
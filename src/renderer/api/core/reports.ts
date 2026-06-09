// src/renderer/api/core/reports.ts

import type { PaginatedResult } from "./types";

export interface ReportLogResponseDto {
  id: number;
  reportName: string;
  parameters?: string;
  generatedById?: number;
  generatedByName?: string;
  insights?: string;
  generatedAt: string;
  createdAt: string;
}

export interface GenerateReportDto {
  reportName: string;
  parameters?: string;
}

export interface RevenueReportDto {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  dailyBreakdown: Array<{ date: string; revenue: number; appointmentCount: number }>;
  byTreatment: Array<{ treatmentId: number; treatmentName: string; count: number; revenue: number; percentage: number }>;
  byCategory: Array<{ categoryId?: number; categoryName?: string; revenue: number; appointmentCount: number; percentage: number }>;
  byStaff: Array<{ staffId?: number; staffName?: string; appointmentCount: number; revenue: number; percentage: number }>;
  byPaymentMethod: Array<{ method: string; amount: number; count: number; percentage: number }>;
}

export interface ReportsAPI {
  getAll(page?: number, pageSize?: number, reportName?: string, fromDate?: string, toDate?: string): Promise<PaginatedResult<ReportLogResponseDto>>;
  getById(id: number): Promise<ReportLogResponseDto>;
  delete(id: number): Promise<boolean>;
  generate(data: GenerateReportDto): Promise<ReportLogResponseDto>;
  triggerWeeklyReport(): Promise<void>;
  getRevenueReport(startDate?: string, endDate?: string): Promise<RevenueReportDto>;
}

const reportsAPI: ReportsAPI = {
  async getAll(page = 1, pageSize = 10, reportName, fromDate, toDate) {
    const response = await window.backendAPI.reports('getAll', { page, pageSize, reportName, fromDate, toDate });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async getById(id) {
    const response = await window.backendAPI.reports('getById', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async delete(id) {
    const response = await window.backendAPI.reports('delete', { id });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async generate(data) {
    const response = await window.backendAPI.reports('generate', { data });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },

  async triggerWeeklyReport() {
    const response = await window.backendAPI.reports('triggerWeekly', {});
    if (!response.status) throw new Error(response.message);
  },

  async getRevenueReport(startDate, endDate) {
    const response = await window.backendAPI.reports('getRevenue', { startDate, endDate });
    if (!response.status) throw new Error(response.message);
    return response.data;
  },
};

export default reportsAPI;
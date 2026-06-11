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

// Revenue report related DTOs
export interface RevenueDailyDto {
  date: string;
  revenue: number;
  appointmentCount: number;
}

export interface RevenueByTreatmentDto {
  treatmentId: number;
  treatmentName: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface RevenueByCategoryDto {
  categoryId?: number;
  categoryName?: string;
  revenue: number;
  appointmentCount: number;
  percentage: number;
}

export interface RevenueByStaffDto {
  staffId?: number;
  staffName?: string;
  appointmentCount: number;
  revenue: number;
  percentage: number;
}

export interface RevenueByPaymentMethodDto {
  method: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface RevenueReportDto {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  dailyBreakdown: RevenueDailyDto[];
  byTreatment: RevenueByTreatmentDto[];
  byCategory: RevenueByCategoryDto[];
  byStaff: RevenueByStaffDto[];
  byPaymentMethod: RevenueByPaymentMethodDto[];
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
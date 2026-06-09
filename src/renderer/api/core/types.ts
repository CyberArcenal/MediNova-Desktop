// src/renderer/api/core/types.ts (shared)
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface BaseResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
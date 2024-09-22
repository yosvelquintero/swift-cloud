export interface IPaginationResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IPagination {
  limit: number;
  field: string;
}

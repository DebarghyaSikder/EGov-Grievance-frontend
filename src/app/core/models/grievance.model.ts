export interface Grievance {
  id: number;
  grievanceNumber: string;
  citizenId: number;
  departmentId: number;
  departmentName: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  title: string;
  description: string;
  status: GrievanceStatus;
  priority: string;
  slaHours: number;
  slaDeadline: string;
  assignedOfficerId: number;
  assignedAt: string;
  resolvedAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum GrievanceStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED'
}

export interface CreateGrievanceRequest {
  departmentId: number;
  departmentName: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  slaHours: number;
  title: string;
  description: string;
}

export interface UpdateStatusRequest {
  status: string;
  remarks: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  departmentId: number;
  name: string;
  description: string;
}

export interface SubCategory {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  slaHours: number;
}

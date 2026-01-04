export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  role: UserRole;
  createdAt?: string;
}

export enum UserRole {
  CITIZEN = 'CITIZEN',
  DEPARTMENT_OFFICER = 'DEPARTMENT_OFFICER',
  SUPERVISORY_OFFICER = 'SUPERVISORY_OFFICER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  aadhaarNumber: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    userId: number;
    email: string;
    fullName: string;
    role: UserRole;
  };
  timestamp: string;
}

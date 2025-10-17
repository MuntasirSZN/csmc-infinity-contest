export type Category = "Primary" | "Junior" | "Senior";
export type Grade = 5 | 6 | 7 | 8 | 9 | 10;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code: string;
  details?: ValidationDetail[];
  existingUsername?: string;
}

export interface ValidationDetail {
  field: string;
  issue: string;
}

export interface RegistrationResponse {
  username: string;
  category: Category;
  fullName: string;
  mobile: string;
  email: string;
  grade: Grade;
  schoolName: string;
  registeredAt: string;
}

export type RegistrationApiResponse = ApiResponse<RegistrationResponse>;

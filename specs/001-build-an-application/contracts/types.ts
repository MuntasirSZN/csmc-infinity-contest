# TypeScript Type Definitions

## Shared Types

```typescript
export type Category = 'Primary' | 'Junior' | 'Senior';
export type Grade = 6 | 7 | 8 | 9 | 10;

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
```

## Registration API Types

```typescript
export interface RegistrationRequest {
  fullName: string;
  mobile: string;
  email: string;
  grade: Grade;
  schoolName: string;
  deviceFingerprint: string;
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
```

## Check Returning Visitor API Types

```typescript
export interface CheckReturningVisitorRequest {
  deviceFingerprint: string;
}

export interface ReturningVisitorData {
  username: string;
  category: Category;
  fullName: string;
  grade: Grade;
  schoolName: string;
  registeredAt: string;
}

export interface CheckReturningVisitorResponse {
  isReturning: boolean;
  registration?: ReturningVisitorData;
}

export type CheckReturningVisitorApiResponse = CheckReturningVisitorResponse | ApiResponse<never>;
```

## Validation Schemas (Zod)

```typescript

import { z } from 'zod';

export const gradeSchema = z.union([
	z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
]);

export const registrationRequestSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  mobile: z.string().regex(/^01\d{9}$/, 'Invalid Bangladeshi mobile number'),
  email: z.string().email().toLowerCase(),
  grade: gradeSchema,
  schoolName: z.string().min(2).max(200).trim(),
  deviceFingerprint: z.string().min(1).max(255),
});

export const checkReturningVisitorRequestSchema = z.object({
  deviceFingerprint: z.string().min(1).max(255),
});
```

## Database Model Types

```typescript
export interface Contestant {
  id: number;
  username: string;
  category: Category;
  fullName: string;
  mobile: string;
  email: string;
  grade: Grade;
  schoolName: string;
  registeredAt: Date;
  updatedAt: Date;
}

export interface UsernameSequence {
  id: number;
  category: Category;
  currentSequence: number;
}

export interface DeviceRegistration {
  id: number;
  contestantId: number;
  deviceFingerprint: string;
  registeredAt: Date;
}
```

## Helper Functions

```typescript
export function deriveCategory(grade: Grade): Category {
  if (grade >= 6 && grade <= 8) return 'Primary';
  if (grade >= 9 && grade <= 10) return 'Junior';
  return 'Senior';
}

export function formatUsername(category: Category, sequence: number): string {
  const prefix = category === 'Primary' ? 'P' : category === 'Junior' ? 'J' : 'S';
  return `CSMC_${prefix}_${sequence.toString().padStart(4, '0')}`;
}

export function parseUsername(username: string): { category: Category; sequence: number } | null {
  const match = username.match(/^CSMC_([PJS])_(\d{4})$/);
  if (!match) return null;

  const categoryMap = { P: 'Primary', J: 'Junior', S: 'Senior' } as const;
  const category = categoryMap[match[1] as 'P' | 'J' | 'S'];
  const sequence = parseInt(match[2], 10);

  return { category, sequence };
}
```

## Client-Side Types

```typescript
export interface LocalStorageRegistrationData {
  username: string;
  category: Category;
  fullName: string;
  grade: Grade;
  schoolName: string;
  registeredAt: string;
  deviceFingerprint: string;
}

export interface FormState {
  loading: boolean;
  error: ApiError | null;
  success: boolean;
  registrationData: RegistrationResponse | null;
}
```

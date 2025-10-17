# API Contract: Registration

## POST `/api/registration`

Submit a new contestant registration.

### Request Body

```typescript
{
	fullName: string; // 2-100 characters
	mobile: string; // Bangladeshi format: 01XXXXXXXXX (11 digits)
	email: string; // Valid email format
	grade: 6 | 7 | 8 | 9 | 10;
	schoolName: string; // 2-200 characters
	deviceFingerprint: string; // Client-generated device identifier
}
```

### Response: Success (201 Created)

```typescript
{
	success: true;
	data: {
		username: string; // Format: CSMC_{P|J|S}_{0001-9999}
		category: "Primary" | "Junior" | "Senior";
		fullName: string;
		mobile: string;
		email: string;
		grade: number;
		schoolName: string;
		registeredAt: string; // ISO 8601 timestamp
	}
}
```

### Response: Error (400 Bad Request)

```typescript
{
  success: false;
  error: {
    message: string;
    code: 'VALIDATION_ERROR' | 'DUPLICATE_MOBILE' | 'DUPLICATE_EMAIL' | 'USERNAME_GENERATION_FAILED';
    details?: {
      field: string;
      issue: string;
    }[];
  };
}
```

### Response: Error (409 Conflict)

```typescript
{
  success: false;
  error: {
    message: string;
    code: 'DUPLICATE_MOBILE' | 'DUPLICATE_EMAIL';
    existingUsername?: string;  // Provided if user already registered
  };
}
```

### Response: Error (500 Internal Server Error)

```typescript
{
	success: false;
	error: {
		message: string;
		code: "DATABASE_ERROR" | "UNKNOWN_ERROR";
	}
}
```

### Validation Rules

- **fullName**: 2-100 characters, no leading/trailing whitespace
- **mobile**: Exactly 11 digits, starts with `01`, Bangladeshi format
- **email**: Valid email format, lowercase normalized
- **grade**: Integer between 6-12 inclusive
- **schoolName**: 2-200 characters, no leading/trailing whitespace
- **deviceFingerprint**: Non-empty string, max 255 characters

### Business Logic

1. Validate all fields using Zod schema
1. Check for existing mobile/email (return 409 if duplicate)
1. Derive category from grade:
   - Primary: grades 5-6
   - Junior: grades 7-8
   - Senior: grades 9-10
1. Generate username atomically using database transaction
1. Store device fingerprint for returning visitor detection
1. Return complete registration data

### Rate Limiting

- **None** - Form submission is gated by client-side validation and user interaction

### Performance Targets

- **p50**: \<300ms
- **p95**: \<500ms
- **p99**: \<800ms

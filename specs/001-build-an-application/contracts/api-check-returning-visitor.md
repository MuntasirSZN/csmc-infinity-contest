# API Contract: Check Returning Visitor

## POST `/api/registration/check`

Check if a device has previously registered.

### Request Body

```typescript
{
	deviceFingerprint: string; // Client-generated device identifier
}
```

### Response: Success - Returning Visitor (200 OK)

```typescript
{
	isReturning: true;
	registration: {
		username: string;
		category: "Primary" | "Junior" | "Senior";
		fullName: string;
		grade: number;
		schoolName: string;
		registeredAt: string; // ISO 8601 timestamp
	}
}
```

### Response: Success - New Visitor (200 OK)

```typescript
{
	isReturning: false;
}
```

### Response: Error (400 Bad Request)

```typescript
{
	success: false;
	error: {
		message: string;
		code: "VALIDATION_ERROR";
	}
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

- **deviceFingerprint**: Non-empty string, max 255 characters

### Business Logic

1. Validate deviceFingerprint
2. Query `device_registrations` table for matching fingerprint
3. If found, join with `contestants` table to retrieve registration details
4. Return appropriate response based on whether registration exists
5. **Privacy**: Do not expose mobile/email in response

### Dual-Layer Detection Strategy

This API works in conjunction with client-side localStorage:

1. **Client checks localStorage** first (`csmc_registration_data`)
2. **If localStorage empty**, call this API with device fingerprint
3. **Server checks device_registrations** table
4. **Result**: Combined coverage handles cleared localStorage and cross-browser scenarios

### Performance Targets

- **p50**: <100ms
- **p95**: <200ms
- **p99**: <300ms

### Rate Limiting

- **None** - Single check per page load, no abuse vector

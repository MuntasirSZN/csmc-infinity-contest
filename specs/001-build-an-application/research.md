# Research & Technical Decisions

**Feature**: CSMC Infinity Contest Registration System\
**Date**: 2025-10-15\
**Status**: Complete

## Overview

This document captures technical research and decisions for implementing the registration system. All NEEDS CLARIFICATION items from Technical Context have been resolved.

## 1. Database Schema Design

### Decision: Fully Normalized Schema with Turso (libSQL)

**Chosen Approach**: Three-table normalized design

- `contestants` table: Core registration data
- `username_sequences` table: Per-category counter for username generation
- `device_registrations` table: Device tracking for returning visitors

**Rationale**:

- Full normalization prevents data anomalies and ensures referential integrity
- Separate `username_sequences` table enables atomic counter increments with database-level locks
- Device tracking table allows querying registration status from server (complementing localStorage)
- Turso provides SQLite compatibility with edge replication for low-latency reads

**Alternatives Considered**:

- **Single table with embedded JSON**: Rejected due to poor queryability and lack of relational integrity
- **Denormalized with username counter in contestants**: Rejected due to race condition risks on concurrent inserts
- **Redis/KV for counters**: Rejected to minimize infrastructure complexity; Turso transactions sufficient for expected load

**Implementation Details**:

```
contestants:
  - id (primary key, auto-increment)
  - name (text, not null)
  - institute (text, not null)
  - class (integer 5-10, not null)
  - section (text, not null)
  - roll (integer, not null)
  - email (text unique, not null)
  - mobile (text unique, not null)
  - father_name (text, not null)
  - mother_name (text, not null)
  - category (text enum: Primary|Junior|Senior, not null)
  - username (text unique, not null)
  - created_at (timestamp, default now)
  - updated_at (timestamp, default now)

username_sequences:
  - category (text primary key: P|J|S)
  - current_number (integer, default 0)
  - updated_at (timestamp, default now)

device_registrations:
  - id (primary key, auto-increment)
  - device_fingerprint (text unique, not null)
  - contestant_id (foreign key -> contestants.id)
  - created_at (timestamp, default now)
```

**Indexes**:

- `contestants.email` (unique)
- `contestants.mobile` (unique)
- `contestants.username` (unique)
- `device_registrations.device_fingerprint` (unique)

**Constraints**:

- Check constraint: `class BETWEEN 5 AND 10`
- Check constraint: `category IN ('Primary', 'Junior', 'Senior')`
- Check constraint: `mobile LIKE '01%' AND LENGTH(mobile) = 11`

______________________________________________________________________

## 2. Username Generation Strategy

### Decision: Database Transaction with Atomic Counter

**Chosen Approach**: Server-side generation using Drizzle ORM transaction

1. Accept registration data
1. Begin transaction
1. Lock and increment `username_sequences.current_number` for category
1. Generate username: `CSMC_{P|J|S}_{PADDED_NUMBER}`
1. Insert contestant record with generated username
1. Commit transaction

**Rationale**:

- Database transactions provide ACID guarantees preventing duplicate usernames
- Turso supports SQLite `AUTOINCREMENT` semantics for sequential numbering
- Server-side generation prevents client-side manipulation
- Category-specific sequences (P, J, S) allow independent numbering

**Alternatives Considered**:

- **UUID-based usernames**: Rejected due to requirement for human-readable sequential format
- **Timestamp-based**: Rejected due to collision risk and non-sequential ordering
- **Application-level locking**: Rejected in favor of database-native transactions

**Code Pattern**:

```typescript
// In server/utils/username-generator.ts
await db.transaction(async (tx) => {
	const [sequence] = await tx
		.update(usernameSequences)
		.set({ currentNumber: sql`current_number + 1` })
		.where(eq(usernameSequences.category, categoryLetter))
		.returning();

	const username = `CSMC_${categoryLetter}_${sequence.currentNumber.toString().padStart(4, "0")}`;
	return username;
});
```

______________________________________________________________________

## 3. Form Validation Strategy

### Decision: Zod Schema with Client & Server Validation

**Chosen Approach**:

- Define Zod schema in shared location (`server/utils/validation.ts`)
- Client-side: Real-time validation using Nuxt UI Form component + Zod
- Server-side: Re-validate on API endpoint before database insert

**Rationale**:

- Zod provides type-safe schema definition that generates TypeScript types
- Nuxt UI Form component integrates natively with Zod for inline error display
- Server-side re-validation prevents malicious clients from bypassing validation
- Single source of truth for validation rules

**Alternatives Considered**:

- **Valibot**: Rejected in favor of Zod (project already uses Zod 4.1)
- **Custom validation functions**: Rejected due to lack of type inference
- **Client-only validation**: Rejected due to security concerns

**Validation Rules**:

```typescript
// server/utils/validation.ts
import { z } from "zod";

export const registrationSchema = z.object({
	name: z.string().min(2).max(100),
	institute: z.string().min(2).max(200),
	class: z.number().int().min(5).max(10),
	section: z.string().min(1).max(10),
	roll: z.number().int().positive(),
	email: z.string().email(),
	mobile: z
		.string()
		.regex(/^01\d{9}$/, "Must be valid Bangladeshi mobile number"),
	fatherName: z.string().min(2).max(100),
	motherName: z.string().min(2).max(100),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
```

**Nuxt UI Integration**:

- Use `<UForm :schema="registrationSchema">` component
- Inline errors appear via `<UFormField>` wrapper
- Form component handles focus management on validation errors

______________________________________________________________________

## 4. Returning Visitor Detection

### Decision: Dual-Layer Approach (localStorage + Server Fingerprint)

**Chosen Approach**:

- **Client-side**: Store `registrationComplete: true` + `username` in localStorage
- **Server-side**: Store device fingerprint in `device_registrations` table on successful registration
- On page load: Check localStorage first, then verify with server API if fingerprint exists

**Rationale**:

- localStorage provides instant client-side detection (no network latency)
- Server fingerprint acts as backup if localStorage cleared
- Fingerprint based on User-Agent + Screen Resolution (non-invasive)
- Composable (`use-returning-visitor.ts`) encapsulates detection logic

**Alternatives Considered**:

- **Cookies only**: Rejected due to GDPR concerns without consent banner
- **IP-based detection**: Rejected due to unreliability (shared IPs, mobile networks)
- **Canvas fingerprinting**: Rejected as overly invasive for this use case
- **Session storage**: Rejected (cleared on tab close, doesn't persist)

**Implementation Pattern**:

```typescript
// composables/use-returning-visitor.ts
export const useReturningVisitor = () => {
	const registrationData = useLocalStorage("csmc-registration", null);

	const checkRegistration = async () => {
		// Check localStorage first
		if (registrationData.value?.username) {
			return registrationData.value;
		}

		// Fallback: check server with fingerprint
		const fingerprint = generateFingerprint();
		const { data } = await useFetch("/api/registration/check", {
			method: "POST",
			body: { fingerprint },
		});

		return data.value;
	};

	return { checkRegistration, registrationData };
};
```

______________________________________________________________________

## 5. Loader Animation Performance

### Decision: CSS + Motion-v with Prefers-Reduced-Motion

**Chosen Approach**:

- Use `motion-v` for loader entrance animation (logo fade-in + scale)
- CSS animations for spinner rotation (hardware-accelerated)
- Minimum 2s loader display (UX pacing), maximum 5s timeout
- Respect `prefers-reduced-motion` by disabling animations

**Rationale**:

- `motion-v` provides Vue-native declarative animations
- CSS `transform` and `opacity` animations use GPU acceleration
- Timer ensures loader visible long enough to read message
- Accessibility: Reduced motion compliance per constitution

**Alternatives Considered**:

- **Lottie animations**: Rejected due to bundle size overhead for simple spinner
- **GreenSock (GSAP)**: Rejected as overkill for basic entrance effects
- **Pure CSS keyframes**: Rejected in favor of motion-v's Vue integration

**Code Pattern**:

```vue
<template>
	<Motion
		:initial="{ opacity: 0, scale: 0.9 }"
		:enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
		:leave="{ opacity: 0, scale: 1.05, transition: { duration: 300 } }"
	>
		<div class="loader">
			<NuxtImg src="/contest-logo.svg" alt="Contest Logo" />
			<UIcon name="line-md:loading-loop" class="animate-spin" />
			<p>Welcome to the registration forum...</p>
		</div>
	</Motion>
</template>

<style>
	@media (prefers-reduced-motion: reduce) {
		.animate-spin {
			animation: none;
		}
	}
</style>
```

______________________________________________________________________

## 6. Mobile Number Validation (Bangladeshi Format)

### Decision: Regex + Zod Custom Validator

**Chosen Approach**:

- Regex pattern: `^01\d{9}$` (11 digits starting with "01")
- Zod refinement for additional checks (no repeated digits like "01111111111")
- Server-side re-validation of pattern

**Rationale**:

- Bangladeshi mobile numbers always start with "01" followed by 9 digits
- Total length is always 11 digits
- Regex provides fast validation without external API calls
- No need for carrier-specific validation (business requirement only specifies format)

**Alternatives Considered**:

- **libphonenumber-js**: Rejected due to bundle size (200KB+) for single-country validation
- **Twilio Lookup API**: Rejected due to cost and latency for validation-only use case
- **Manual carrier prefix validation**: Rejected as unnecessarily strict (carriers change prefixes)

**Implementation**:

```typescript
export const mobileSchema = z
	.string()
	.regex(
		/^01\d{9}$/,
		"Must be valid Bangladeshi mobile number (11 digits starting with 01)",
	)
	.refine((val) => {
		// Reject obviously fake numbers like 01111111111
		const uniqueDigits = new Set(val.split("")).size;
		return uniqueDigits >= 3;
	}, "Mobile number appears invalid");
```

______________________________________________________________________

## 7. Category Auto-Derivation Logic

### Decision: Computed Property + Server Validation

**Chosen Approach**:

- Client: Vue computed property watches `class` value, auto-sets hidden `category` field
- Server: Re-derive category from class on registration endpoint as validation
- Mapping: `5-6 → Primary`, `7-8 → Junior`, `9-10 → Senior`

**Rationale**:

- Computed property provides instant UI feedback when class changes
- Hidden field ensures category submitted with form
- Server re-derivation prevents client manipulation
- Simple mapping logic (no external data source needed)

**Alternatives Considered**:

- **Database trigger**: Rejected as Turso doesn't support complex triggers
- **Stored in separate table**: Rejected as overkill for static 3-value mapping
- **Client-only derivation**: Rejected due to security concerns

**Code Pattern**:

```vue
<script setup lang="ts">
	const formData = reactive({
		class: null,
		category: computed(() => {
			if (!formData.class) return null;
			if (formData.class <= 6) return "Primary";
			if (formData.class <= 8) return "Junior";
			return "Senior";
		}),
	});
</script>
```

```typescript
// server/api/registration.post.ts
const derivedCategory =
	body.class <= 6 ? "Primary" : body.class <= 8 ? "Junior" : "Senior";

if (body.category !== derivedCategory) {
	throw createError({ statusCode: 400, message: "Category mismatch" });
}
```

______________________________________________________________________

## 8. Placeholder Content Strategy

### Decision: TODO Component Markers with Props

**Chosen Approach**:

- Create `<TodoPlaceholder>` component accepting `name` prop
- Use for sponsor badge and contest rules/program sections
- Component renders styled "Content pending" box with clear labels
- Easily replaceable in future via component swap

**Rationale**:

- Explicit placeholder prevents "forgot to add content" confusion
- Component approach allows hot-swapping content without refactoring
- Maintains visual consistency across placeholders
- Per spec requirements (FR-017, FR-018)

**Alternatives Considered**:

- **Empty divs**: Rejected as invisible placeholders cause layout issues
- **Lorem ipsum text**: Rejected as could be mistaken for real content
- **Comments only**: Rejected as not visible to end users during testing

**Component Interface**:

```vue
<!-- components/todo-placeholder.vue -->
<template>
	<UCard>
		<div class="rounded border-2 border-dashed border-amber-500 p-4">
			<UIcon name="line-md:alert" class="text-amber-500" />
			<p class="font-semibold">{{ name }}: Content Pending</p>
			<p class="text-sm text-gray-500">
				This section will be populated in future phases
			</p>
		</div>
	</UCard>
</template>

<script setup lang="ts">
	defineProps<{ name: string }>();
</script>
```

______________________________________________________________________

## 9. Concurrent Registration Handling

### Decision: Database Row Locking + Retry Logic

**Chosen Approach**:

- Use Drizzle's transaction with `FOR UPDATE` lock on `username_sequences` row
- Server endpoint implements exponential backoff retry (max 3 attempts)
- Client shows generic "Processing..." during retries
- On failure after retries, show error with "Try again" button

**Rationale**:

- Row-level locks prevent duplicate username generation
- Expected load (100-500 registrations) unlikely to cause contention
- Retries handle transient failures gracefully
- Turso supports SQLite row locking semantics

**Alternatives Considered**:

- **Optimistic locking with version field**: Rejected due to added complexity
- **Queue-based processing**: Rejected as overkill for expected load
- **No concurrency handling**: Rejected due to SC-006 requirement (100 concurrent)

**Implementation Pattern**:

```typescript
// server/api/registration.post.ts
const MAX_RETRIES = 3;

for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
	try {
		const result = await db.transaction(async (tx) => {
			// Lock row during transaction
			const [sequence] = await tx
				.select()
				.from(usernameSequences)
				.where(eq(usernameSequences.category, category))
				.for("update"); // Row lock

			// Generate username and insert contestant...
		});
		return result;
	} catch (err) {
		if (attempt === MAX_RETRIES - 1) throw err;
		await new Promise((r) => setTimeout(r, 100 * Math.pow(2, attempt)));
	}
}
```

______________________________________________________________________

## 10. SEO & Meta Tags

### Decision: @nuxtjs/seo with Dynamic Metadata

**Chosen Approach**:

- Use `@nuxtjs/seo` module (already installed)
- Set page title: "CSMC Infinity Contest Registration"
- Add Open Graph tags for social sharing
- Dynamic meta description based on page state (form vs success)

**Rationale**:

- SEO important for students discovering registration via search
- Social sharing enables students to share with peers
- @nuxtjs/seo provides SSR-friendly meta tag management
- Already installed per package.json

**Alternatives Considered**:

- **Manual `useHead` composable**: Rejected in favor of module's conveniences
- **No SEO optimization**: Rejected as limits discoverability

**Configuration**:

```typescript
// app.config.ts or nuxt.config.ts
export default defineNuxtConfig({
	site: {
		name: "CSMC Infinity Contest",
		description:
			"Register for the CSMC Infinity Contest organized by Collegiate School Math Club",
		url: process.env.NUXT_PUBLIC_SITE_URL,
	},
});

// In pages/index.vue
useSeoMeta({
	title: "Registration - CSMC Infinity Contest",
	ogTitle: "CSMC Infinity Contest Registration",
	description:
		"Register now for the CSMC Infinity Contest. Open to classes 5-10.",
	ogDescription: "Join students from classes 5-10 in the CSMC Infinity Contest",
	ogImage: "/og-image.png",
});
```

______________________________________________________________________

## Summary of Technical Stack

**Frontend**:

- Nuxt 4.1 (SSR + hydration)
- Vue 3.5 Composition API
- Nuxt UI 4.0 (form components)
- Tailwind CSS (styling)
- motion-v (animations)
- @vueuse/nuxt (composables like useLocalStorage)

**Backend** (Nuxt Server):

- Nuxt server API routes (`server/api/`)
- Drizzle ORM 0.44
- @libsql/client 0.15
- Turso (libSQL cloud database)

**Validation**:

- Zod 4.1 (schema definition)
- Client-side: Nuxt UI Form + Zod integration
- Server-side: Re-validation on API endpoints

**Testing**:

- Vitest 3.2 (unit + component tests)
- @nuxt/test-utils 3.19 (Nuxt test utilities)
- Playwright 1.56 (E2E tests)

**Deployment**:

- SSR mode (server-side rendering)
- Environment variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Static assets served via Nuxt Image optimization

______________________________________________________________________

## Open Questions Resolved

1. **How to prevent duplicate emails/mobile numbers?**
   → Unique constraints on database columns + error handling with user-friendly messages

1. **What if localStorage is disabled?**
   → Fall back to server-side fingerprint check; if both fail, allow re-registration (business decision: prioritize access over strict uniqueness)

1. **Sponsor badge format?**
   → TODO placeholder component; future phase will replace with actual image/logo component

1. **Contest rules content source?**
   → TODO placeholder component; content team will provide markdown/structured data in future phase

1. **Should we rate-limit registration submissions?**
   → Yes, implement basic rate limiting (10 requests/minute per IP) using Nuxt middleware

1. **Offline form completion?**
   → Not supported in MVP; show clear error message if submission fails due to network issue (per assumption: "Internet connectivity required")

______________________________________________________________________

## Implementation Priority

1. **Phase 1 (Core MVP)**:

   - Database schema + migrations
   - Registration form with validation
   - Username generation
   - Success page display

1. **Phase 2 (Enhancements)**:

   - Returning visitor detection
   - Loader animation polish
   - Rate limiting
   - E2E tests

1. **Phase 3 (Content Integration)**:

   - Replace TODO placeholders
   - Add actual contest rules
   - Add sponsor badges
   - Add program schedule

______________________________________________________________________

**Research Complete**: All technical unknowns resolved. Ready to proceed to Phase 1 (data model + contracts).

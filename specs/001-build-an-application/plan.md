# Implementation Plan: CSMC Infinity Contest Registration System

**Branch**: `001-build-an-application` | **Date**: 2025-10-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-an-application/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a registration system for CSMC Infinity Contest that captures student information, automatically assigns unique examination usernames (CSMC_P/J/S_XXXX format), and provides returning visitor recognition. Technical approach: Nuxt 4 SSR application with Turso (libSQL) database, server-side rendering for SEO/performance, client-side device tracking via localStorage for returning visitors.

## Technical Context

**Language/Version**: TypeScript 5.9+ with Vue 3.5, Nuxt 4.1
**Primary Dependencies**: Nuxt 4, Vue 3, Nuxt UI 4.0, Tailwind CSS, Drizzle ORM 0.44, @libsql/client 0.15, Zod 4.1, motion-v 1.7
**Storage**: Turso (libSQL) for contestant data with TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
**Testing**: Vitest 3.2 with @nuxt/test-utils 3.19, Playwright 1.56 for E2E
**Target Platform**: Web (modern browsers: Chrome, Firefox, Safari, Edge latest 2 versions), SSR + hydration
**Project Type**: Web application (Nuxt SSR)
**Performance Goals**: \<2s returning visitor page load, \<500ms mutation response, \<3min registration completion time, \<5s loader transition on 4G
**Constraints**: \<200ms form validation feedback, 100 concurrent registrations without username collision, mobile-first responsive design
**Scale/Scope**: Expected 100-500 initial registrations, single registration per device, 1 landing page + 1 form + 1 success page

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### I. Accessibility First - ✅ PASS

- Keyboard navigation via native HTML elements (`<button>`, `<input>`, `<label>`)
- Form fields have proper labels and `aria-label` for screen readers
- Hit targets ≥44px on mobile forms (Nuxt UI button defaults)
- Validation errors use `aria-live="polite"` announcements
- Focus management: first error field receives focus on validation failure
- High contrast form elements (APCA compliant via Nuxt UI theming)

### II. Performance & Optimization - ✅ PASS

- SSR provides fast initial page load with hydration
- Lazy-load loader animation assets
- Optimistic UI: form submission shows immediate loading state
- Controlled input loops minimized (use `v-model` efficiently)
- Image optimization via `@nuxt/image` for logos
- Target mutations \<500ms via efficient database queries

### III. Component Design Standards - ✅ PASS

- Use `line-md` icons exclusively (loader spinner, success checkmark)
- Consistent spacing via Tailwind utilities
- Mobile font-size ≥16px on inputs to prevent zoom (Nuxt UI default)
- Proper viewport meta tag with `maximum-scale=1` per spec
- Nested radii for cards/forms (child ≤ parent)

### IV. User Experience Excellence - ✅ PASS

- Hydration-safe inputs (SSR rendered, then enhanced)
- Never block paste in form fields
- Enter key submits form
- Inline validation errors next to fields within 500ms
- Loading button shows spinner + keeps label
- Autocomplete attributes on email/phone/name fields
- Trim values to handle trailing spaces
- Warn on unsaved changes before navigation
- URL state for success page (enable direct linking)

### V. Code Quality & Maintainability - ✅ PASS

- kebab-case file naming enforced by ESLint
- Full TypeScript with `bun run typecheck`
- Zod schemas for form validation (derive types)
- Vue `<script setup lang="ts">` syntax
- `@/` path alias for app imports
- `consola` for server-side logging
- Conventional commits via commitlint

### VI. Testing & Validation - ✅ PASS

- Vitest for component tests (form validation, category derivation)
- Playwright E2E for registration journey
- Test validation feedback timing (\<500ms)
- Test username uniqueness under concurrent load
- Test returning visitor recognition
- Honor `prefers-reduced-motion` for loader animation

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
app/
├── assets/
│   └── css/
│       └── main.css              # Global styles
├── components/
│   ├── registration-form.vue     # Main form component
│   ├── registration-loader.vue   # Branded loader
│   ├── success-message.vue       # Success page content
│   └── form-field.vue            # Reusable form field wrapper
├── pages/
│   └── index.vue                 # Landing page (loader → form → success)
├── public/
│   ├── contest-logo.svg          # Contest logo (existing)
│   └── csmc.webp                 # CSMC club logo (existing)
├── server/
│   ├── api/
│   │   └── registration.post.ts  # Registration endpoint
│   ├── database/
│   │   ├── schema.ts             # Drizzle schema
│   │   └── client.ts             # Turso client config
│   └── utils/
│       └── username-generator.ts # Sequential username logic
├── composables/
│   ├── use-registration.ts       # Registration state & API calls
│   └── use-returning-visitor.ts  # localStorage device tracking
└── app.vue                       # Root layout

tests/
├── unit/
│   ├── username-generator.test.ts
│   └── validation.test.ts
├── component/
│   ├── registration-form.test.ts
│   └── form-field.test.ts
└── e2e/
    └── registration-flow.test.ts
```

**Structure Decision**: Single Nuxt application (server + client unified). Server API routes handle database operations, client components manage UI state. Device tracking via composables accessing browser localStorage. Database schema in `server/database/` following Nuxt server conventions.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

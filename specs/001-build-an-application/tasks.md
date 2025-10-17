# Tasks: CSMC Infinity Contest Registration System

**Input**: Design documents from `/specs/001-build-an-application/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are NOT included in this implementation per project context (Vitest and Playwright tests will be written separately).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Nuxt project structure: `app/`, `server/`, `tests/` at repository root
- Component paths: `app/components/`
- Pages: `app/pages/`
- API endpoints: `server/api/`
- Database: `server/database/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database setup

- [x] T001 Create database schema file at server/database/schema.ts following data-model.md Drizzle ORM specification
- [x] T002 [P] Create database client configuration at server/database/client.ts with Turso connection setup using TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
- [x] T003 [P] Create shared validation schemas at server/utils/validation.ts with Zod schemas for registration form
- [x] T004 [P] Create shared type definitions at server/utils/types.ts based on contracts/types.ts
- [x] T005 Generate and apply database migrations using bun run db:generate

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Seed username_sequences table with initial data for categories P, J, S (all starting at 0)
- [x] T007 [P] Create username generation utility at server/utils/username-generator.ts with atomic transaction logic
- [x] T008 [P] Create device fingerprint generation utility at server/utils/device-fingerprint.ts for returning visitor detection
- [x] T009 [P] Create category derivation utility at server/utils/category.ts mapping class to Primary/Junior/Senior
- [x] T010 Create base form field component at app/components/form-field.vue with label, error display, and accessibility attributes
- [x] T011 Create TodoPlaceholder component at app/components/todo-placeholder.vue for sponsor badge and contest rules sections

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time Registration Journey (Priority: P1) 🎯 MVP

**Goal**: Enable students to visit the website for the first time and complete registration to receive their examination username and contest details

**Independent Test**: Visit the site on a new device, complete the registration form with valid data (Name: "John Doe", Institute: "Test School", Class: 7, Section: "A", Roll: 123, Email: "john@test.com", Mobile: "01712345678", Father's Name: "Father Name", Mother's Name: "Mother Name"), submit the form, and verify the success page displays a unique username in format CSMC_J_XXXX and contest information placeholders

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create registration loader component at app/components/registration-loader.vue with contest logo, branded spinner animation using line-md:loading-loop icon, and welcome message per FR-001
- [ ] T013 [P] [US1] Create registration form component at app/components/registration-form.vue with all fields per FR-002: Name, Institute, Class (radio buttons 5-10), Section, Roll, Email, Mobile, Father's Name, Mother's Name
- [ ] T014 [US1] Add computed category property in registration-form.vue that auto-derives from class selection per FR-003 (5-6→Primary, 7-8→Junior, 9-10→Senior)
- [ ] T015 [US1] Integrate Nuxt UI Form component with Zod validation schema in registration-form.vue for inline error display per FR-012
- [ ] T016 [US1] Add mobile number validation in registration-form.vue using regex pattern /^01\d{9}$/ per FR-004
- [ ] T017 [US1] Add email validation in registration-form.vue per FR-005
- [ ] T018 [US1] Add roll number validation in registration-form.vue for positive numeric values per FR-006
- [ ] T019 [US1] Add keyboard navigation support and focus management in registration-form.vue per FR-015
- [ ] T020 [US1] Add loading state and submit button disable logic in registration-form.vue per FR-016
- [ ] T021 [US1] Create registration API endpoint at server/api/registration.post.ts implementing contract from contracts/api-registration.md
- [ ] T022 [US1] Implement duplicate email/mobile check in server/api/registration.post.ts per FR-008
- [ ] T023 [US1] Implement username generation transaction in server/api/registration.post.ts using username-generator.ts utility with retry logic per research.md section 9
- [ ] T024 [US1] Implement contestant insertion in server/api/registration.post.ts with all form data and generated username
- [ ] T025 [US1] Implement device registration insertion in server/api/registration.post.ts to store device fingerprint per data-model.md device_registrations table
- [ ] T026 [US1] Create success message component at app/components/success-message.vue displaying username, TodoPlaceholder for rules, and TodoPlaceholder for program schedule per FR-009 and FR-017
- [ ] T027 [US1] Create main index page at app/pages/index.vue orchestrating loader → form → success flow with state management
- [ ] T028 [US1] Add prefers-reduced-motion support for loader animation in registration-loader.vue per constitution accessibility requirements
- [ ] T029 [US1] Add SEO meta tags in app/pages/index.vue using useSeoMeta with title "Registration - CSMC Infinity Contest" per research.md section 10
- [ ] T030 [US1] Add viewport meta tag with maximum-scale=1 in app.vue per plan.md constitution check line 48

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - new visitors can complete registration and receive a unique username

---

## Phase 4: User Story 2 - Returning Visitor Recognition (Priority: P2)

**Goal**: Enable students who have already registered to revisit the website from the same device and immediately see their registration confirmation without re-registering

**Independent Test**: Register on a device (follow User Story 1 test), close the browser, return to the website on the same device, and verify the success page displays immediately without showing the loader or registration form. The previously assigned username should be visible.

### Implementation for User Story 2

- [ ] T031 [P] [US2] Create check returning visitor API endpoint at server/api/registration/check.post.ts implementing contract from contracts/api-check-returning-visitor.md
- [ ] T032 [US2] Implement device_registrations table query in server/api/registration/check.post.ts joining with contestants table per data-model.md query patterns
- [ ] T033 [P] [US2] Create use-returning-visitor.ts composable at app/composables/use-returning-visitor.ts implementing dual-layer detection (localStorage + server fingerprint) per research.md section 4
- [ ] T034 [US2] Implement localStorage check for csmc-registration key in use-returning-visitor.ts composable
- [ ] T035 [US2] Implement server fingerprint check fallback in use-returning-visitor.ts calling /api/registration/check endpoint
- [ ] T036 [US2] Integrate use-returning-visitor.ts composable in app/pages/index.vue to check registration status on page load
- [ ] T037 [US2] Update app/pages/index.vue to conditionally skip loader and form, directly showing success page for returning visitors per FR-010 and FR-011
- [ ] T038 [US2] Store registration data to localStorage in registration-form.vue after successful registration to enable instant recognition

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - new visitors can register, returning visitors see their success page immediately

---

## Phase 5: User Story 3 - Form Validation and Error Handling (Priority: P2)

**Goal**: Ensure students receive clear, helpful feedback when they enter invalid or incomplete information, ensuring data quality and reducing registration errors

**Independent Test**: Attempt to submit the registration form with various invalid scenarios: 1) Leave Name field empty and submit - verify inline error appears next to Name field. 2) Enter invalid email "notanemail" - verify inline error shows "Please enter a valid email address". 3) Enter invalid mobile "12345" - verify inline error shows Bangladeshi format requirement. 4) Enter negative roll number "-5" - verify inline error shows positive number requirement. 5) Submit form with multiple errors - verify focus moves to first error field.

### Implementation for User Story 3

- [ ] T039 [P] [US3] Add required field validation to all form fields in app/components/registration-form.vue per FR-014
- [ ] T040 [P] [US3] Add inline error message rendering in app/components/form-field.vue using Nuxt UI FormField error prop
- [ ] T041 [US3] Implement focus-on-first-error logic in app/components/registration-form.vue per FR-013 using Nuxt UI Form validation callback
- [ ] T042 [US3] Add validation feedback timing optimization in app/components/registration-form.vue to trigger within 200ms per plan.md constraints
- [ ] T043 [US3] Add user-friendly error messages for validation failures in server/utils/validation.ts matching data-model.md validation summary table
- [ ] T044 [US3] Implement API error response formatting in server/api/registration.post.ts per contracts/api-registration.md error response schemas
- [ ] T045 [US3] Add duplicate email/mobile conflict error handling in server/api/registration.post.ts returning 409 status with existingUsername per contract
- [ ] T046 [US3] Add network error handling in app/components/registration-form.vue displaying retry button per research.md section 9
- [ ] T047 [US3] Add unsaved changes warning in app/pages/index.vue before navigation per constitution UX requirements
- [ ] T048 [US3] Add aria-live="polite" announcements for validation errors in app/components/form-field.vue per constitution accessibility requirements

**Checkpoint**: All user stories should now be independently functional - registration has robust validation and error handling with excellent UX

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [ ] T049 [P] Add proper ARIA labels and semantic HTML to all form inputs in app/components/registration-form.vue per constitution accessibility checklist
- [ ] T050 [P] Verify hit targets are ≥44px on mobile for all buttons and form controls
- [ ] T051 [P] Add loading spinner animation optimization using motion-v in app/components/registration-loader.vue per research.md section 5
- [ ] T052 [P] Add trim() to all text input fields in server/utils/validation.ts to handle trailing spaces per constitution requirements
- [ ] T053 [P] Optimize image loading for contest logos using @nuxt/image in app/components/registration-loader.vue
- [ ] T054 [P] Add proper autocomplete attributes to form fields (name="name" autocomplete="name", email autocomplete="email", tel autocomplete="tel") per constitution requirements
- [ ] T055 Verify form submission prevents paste blocking in all input fields per constitution requirements
- [ ] T056 Verify Enter key submits form in text inputs per constitution requirements
- [ ] T057 Add database indexes verification (contestants.email, contestants.mobile, contestants.username, device_registrations.device_fingerprint) per data-model.md performance considerations
- [ ] T058 Add consola logging for registration operations in server/api/registration.post.ts per plan.md code quality requirements
- [ ] T059 Run bun run typecheck and fix any type errors
- [ ] T060 Run bun run lint and fix any linting issues
- [ ] T061 Run bun run build to verify production build succeeds
- [ ] T062 Verify quickstart.md setup instructions are accurate by following them in a clean environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - THIS IS THE MVP
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 for registration flow to exist, but adds independent returning visitor functionality
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 with validation, can be developed independently from US2

### Within Each User Story

- Components can be created in parallel (marked with [P])
- API endpoints depend on utilities from Foundational phase
- Form integration depends on form component creation
- Success page integration depends on API endpoint completion

### Parallel Opportunities

- **Phase 1 (Setup)**: T001, T002, T003, T004 can all run in parallel (different files)
- **Phase 2 (Foundational)**: T007, T008, T009, T010, T011 can all run in parallel after T006 completes
- **User Story 1**: T012, T013 can run in parallel (different components)
- **User Story 2**: T031, T033 can run in parallel (API endpoint + composable)
- **User Story 3**: T039, T040 can run in parallel (different files)
- **Polish Phase**: Most tasks can run in parallel (different concerns)

---

## Parallel Example: User Story 1

```bash
# Launch loader and form components together:
Task: "Create registration loader component at app/components/registration-loader.vue"
Task: "Create registration form component at app/components/registration-form.vue"

# After API endpoint is ready, work on integration tasks:
Task: "Create success message component at app/components/success-message.vue"
Task: "Create main index page at app/pages/index.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (5 tasks - database schema, validation, types)
2. Complete Phase 2: Foundational (6 tasks - utilities, base components) - CRITICAL
3. Complete Phase 3: User Story 1 (19 tasks - full registration flow)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - New visitor can register successfully
   - Receives unique username (CSMC_P/J/S_XXXX format)
   - Sees success page with username
5. Deploy/demo if ready

**MVP Scope**: 30 tasks deliver complete first-time registration functionality

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (11 tasks)
2. Add User Story 1 → Test independently → Deploy/Demo (MVP with 30 tasks)
3. Add User Story 2 → Test independently → Deploy/Demo (38 tasks total - returning visitor recognition)
4. Add User Story 3 → Test independently → Deploy/Demo (48 tasks total - validation and error handling)
5. Add Polish Phase → Production ready (62 tasks total)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (11 tasks)
2. Once Foundational is done:
   - Developer A: User Story 1 (19 tasks)
   - Developer B: User Story 2 (8 tasks) - lighter, but depends on US1 API existing
   - Developer C: User Story 3 (10 tasks) - enhances US1 validation
3. Developer A finishes US1 first (MVP ready)
4. Developers B & C complete US2 and US3 (full feature set)
5. All developers: Polish phase together (14 tasks)

---

## Task Count Summary

- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 6 tasks
- **Phase 3 (User Story 1 - MVP)**: 19 tasks
- **Phase 4 (User Story 2)**: 8 tasks
- **Phase 5 (User Story 3)**: 10 tasks
- **Phase 6 (Polish)**: 14 tasks
- **Total**: 62 tasks

**MVP Tasks**: 30 (Setup + Foundational + US1)
**Parallel Opportunities**: 18 tasks marked with [P]

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths follow Nuxt 4 conventions per plan.md project structure
- Tests will be written separately using Vitest and Playwright per plan.md testing strategy
- Database operations use Drizzle ORM per technical context
- Forms use Nuxt UI components per technical context
- All validation uses Zod schemas per technical context

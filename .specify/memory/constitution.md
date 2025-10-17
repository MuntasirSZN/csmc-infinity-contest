# CSMC Infinity Contest Constitution

<!--
Sync Impact Report - Version 1.0.0 (Initial Release)
=====================================================
Version Change: TEMPLATE → 1.0.0

Modified Principles:
- Created: I. Accessibility First
- Created: II. Performance & Optimization
- Created: III. Component Design Standards
- Created: IV. User Experience Excellence
- Created: V. Code Quality & Maintainability
- Created: VI. Testing & Validation

Added Sections:
- Technology Stack & Tools
- Development Workflow
- Governance

Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md (constitution gates aligned)
- ✅ .specify/templates/spec-template.md (requirements structure aligned)
- ✅ .specify/templates/tasks-template.md (task categorization aligned)

Follow-up TODOs:
- None (all placeholders resolved)

-->

## Core Principles

### I. Accessibility First

MUST provide full WCAG 2.1 AA compliance and progressive enhancement:

- **Keyboard Navigation**: Full keyboard support per WAI-ARIA APG patterns with visible focus rings (`:focus-visible`), proper focus management (trap, move, return)
- **Hit Targets**: Minimum 24px (mobile 44px); expand hit area if visual element smaller; no dead zones on checkboxes/radios
- **Screen Reader Support**: Accurate `aria-label` values, decorative elements marked `aria-hidden`, semantic HTML (`button`, `a`, `label`) before ARIA, hierarchical headings (`h1-h6`)
- **Contrast & Visual Cues**: Meet APCA contrast requirements, redundant status indicators (not color-only), icons with text labels, increased contrast on interactive states
- **Assistive Technology**: Compatible with password managers, 2FA tools; allow pasting codes; support spellcheck disabling for emails/codes/usernames

**Rationale**: Accessibility is non-negotiable for inclusive user experience and compliance. Every user, regardless of ability, must be able to use the application effectively.

### II. Performance & Optimization

MUST deliver fast, responsive experiences on all devices and network conditions:

- **Rendering Performance**: Animate only compositor-friendly props (`transform`, `opacity`); batch layout reads/writes; track and minimize re-renders; virtualize lists with 500+ items
- **Network Optimization**: Preload above-the-fold images only; lazy-load remaining assets; mutations target \<500ms response time
- **Testing Standards**: Profile with CPU/network throttling; test iOS Low Power Mode and macOS Safari; measure reliably (disable performance-skewing extensions)
- **Layout Stability**: Prevent CLS with explicit image dimensions or reserved space; skeleton states mirror final content
- **Input Optimization**: Prefer uncontrolled inputs; make controlled loops cheap (minimize keystroke cost)

**Rationale**: Performance directly impacts user satisfaction, conversion rates, and accessibility. Slow applications exclude users on lower-end devices or poor connections.

### III. Component Design Standards

MUST follow consistent design patterns and visual hierarchy:

- **Visual Consistency**: Layered shadows (ambient + direct), crisp edges via semi-transparent borders, nested radii (child ≤ parent), hue-consistent tinting
- **Typography**: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums`), non-breaking spaces for term gluing (`10&nbsp;MB`), curly quotes, ellipsis character `…` (not three dots)
- **Layout Precision**: Optical alignment over strict geometry (±1px adjustments), deliberate grid/baseline alignment, balanced icon/text lockups, safe area respect (`env(safe-area-inset-*)`)
- **Responsive Design**: Verify mobile, laptop, ultra-wide (50% zoom); mobile `<input>` font-size ≥16px; never disable browser zoom
- **Icons**: Use `line-md` family exclusively (with fallback to `lucide`); no custom icons without approval

**Rationale**: Visual consistency reduces cognitive load and creates professional, trustworthy interfaces. Design systems prevent fragmentation.

### IV. User Experience Excellence

MUST create intuitive, forgiving, and delightful interactions:

- **Forms & Inputs**: Hydration-safe, never block paste, show loading states with spinners, Enter submits text inputs (Cmd/Ctrl+Enter for textarea), inline validation errors with focus management, autocomplete attributes, meaningful placeholders (`example…`)
- **State Management**: URL reflects state (filters/tabs/pagination), Back/Forward restores scroll, links use `<a>/<Link>` (support Cmd/Ctrl/middle-click)
- **Feedback Systems**: Optimistic UI with reconciliation, confirm destructive actions, polite `aria-live` announcements, ellipsis for follow-up options ("Rename…")
- **Touch/Drag**: Forgiving interactions with generous targets, proper `overscroll-behavior: contain` in modals/drawers, disable text selection during drag
- **Progressive Disclosure**: Inline help first (tooltips last resort), no dead ends (always offer next step/recovery), design all states (empty/sparse/dense/error)

**Rationale**: Excellent UX builds user confidence and reduces support burden. Forgiving interfaces accommodate real-world user behavior.

### V. Code Quality & Maintainability

MUST maintain clean, testable, and conventional code:

- **File Naming**: kebab-case for all TypeScript files and folders (ESLint enforced)
- **Type Safety**: Full TypeScript usage, run `bun run typecheck` before commits, create schemas with Zod then derive types
- **Formatting**: 2-space indentation, double quotes (Biome config), use `@/` path alias for app code
- **Vue Standards**: Use `<script setup lang="ts">` syntax with Composition API, follow Nuxt conventions
- **Error Handling**: Use `consola` for logging, structured error messages, meaningful stack traces
- **Pre-commit**: Commitlint (conventional commits), lint-staged with ESLint/Stylelint/Biome

**Rationale**: Consistent code style and type safety prevent bugs, accelerate onboarding, and enable confident refactoring.

### VI. Testing & Validation

MUST validate functionality and catch regressions:

- **Test Framework**: Vitest with `@nuxt/test-utils` for component testing
- **Test Types**: Contract tests for API boundaries, integration tests for user journeys, unit tests for utilities
- **Verification Gates**: Run `bun run test` before commits, ensure tests fail before implementation (TDD when appropriate), test across devices
- **Animation Testing**: Honor `prefers-reduced-motion`, verify interruptible animations, correct `transform-origin`
- **Content Resilience**: Test with short/average/very long user-generated content, locale-aware dates/times/numbers/currency

**Rationale**: Testing prevents regressions and documents expected behavior. Automated tests enable rapid iteration with confidence.

## Technology Stack & Tools

**Runtime**: Bun (package manager and runtime)\
**Framework**: Nuxt 4 with Vue 3 Composition API\
**Type Safety**: TypeScript 5.9+, Zod for schema validation\
**UI Framework**: Nuxt UI 4.0+ with Tailwind CSS\
**State Management**: Pinia for complex state\
**Testing**: Vitest, @nuxt/test-utils, Playwright\
**Linting**: Oxlint (primary), ESLint, Stylelint\
**Formatting**: Biome\
**Icons**: `@iconify-json/line-md` (primary), lucide (fallback)\
**Animation**: `motion-v` for declarative animations\
**SEO**: `@nuxtjs/seo` for metadata management\
**Security**: `nuxt-security` for headers/CSP

**Backend Integration**: Just uses nuxt

## Development Workflow

**Branch Strategy**: Feature branches with conventional names (`###-feature-name`)\
**Commit Format**: Conventional commits enforced via commitlint\
**Development Server**: `bun run dev` (with HMR)\
**Build**: `bun run build` (Nuxt production build)\
**Quality Gates**:

1. `bun run lint` (must pass)
1. `bun run typecheck` (must pass)
1. `bun run test` (must pass)
1. Visual review (mobile, tablet, desktop, ultra-wide)
1. Accessibility audit (keyboard nav, screen reader, contrast)

**Code Review Requirements**:

- Principles compliance verified (checklist)
- Mobile responsiveness tested
- Accessibility features validated
- Performance impact assessed
- Error states designed and tested

## Governance

This constitution supersedes all other practices. All code changes, architectural decisions, and feature specifications MUST align with these principles.

**Amendment Process**:

1. Propose change with rationale and impact analysis
1. Document affected templates and workflows
1. Increment version per semantic versioning (MAJOR: principle removal/redefinition; MINOR: new principle/expansion; PATCH: clarifications/typos)
1. Update all dependent artifacts (templates, docs, guidance)
1. Communicate changes to team

**Compliance Review**:

- All PRs must verify principle adherence
- Constitution gates in `plan.md` must pass before Phase 0 research
- Complexity violations require explicit justification in plan
- Use this constitution for runtime development guidance

**Conflict Resolution**: When principles conflict, prioritize in order: I. Accessibility → II. Performance → IV. User Experience → III. Design → V. Code Quality → VI. Testing. Justify trade-offs explicitly.

**Version**: 1.0.0 | **Ratified**: 2025-10-15 | **Last Amended**: 2025-10-15

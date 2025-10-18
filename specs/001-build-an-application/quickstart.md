# Quickstart Guide: CSMC Infinity Contest Registration System

## Prerequisites

- **Bun**: v1.1.34 or higher ([install guide](https://bun.sh))
- **Node.js**: v20+ (for compatibility checks)
- **Git**: For version control
- **Turso Account**: For database hosting ([turso.tech](https://turso.tech))

## Initial Setup

### 1. Clone and Install

```bash
cd /home/muntasir/projects/csmc-infinity-contest
bun install
```

### 2. Database Setup (Turso)

#### Create Turso Database

```bash
turso db create csmc-infinity-contest
```

#### Get Database URL and Auth Token

```bash
turso db show csmc-infinity-contest --url
turso db tokens create csmc-infinity-contest
```

#### Set Environment Variables

Create `.env` file in project root:

```bash
TURSO_DATABASE_URL="libsql://your-database-url.turso.io"
TURSO_AUTH_TOKEN="your-auth-token-here"
```

**Note**: The setup script already set these variables. Verify with:

```bash
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN
```

### 3. Generate Database Schema

```bash
bun run db:generate
```

This creates migration files in `drizzle/` directory.

### 4. Apply Migrations

```bash
turso db shell csmc-infinity-contest < drizzle/0000_initial.sql
```

Or use Drizzle Kit:

```bash
bun run db:push
```

### 5. Seed Initial Data

The database needs initial sequence records:

```sql
INSERT INTO username_sequences (category, current_sequence) VALUES
  ('Primary', 0),
  ('Junior', 0),
  ('Senior', 0);
```

Run via Turso shell:

```bash
turso db shell csmc-infinity-contest
```

Then paste the INSERT statement.

## Development

### Start Development Server

```bash
bun run dev
```

App runs at `http://localhost:3000`

### Watch Mode with Auto-Reload

Development server includes:

- Hot Module Replacement (HMR)
- Auto-restart on server changes
- TypeScript type checking in background

## Testing

### Run All Tests

```bash
bun run test
```

### Run Specific Test File

```bash
bun run test tests/registration.test.ts
```

### Watch Mode

```bash
bun run test:watch
```

### Coverage Report

```bash
bun run test -- --coverage
```

## Code Quality

### Type Checking

```bash
bun run typecheck
```

Run before committing to catch type errors.

### Linting

```bash
bun run lint
```

Runs oxlint, ESLint, and Stylelint.

### Auto-Fix Linting Issues

```bash
bun run lint:fix
```

### Format Code

```bash
bun run fmt
```

Uses Biome formatter (2-space indentation, double quotes).

## Building

### Production Build

```bash
bun run build
```

Outputs to `.output/` directory.

### Preview Production Build

```bash
bun run preview
```

## Key Commands Reference

| Command               | Description                 |
| --------------------- | --------------------------- |
| `bun run dev`         | Start development server    |
| `bun run build`       | Production build            |
| `bun run preview`     | Preview production build    |
| `bun run test`        | Run all tests               |
| `bun run test:watch`  | Run tests in watch mode     |
| `bun run typecheck`   | TypeScript type checking    |
| `bun run lint`        | Run all linters             |
| `bun run lint:fix`    | Auto-fix linting issues     |
| `bun run fmt`         | Format code with Biome      |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:push`     | Push schema to database     |

## Project Structure

```
csmc-infinity-contest/
├── app/
│   ├── assets/          # CSS, images, fonts
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables
│   ├── layouts/         # Layout components
│   ├── pages/           # Nuxt pages (file-based routing)
│   ├── utils/           # Utility functions
│   ├── app.config.ts    # App-level configuration
│   └── app.vue          # Root component
├── server/
│   ├── api/             # API route handlers
│   ├── db/              # Database schema & client
│   ├── middleware/      # Server middleware
│   └── utils/           # Server utilities
├── tests/               # Test files
├── drizzle/             # Database migrations
├── specs/               # Feature specifications
├── .env                 # Environment variables (git-ignored)
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # Dependencies & scripts
└── tsconfig.json        # TypeScript configuration
```

## Database Schema Overview

### Tables

1. **contestants**: Registration data (14 columns)
1. **username_sequences**: Atomic username generation (3 columns)
1. **device_registrations**: Returning visitor detection (4 columns)

### Indexes

- `contestants`: `mobile` (unique), `email` (unique), `username` (unique), `category`
- `device_registrations`: `contestant_id`, `device_fingerprint` (unique)

Full schema details in `specs/001-build-an-application/data-model.md`

## API Endpoints

### POST `/api/registration`

Submit new registration. See `specs/001-build-an-application/contracts/api-registration.md`

### POST `/api/registration/check`

Check returning visitor. See `specs/001-build-an-application/contracts/api-check-returning-visitor.md`

## Troubleshooting

### TypeScript Errors After Changes

```bash
bun run typecheck
```

### Database Connection Issues

Verify environment variables:

```bash
echo $TURSO_DATABASE_URL
echo $TURSO_AUTH_TOKEN
```

Test connection:

```bash
turso db shell csmc-infinity-contest
```

### Port Already in Use

Change port in `nuxt.config.ts` or use environment variable:

```bash
PORT=3001 bun run dev
```

### Pre-commit Hook Failures

Pre-commit runs:

1. Commitlint (conventional commits)
1. Lint-staged (ESLint, Stylelint, Biome)

Fix issues before committing:

```bash
bun run lint:fix
bun run fmt
```

## Next Steps

1. Review feature spec: `specs/001-build-an-application/spec.md`
1. Read API contracts: `specs/001-build-an-application/contracts/`
1. Check data model: `specs/001-build-an-application/data-model.md`
1. Start implementing (tasks.md will be generated next)

## Support

- **Issues**: Report at [github.com/sst/opencode/issues](https://github.com/sst/opencode/issues)
- **Docs**: Nuxt ([nuxt.com](https://nuxt.com)), Drizzle ([orm.drizzle.team](https://orm.drizzle.team))

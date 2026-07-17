# @workspace/config

Type-safe environment configuration for the monorepo. Each export validates only what its consumer needs.

## Structure

```
src/
  load-env.ts          # Loads workspace root `.env`
  validate.ts          # Shared Zod validation helper
  schemas/
    server.ts          # Schema definitions grouped by concern
  server/
    index.ts           # Full server env
    database.ts        # Database-only env
    email.ts           # Email-only env
    storage.ts         # Storage-only env
  client/
    index.ts           # Browser / Expo public env parsers
  public/
    index.ts           # Browser-safe product identity
  index.ts             # Re-exports full server env
```

## Who imports what

| Consumer                 | Import                       | Variables validated                                           |
| ------------------------ | ---------------------------- | ------------------------------------------------------------- |
| `apps/api`               | `@workspace/config`          | Full server env                                               |
| `@workspace/auth`        | `@workspace/config`          | Full server env                                               |
| `@workspace/db`          | `@workspace/config/database` | `MONGODB_URI`                                                 |
| `@workspace/email`       | `@workspace/config/email`    | `RESEND_API_KEY`, `APP_NAME`, `BETTER_AUTH_URL`, `EMAIL_FROM` |
| `@workspace/storage`     | `@workspace/config/storage`  | `STORAGE_*`                                                   |
| `apps/web`               | `@workspace/config/client`   | `parseWebEnv(import.meta.env)`                                |
| `apps/marketing`         | `@workspace/config/client`   | `parseMarketingEnv(process.env)`                              |
| `apps/mobile`            | `@workspace/config/client`   | `parseMobileEnv(process.env)`                                 |
| `@workspace/auth/client` | `@workspace/config/client`   | `parseClientPublicEnv()` (shared)                             |
| Product UI               | `@workspace/config/public`   | Static product identity; no environment access                |

## Usage

### Server (API, auth)

```typescript
import { env } from "@workspace/config"

console.log(env.MONGODB_URI, env.BETTER_AUTH_URL)
```

### Database package

```typescript
import { databaseEnv } from "@workspace/config/database"
```

### Email package

```typescript
import { emailEnv, getEmailFromAddress } from "@workspace/config/email"
```

### Web client (Vite)

```typescript
import { parseWebEnv } from "@workspace/config/client"

const { apiUrl, authUrl, appName } = parseWebEnv(import.meta.env)
```

### Product identity

```typescript
import { productConfig } from "@workspace/config/public"
```

The `/public` entry is safe in server and client components. Long-form page
content and UI composition remain inside the product app.

## Build phase

Set `SKIP_ENV_VALIDATION=true` or run during `NEXT_PHASE=phase-production-build` to use safe defaults (CI builds without a full `.env`).

## Root `.env`

Place a single `.env` at the monorepo root. `loadRootEnvFile()` walks up from `cwd` and loads it automatically — no per-app `.env` duplication required.

# Architecture

```
┌─────────────┐  session cookie  ┌─────────────┐     MongoDB    ┌──────────┐
│  apps/web   │ ───────────────► │  apps/api   │ ─────────────► │   db     │
│  (Vite)     │                  │  (NestJS)   │                └──────────┘
└──────┬──────┘                  └──────┬──────┘
       │                                │
       │ authClient                     │ /api/auth/*
       ▼                                ▼
┌──────────────────────────────────────────────┐
│  @workspace/auth (Better Auth + CASL)         │
└──────────────────────────────────────────────┘
```

**Shared packages**

- `@workspace/auth` — Better Auth server/client, access control, CASL, NestJS module ([details](../packages/auth/README.md))
- `@workspace/cache` — cache abstraction — memory (dev) and Redis (production)
- `@workspace/config` — single root `.env`, Zod validation
- `@workspace/contracts` — Zod schemas shared by API + clients
- `@workspace/dates` — shared date formatting helpers (date-fns)
- `@workspace/db` — shared Mongoose connection (business collections)
- `@workspace/email` — Resend + React Email templates for auth emails
- `@workspace/logger` — structured JSON logging (pino)
- `@workspace/notifications` — push notification delivery — Expo (production) and console (dev)
- `@workspace/payment` — payment adapters (bKash / SSLCommerz); Nest module in API
- `@workspace/redis` — Redis client factory (ioredis) — shared by auth secondary storage and cache
- `@workspace/storage` — file upload providers (local HMAC-signed downloads / S3)
- `@workspace/ui-shadcn` — shared React components

**API-local (not packages):** BullMQ jobs under `apps/api/src/common/jobs/`; Socket.IO gateway under `apps/api/src/common/realtime/`.

**API pattern:** controller → Service Orchestrator (Pragmatic Light-CQRS) → Command / Query Repository → Domain Exceptions. No `@nestjs/cqrs`.
**Auth:** Better Auth sessions + organization RBAC; CASL available for ABAC (not used on controllers yet). See [docs/org-roles-and-ui.md](./org-roles-and-ui.md) and [docs/authN-authZ.md](./authN-authZ.md).

**Tests:** API uses Jest (`test/unit/`, `test/e2e/`). Web and packages use Vitest (`test/`).

**Web pattern:** route → page → TanStack Query hooks → `lib/api.ts` → contracts validation.

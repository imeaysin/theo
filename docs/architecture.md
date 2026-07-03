# Architecture

```
┌─────────────┐     JWT      ┌─────────────┐     MongoDB    ┌──────────┐
│  apps/web   │ ───────────► │  apps/api   │ ─────────────► │   db     │
│  (Vite)     │              │  (NestJS)   │                └──────────┘
└──────┬──────┘              └──────┬──────┘
       │                            │
       │ session                    │ /api/auth/*
       ▼                            ▼
┌──────────────────────────────────────────────┐
│           @workspace/auth (Better Auth)       │
└──────────────────────────────────────────────┘
```

**Shared packages**

- `@workspace/config` — single root `.env`, Zod validation
- `@workspace/contracts` — Zod schemas shared by API + clients
- `@workspace/db` — shared Mongoose connection (API + auth)
- `@workspace/logger` — structured JSON logging (pino)
- `@workspace/email` — Resend + React Email templates for auth emails
- `@workspace/auth` — auth server, JWT, RBAC ([details](../packages/auth/README.md))
- `@workspace/storage` — file upload providers (local / S3)
- `@workspace/ui` — components, auth UI, app shell
- `@workspace/dates` — shared date formatting helpers

**API pattern:** controller → CQRS command/query handlers → repository.

**Tests:** API uses Jest (`test/unit/`, `test/e2e/`). Web and packages use Vitest (`test/`).

**Web pattern:** route → page → TanStack Query hooks → `lib/api.ts` → contracts validation.

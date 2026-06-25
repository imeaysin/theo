# API (`apps/api`)

NestJS business API. Auth is served by Better Auth at `/api/auth` via `@thallesp/nestjs-better-auth`.

## Structure

```
src/
  main.ts                 # Bootstrap
  app.module.ts           # Root module
  app.controller.ts       # Version-neutral API metadata (GET /)
  modules/                # Feature modules (health, users, projects, …)
  infrastructure/         # Cross-cutting infra (database, …)
  common/                 # Shared filters, bootstrap helpers
```

## Development

```bash
pnpm --filter api dev
```

Requires root `.env` (see `.env.example`).

## Endpoints

| Path | Auth | Description |
|------|------|-------------|
| `GET /` | Public | API metadata |
| `GET /v1/health` | Public | Liveness + MongoDB status |
| `/api/auth/*` | Better Auth | Session, OAuth, JWT, orgs |
| `GET /docs` | Public (non-prod) | Swagger UI |

## Adding a feature module

```
src/modules/projects/
  projects.controller.ts
  projects.module.ts
```

Register `ProjectsModule` in `app.module.ts`. Use `@Public()` from `@workspace/auth/nestjs` only on routes that must stay open without a bearer JWT.

# API (`apps/api`)

NestJS business API. Auth is served by Better Auth at `/api/auth` via `@thallesp/nestjs-better-auth`.

**Authorization:** [`packages/auth/README.md`](../../packages/auth/README.md)

## Development

```bash
pnpm --filter api dev
pnpm --filter api seed   # after first sign-up
```

## Endpoints

| Path                         | Auth         | Description                 |
| ---------------------------- | ------------ | --------------------------- |
| `GET /`                      | Public       | API metadata                |
| `GET /v1/health`             | Public       | Liveness + MongoDB          |
| `GET /v1/users/me`           | Session      | Current user                |
| `GET /v1/notes`              | Session      | List notes                  |
| `POST /v1/notes`             | Session      | Create note                 |
| `PATCH /v1/notes/:id`        | Session      | Update note                 |
| `DELETE /v1/notes/:id`       | Session      | Delete note                 |
| `POST /v1/notes/bulk-delete` | Session      | Bulk delete notes (max 100) |
| `POST /v1/uploads`           | Session      | Upload file (max 5 MB)      |
| `GET /uploads/*`             | Public       | Local storage files (dev)   |
| `/api/auth/*`                | Better Auth  | Session, OAuth, roles       |
| `GET /docs`                  | Public (dev) | Swagger                     |

## Docker

```bash
docker build -f apps/api/Dockerfile -t theo-api .
```

## Tests

```bash
pnpm test          # unit tests
pnpm test:e2e      # e2e (requires MongoDB — run `pnpm db:up` first)
```

See [docs/deployment.md](../../docs/deployment.md).

## 🤖 Agentic Coding Instructions

When modifying or refactoring this application, you must pull global standards from the monorepo root `.agentinstructions` file and merge them with the architectural specifications defined locally in `.agenticdocs.md`.

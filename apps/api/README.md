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
| `GET /v1/me`                 | Bearer JWT   | Current user                |
| `GET /v1/notes`              | Bearer JWT   | List notes                  |
| `POST /v1/notes`             | Bearer JWT   | Create note                 |
| `PATCH /v1/notes/:id`        | Bearer JWT   | Update note                 |
| `DELETE /v1/notes/:id`       | Bearer JWT   | Delete note                 |
| `POST /v1/notes/bulk-delete` | Bearer JWT   | Bulk delete notes (max 100) |
| `POST /v1/uploads`           | Bearer JWT   | Upload file (max 5 MB)      |
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

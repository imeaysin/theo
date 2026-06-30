# API (`apps/api`)

NestJS business API. Auth is served by Better Auth at `/api/auth` via `@thallesp/nestjs-better-auth`.

**Authorization:** see [`packages/auth/README.md`](../../packages/auth/README.md) for roles (including `manager`), custom roles, and decorators.

## Structure

```
src/
  common/           decorators, filters, guards (via auth), interceptors, pipes
  modules/          feature modules (commands/, queries/, dto/, …)
```

Controllers dispatch `CommandBus` / `QueryBus`. Responses are wrapped as `{ "data": … }`.

## Development

```bash
pnpm --filter api dev
```

Requires root `.env` (see `.env.example`).

## Endpoints

| Path | Auth | Description |
|------|------|-------------|
| `GET /` | Public | API metadata |
| `GET /v1/health` | Public | Liveness + MongoDB |
| `GET /v1/me` | Bearer JWT | Current user claims |
| `GET /v1/notes` | Bearer JWT | List notes (owner check in handler) |
| `POST /v1/notes` | Bearer JWT | Create note |
| `DELETE /v1/notes/:id` | Bearer JWT | Delete note |
| `/api/auth/*` | Better Auth | Session, OAuth, roles, orgs |
| `GET /docs` | Public (dev) | Swagger |

## Adding a feature module

1. `src/modules/<feature>/` — `commands/`, `queries/`, `dto/`, `entities/`, `repositories/` as needed.
2. Register handlers + `CqrsModule` in `<feature>.module.ts`.
3. Zod schemas in `@workspace/contracts`; validate with `ZodValidationPipe`.
4. Apply decorators from [`common/decorators`](./src/common/decorators/index.ts) (re-exports `@workspace/auth/nestjs`).

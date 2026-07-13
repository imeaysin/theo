# Theo monorepo — agent guide

pnpm workspace template: NestJS API, Vite React web app, Next.js marketing site, shared packages.

## Layout

```
apps/
  api/          NestJS — CQRS feature modules, Jest (unit + e2e)
  web/          Vite + React Router — Vitest in test/
  marketing/    Next.js 16 landing — see apps/marketing/AGENTS.md
  mobile/       Expo — do not modify unless explicitly asked
packages/
  auth/           Better Auth server + Nest guards + React hooks
  cache/          Cache abstraction (memory / Redis)
  config/         Root .env validation (Zod)
  contracts/      Shared Zod schemas (API + clients)
  dates/          Date formatting helpers (date-fns)
  db/             MongoDB connection layer (Mongoose)
  email/          Transactional email (Resend + React Email)
  jobs/           Job queue (inline / BullMQ)
  logger/         Structured logging (pino)
  notifications/  Push delivery (Expo / console)
  realtime/       Event bus (memory / Redis pub/sub)
  redis/          ioredis client factory
  storage/        File upload providers (local / S3)
  ui/             Shared React components + auth UI + app shell
tooling/        eslint-config, typescript-config, vitest-config
docs/           Human docs (architecture, features, deployment)
```

## Commands (from repo root)

| Script                                                      | Purpose                      |
| ----------------------------------------------------------- | ---------------------------- |
| `pnpm dev`                                                  | All apps with a `dev` script |
| `pnpm dev:api` / `dev:web` / `dev:marketing` / `dev:mobile` | Single app                   |
| `pnpm lint` / `typecheck` / `test` / `build`                | CI parity                    |
| `pnpm db:up`                                                | MongoDB via Docker Compose   |

Set `SKIP_ENV_VALIDATION=true` when env is incomplete locally.

## Conventions

### API (`apps/api`)

- **Pattern:** controller → Service Orchestrator (Pragmatic Light-CQRS) → Command / Query Repository.
- **Events:** Decoupled architecture using strictly-typed Event Classes (e.g., `UserDeletedEvent`) and `@nestjs/event-emitter`.
- **Reference module:** `src/modules/notes/` (domain, dto, repository, listeners, service, controller).
- **Validation & OpenAPI:** Zod schemas in `@workspace/contracts` (with `.meta()` / `.describe()`). API uses `nestjs-zod` (`createZodDto`, global `ZodValidationPipe`, `cleanupOpenApiDoc` for `/docs`). Request bodies use `.strict()` (reject unknown keys).
- **Responses:** success envelope `{ success, statusCode, message, data, timestamp }` via `TransformResponseInterceptor`; errors `{ success, statusCode, code, message, errors, path, timestamp }` via `AllExceptionsFilter`. Document success with `apiSuccessResponse()` in contracts; use `@ApiAuthErrorResponses()` / `@ApiPublicErrorResponses()` on controllers.
- **Domain errors:** `apiNotFound(..., DomainErrorCode.NOTE_NOT_FOUND)` — codes live in `@workspace/contracts` (`HttpErrorCode`, `DomainErrorCode`).
- **Auth:** JWT from Better Auth; guards in `app.module.ts`; decorators in `common/decorators`.
- **Tests:** `test/unit/*.spec.ts` (Jest), `test/e2e/*.e2e-spec.ts` (`pnpm test:e2e` in api).
- **Logging:** `@workspace/logger` (pino v10). Dev: `pino-pretty` via transport (`LOG_PRETTY=true|false`). Production: JSON + ISO timestamps. Nest route noise at `debug` — set `LOG_LEVEL=debug` to show.

### Web (`apps/web`)

- **Pattern:** route → page → TanStack Query hooks → `lib/api.ts`.
- **`apiFetch`** unwraps the success envelope (`data`) and attaches bearer token; throws `ApiError` with `code` on failures.
- **Tests:** `test/**/*.test.ts` with `@/` alias (see `vitest.config.ts`).

### Shared packages

- Add versions to `pnpm-workspace.yaml` `catalog:`; reference as `"catalog:"` in package.json.
- Build library packages before typecheck (`turbo` handles `dependsOn: ["^build"]`).

## Do not

- Over-engineer (no custom CQRS abstractions beyond `@nestjs/cqrs`).
- Duplicate contract shapes outside `@workspace/contracts`.
- Change `apps/mobile/` unless explicitly asked.
- Assume stock Next.js 15 APIs — marketing uses Next 16 (see `apps/marketing/AGENTS.md`).

## Further reading

- [docs/architecture.md](./docs/architecture.md)
- [docs/adding-a-feature.md](./docs/adding-a-feature.md)
- [packages/auth/README.md](./packages/auth/README.md)
- Per-app: `apps/api/AGENTS.md`, `apps/web/AGENTS.md`

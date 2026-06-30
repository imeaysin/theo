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
  auth/         Better Auth server + Nest guards
  config/       Root .env validation (Zod)
  contracts/    Shared Zod schemas (API + clients)
  logger/       Structured logging (pino)
  storage/      File upload providers (local / S3)
  ui/           Shared React components
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

- **Pattern:** controller → `CommandBus` / `QueryBus` → handler → repository (or storage repository).
- **Reference module:** `src/modules/notes/` (commands, queries, dto, entities, repositories).
- **Validation & OpenAPI:** Zod schemas in `@workspace/contracts` (with `.meta()` / `.describe()`). API uses `nestjs-zod` (`createZodDto`, global `ZodValidationPipe`, `cleanupOpenApiDoc` for `/docs`).
- **Responses:** wrapped in `{ data }` by `TransformResponseInterceptor` — document with `apiDataResponse()` envelope schemas in contracts.
- **Auth:** JWT from Better Auth; guards in `app.module.ts`; decorators in `common/decorators`.
- **Tests:** `test/unit/*.spec.ts` (Jest), `test/e2e/*.e2e-spec.ts` (`pnpm test:e2e` in api).
- **Logging:** `@workspace/logger` (pino) everywhere — `NestLoggerService` for Nest internals, `createLogger()` in interceptors/filters/bootstrap. Do not use Nest `Logger` or `console.log` in app runtime code.

### Web (`apps/web`)

- **Pattern:** route → page → TanStack Query hooks → `lib/api.ts`.
- **`apiFetch`** unwraps `{ data }` and attaches bearer token.
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

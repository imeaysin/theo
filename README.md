# Theo

Full-stack monorepo template: NestJS API, Vite web app, Next.js marketing site, and Expo mobile — with shared auth, UI, and environment config.

## Stack

| App       | Path             | Tech                               | Port |
| --------- | ---------------- | ---------------------------------- | ---- |
| API       | `apps/api`       | NestJS 11, Better Auth, MongoDB    | 4000 |
| Web       | `apps/web`       | Vite, React Router, TanStack Query | 5173 |
| Marketing | `apps/marketing` | Next.js 16                         | 3000 |
| Mobile    | `apps/mobile`    | Expo 56, Expo Router               | 8081 |

Shared packages live in `packages/` (`auth`, `config`, `contracts`, `db`, `email`, `ui`, …). Tooling presets are in `tooling/`.

## Quick start

**Requirements:** Node.js ≥ 20, pnpm 11, Docker (for MongoDB).

```bash
git clone <your-repo-url> my-app && cd my-app
pnpm install
cp .env.example .env
pnpm db:up          # start MongoDB
pnpm dev            # all apps in parallel (first run builds shared packages)
```

Open:

- Web app → http://localhost:5173
- Marketing → http://localhost:3000
- API + auth → http://localhost:4000
- Swagger (dev) → http://localhost:4000/docs

## Environment

One `.env` at the repo root — all apps load it automatically via `@workspace/config`. See [`.env.example`](./.env.example) for every variable.

**pnpm:** This monorepo uses a hoisted `node-linker` (see [`.npmrc`](./.npmrc)) so Next.js resolves types correctly across workspaces.

Generate a secret:

```bash
openssl rand -base64 32
```

Set `BETTER_AUTH_SECRET` to the output. OAuth providers are optional — leave blank to disable.

## Scripts

| Command                  | Description                                 |
| ------------------------ | ------------------------------------------- |
| `pnpm dev`               | Start all apps                              |
| `pnpm dev:api`           | API only                                    |
| `pnpm dev:web`           | Web app only                                |
| `pnpm dev:marketing`     | Marketing site only                         |
| `pnpm db:up`             | Start MongoDB via Docker Compose            |
| `pnpm db:down`           | Stop MongoDB                                |
| `pnpm build`             | Production build (all workspaces)           |
| `pnpm lint`              | ESLint                                      |
| `pnpm typecheck`         | TypeScript                                  |
| `pnpm test`              | Tests                                       |
| `pnpm test:e2e`          | API e2e tests (requires MongoDB)            |
| `pnpm setup`             | Copy `.env.example`, install, start MongoDB |
| `pnpm --filter api seed` | Demo notes for first user (after sign-up)   |

## Documentation

| Doc                                                    | Topic                 |
| ------------------------------------------------------ | --------------------- |
| [docs/getting-started.md](./docs/getting-started.md)   | Clone, env, run       |
| [docs/architecture.md](./docs/architecture.md)         | System diagram        |
| [docs/adding-a-feature.md](./docs/adding-a-feature.md) | Contracts → API → web |
| [docs/deployment.md](./docs/deployment.md)             | Docker, static deploy |
| [docs/env-reference.md](./docs/env-reference.md)       | Every env var         |
| [packages/auth/README.md](./packages/auth/README.md)   | Roles & authorization |

**Use as a GitHub template:** enable _Template repository_ in repo Settings → General.

## Example feature: Notes

Sign in → **Dashboard → Notes** to list/create/delete notes via the API. Or run `pnpm --filter api seed` after sign-up.

## Adding UI components

Components live in `packages/ui`. Use the shadcn CLI from the repo root:

```bash
pnpm dlx shadcn@latest add button -c packages/ui
```

Import in any app:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Adding an API module

See [`apps/api/README.md`](./apps/api/README.md). Add modules under `src/modules/`, register in `app.module.ts`, and share request/response schemas via `@workspace/contracts`.

## Project structure

```
apps/
  api/          NestJS business API + Better Auth at /api/auth
  web/          Main product SPA (auth, dashboard shell)
  marketing/    Public marketing site
  mobile/       Expo native app (starter)
packages/
  auth/         Better Auth config + framework adapters
  config/       Zod-validated env (single root .env)
  contracts/    Shared Zod schemas
  db/           Mongoose connection
  email/        Resend + React Email templates
  ui/           Shared components, auth UI, app shell
tooling/
  eslint-config/
  typescript-config/
  vitest-config/
```

## Architecture & conventions

This template follows official patterns for each layer of the stack.

### Turborepo + pnpm

| Pattern                                                                       | Where                                                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Apps in `apps/`, libraries in `packages/`, shared tooling in `tooling/`       | [Turborepo structure](https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository) |
| Task pipeline: `build` → `^build`, `typecheck`/`test` wait on upstream builds | `turbo.json`                                                                                           |
| Shared versions via pnpm `catalog:`                                           | `pnpm-workspace.yaml`                                                                                  |
| `globalDependencies` invalidate cache when workspace config changes           | `turbo.json`                                                                                           |
| Hoisted linker for Next.js + pnpm                                             | `.npmrc`                                                                                               |

### NestJS (`apps/api`)

| Pattern                                                                        | Where               |
| ------------------------------------------------------------------------------ | ------------------- |
| Feature modules under `src/modules/`                                           | `app.module.ts`     |
| URI versioning (`/v1/...`)                                                     | `configure-app.ts`  |
| Global `ZodValidationPipe` (contracts-backed validation)                       | `app.module.ts`     |
| Swagger in non-production                                                      | `configure-app.ts`  |
| `bodyParser: false` for Better Auth (required by nestjs-better-auth)           | `main.ts`           |
| Shared env via `@workspace/config` (Zod) instead of duplicating `.env` per app | Monorepo convention |

### Next.js (`apps/marketing`)

| Pattern                                                                   | Where               |
| ------------------------------------------------------------------------- | ------------------- |
| `transpilePackages` for internal UI package                               | `next.config.ts`    |
| `outputFileTracingRoot` pointing at monorepo root (deploy from workspace) | `next.config.ts`    |
| Root `.env` loaded via `@next/env`                                        | `next.config.ts`    |
| `@workspace/eslint-config/next-js`                                        | `eslint.config.mjs` |

### React (`apps/web`)

| Pattern                                                          | Where                       |
| ---------------------------------------------------------------- | --------------------------- |
| Vite SPA for authenticated product (client-side routing)         | `apps/web`                  |
| `StrictMode`, error boundary, TanStack Query                     | `main.tsx`, `providers.tsx` |
| Root `.env` via Vite `envDir`                                    | `vite.config.ts`            |
| Shared UI from `@workspace/ui` (source, no duplicate components) | imports                     |

**Why Vite for web and Next for marketing?** The product app is a SPA behind auth (React Router). Marketing is SSR/static-friendly public pages — each framework fits its job.

### Shared packages

| Package                | Role                                                                                               |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `@workspace/config`    | Single root `.env`, Zod validation, dev URL constants                                              |
| `@workspace/contracts` | Zod schemas shared by API + clients                                                                |
| `@workspace/auth`      | Better Auth config + Nest/Next/Expo adapters — **[authorization docs](./packages/auth/README.md)** |
| `@workspace/ui`        | Components consumed as source (`transpilePackages` in Next, direct import in Vite)                 |
| `@workspace/db`        | Shared Mongoose connection for API and auth                                                        |
| `@workspace/email`     | Resend + React Email templates for auth emails                                                     |
| `@workspace/storage`   | File upload providers (local / S3)                                                                 |
| `@workspace/logger`    | Structured logging (pino)                                                                          |
| `@workspace/dates`     | Shared date formatting helpers                                                                     |

## CI

GitHub Actions runs lint, typecheck, test, API e2e, and build on every push/PR. Set `SKIP_ENV_VALIDATION=true` in CI — no real `.env` required for builds.

## License

MIT — see [LICENSE](./LICENSE).

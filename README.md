# Theo

Full-stack monorepo template: NestJS API, Vite web app, Next.js marketing site, and Expo mobile — with shared auth, UI, and environment config.

## Stack

| App | Path | Tech | Port |
|-----|------|------|------|
| API | `apps/api` | NestJS 11, Better Auth, MongoDB | 4000 |
| Web | `apps/web` | Vite, React Router, TanStack Query | 5173 |
| Marketing | `apps/marketing` | Next.js 16 | 3000 |
| Mobile | `apps/mobile` | Expo 56, Expo Router | 8081 |

Shared packages live in `packages/` (`auth`, `config`, `contracts`, `db`, `email`, `ui`, …). Tooling presets are in `tooling/`.

## Quick start

**Requirements:** Node.js ≥ 20, pnpm 11, Docker (for MongoDB).

```bash
git clone <your-repo-url> my-app && cd my-app
pnpm install
cp .env.example .env
pnpm db:up          # start MongoDB replica set
pnpm dev            # all apps in parallel (or use dev:api, dev:web, dev:marketing)
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

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps |
| `pnpm dev:api` | API only |
| `pnpm dev:web` | Web app only |
| `pnpm dev:marketing` | Marketing site only |
| `pnpm db:up` | Start MongoDB via Docker Compose |
| `pnpm db:down` | Stop MongoDB |
| `pnpm build` | Production build (all workspaces) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Tests |

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

## CI

GitHub Actions runs lint, typecheck, test, and build on every push/PR. Set `SKIP_ENV_VALIDATION=true` in CI — no real `.env` required for builds.

## License

MIT — see [LICENSE](./LICENSE).

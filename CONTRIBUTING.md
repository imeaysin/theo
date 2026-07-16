# Contributing

Thanks for using or improving this template.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm dev
```

## Before opening a PR

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Pre-commit (husky) runs **prettier** on staged files. ESLint runs via `pnpm lint` — same as CI.

Set `SKIP_ENV_VALIDATION=true` locally if you do not have a full `.env`.

## Adding a package

1. Create `packages/<name>/` with `package.json`, `tsconfig.json`, and `eslint.config.mjs`.
2. Use the `@workspace/<name>` naming convention.
3. Add `"@workspace/<name>": "workspace:*"` where consumed.
4. Extend `@workspace/typescript-config/base.json` for libraries.

## Adding an app

1. Scaffold under `apps/<name>/`.
2. Add env parsing in `@workspace/config/client` if the app needs public env vars.
3. Match existing scripts: `dev`, `build`, `lint`, `typecheck`.
4. Document ports and purpose in the root README.

See [docs/adding-a-feature.md](./docs/adding-a-feature.md) for the full-stack pattern.

## Code style

- Prettier + ESLint — run `pnpm format` (repo root) and `pnpm lint`.
- Shared UI goes in `packages/ui-shadcn`, not duplicated per app.
- API request/response shapes go in `packages/contracts`.
- Shared dependency versions live in `pnpm-workspace.yaml` under `catalog:` — use `"package": "catalog:"` in `package.json`, not hardcoded versions.
- Dev URL defaults (ports, app name) live in `packages/config/src/constants.ts`.

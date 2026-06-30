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

CI runs the same checks. Set `SKIP_ENV_VALIDATION=true` locally if you do not have a full `.env`.

## Adding a package

1. Create `packages/<name>/` with `package.json`, `tsconfig.json`, and `eslint.config.mjs`.
2. Use the `@workspace/<name>` naming convention.
3. Add `"@workspace/<name>": "workspace:*"` where consumed.
4. Extend `@workspace/typescript-config/base.json` for libraries.

## Adding an app

1. Scaffold under `apps/<name>/`.
2. Add env parsing in `@workspace/config/client` if the app needs public env vars.
3. Match existing scripts: `dev`, `build`, `lint`, `format`, `typecheck`.
4. Document ports and purpose in the root README.

## Code style

- Prettier + ESLint — run `pnpm format` and `pnpm lint`.
- Shared UI goes in `packages/ui`, not duplicated per app.
- API request/response shapes go in `packages/contracts`.

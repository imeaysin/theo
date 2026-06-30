# Web (`apps/web`)

Vite + React client for the Theo template.

## Development

```bash
pnpm --filter web dev
```

## Example features

| Route            | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `/`              | Public home                                                  |
| `/auth/*`        | Better Auth UI (sign-in, sign-up, password reset, 2FA, etc.) |
| `/app/dashboard` | Protected shell overview                                     |
| `/app/notes`     | **Reference CRUD** — TanStack Query + `lib/api.ts` + JWT     |
| `/app/settings`  | Signed-in profile                                            |

See [docs/adding-a-feature.md](../../docs/adding-a-feature.md) and [AGENTS.md](./AGENTS.md).

# Web (`apps/web`)

Vite + React client.

## Development

```bash
pnpm --filter web dev
```

## Example features

| Route                              | Purpose                                                      |
| ---------------------------------- | ------------------------------------------------------------ |
| `/`                                | Public home                                                  |
| `/auth/*`                          | Better Auth UI (sign-in, sign-up, password reset, 2FA, etc.) |
| `/app/dashboard`                   | Protected shell overview                                     |
| `/app/notes`                       | **Reference CRUD** — TanStack Query + cookie `apiFetch`      |
| `/app/uploads`                     | **Reference upload** — multipart FormData + `lib/api.ts`     |
| `/accept-invitation/:invitationId` | Org invite accept (Better Auth)                              |

See [docs/adding-a-feature.md](../../docs/adding-a-feature.md) and [AGENTS.md](./AGENTS.md).

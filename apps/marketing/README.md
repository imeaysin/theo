# Marketing (`apps/marketing`)

Public marketing site on port 3000. Links to the web app for sign-in and sign-up.

## Development

```bash
pnpm --filter marketing dev
```

Requires root `.env` (see `.env.example`). Set `CLIENT_URL` to your web app URL so CTAs point to the right place.

## Stack

Next.js 16, shared UI from `@workspace/ui`, env from `@workspace/config/client`.

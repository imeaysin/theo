# Mobile (`apps/mobile`)

Expo starter app for the Theo monorepo. Uses the root `.env` for `EXPO_PUBLIC_*` variables.

## Development

From the repo root:

```bash
pnpm dev:mobile
```

Or inside this app:

```bash
pnpm dev
```

Requires the API running (`pnpm dev:api`) for auth session checks.

## Environment

Loaded from the root `.env` (see [`.env.example`](../../.env.example)):

| Variable               | Purpose      |
| ---------------------- | ------------ |
| `EXPO_PUBLIC_API_URL`  | Business API |
| `EXPO_PUBLIC_AUTH_URL` | Better Auth  |
| `EXPO_PUBLIC_APP_NAME` | Display name |

## Auth

The home screen uses `@workspace/auth/mobile` (`mobileAuthClient`) to check the current session. Sign in via the web app for now — a native auth UI can be added later using the same client.

See [packages/auth/README.md](../../packages/auth/README.md) for authorization details.

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

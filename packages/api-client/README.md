# @repo/api-client

Typed HTTP client for the Nest REST API. Works in **web**, **React Native**, and **Node** (with `fetch`).

Authentication (sign-in, sign-up, session) lives in [`@repo/auth/client`](../auth) (Better Auth). This package covers `/api/users` and future REST resources.

## Layout

```
src/
  client/          # ApiClient + factories
  http/            # fetch wrapper + config types
  lib/             # config, errors, response parsing
  resources/       # per-domain APIs (users, …)
test/              # mirrors src layout
```

## Web (Vite / Next)

```typescript
import { createDefaultApiClient } from "@repo/api-client"

export const api = createDefaultApiClient()

const me = await api.users.getMe()
```

Set `VITE_API_URL=http://localhost:4000` in the root `.env`.

## Mobile (React Native / Expo)

```typescript
import { createApiClient } from "@repo/api-client"

export const api = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL!,
  credentials: "omit",
  getCookieHeader: () => secureStore.get("session_cookie"),
})
```

## Errors

```typescript
import { ApiError } from "@repo/api-client"

try {
  await api.users.getMe()
} catch (e) {
  if (e instanceof ApiError && e.isUnauthorized) {
    // redirect to sign-in
  }
}
```

# @repo/auth

| Import              | Use                                                                      |
| ------------------- | ------------------------------------------------------------------------ |
| `@repo/auth`        | Main export: `auth`, `authClient`                                      |
| `@repo/auth/server` | Nest — `auth`, `authHandler`, `getSessionFromHeaders`, **session types** |
| `@repo/auth/client` | Web — `createAppAuthClient(baseURL)`                             |
| `@repo/auth/expo-client` | Mobile — `createExpoAuthClient(baseURL)`                      |
| `@repo/auth`        | Permissions (`ac`, `admin`, `user`) + re-exported session types          |

## Types (Better Auth)

Export from the same file as `betterAuth()` — plugins must be **inline** so inference includes admin fields (`role`, `banned`, …):

```ts
export type Session = typeof auth.$Infer.Session
export type SessionUser = Session["user"]
```

Nest/API code should import session types from `@repo/auth/server`.

## Plugins

Server: `admin`, `twoFactor` from dedicated paths; `openAPI` from `better-auth/plugins` (no subpath export).

Client plugins: `plugins/client.ts` — paired with server config.

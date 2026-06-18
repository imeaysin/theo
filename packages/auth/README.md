# @workspace/auth

Better Auth configuration for the monorepo — Bearer + JWT (no cookie sessions).

## Exports

| Import | Use |
| --- | --- |
| `@workspace/auth` | Shared types (`Session`, `SessionUser`, …) |
| `@workspace/auth/server` | `auth`, `authHandler`, `authFetchHandler`, `getAuthFromHeaders` |
| `@workspace/auth/access-control` | RBAC `statement`, `hasPermission`, `Permission` type |
| `@workspace/auth/client` | Web client — `createAppAuthClient`, token storage, `refreshAccessToken` |
| `@workspace/auth/expo-client` | Mobile client — `createExpoAuthClient` |
| `@workspace/auth/testing` | Test helpers (sign-up, JWT headers, collection cleanup) |

NestJS guards and React hooks live in the apps that use them (`apps/api`, `apps/web`), not in this package.

Permission checks use `@workspace/auth/access-control` (formerly `@workspace/permission-manager`, which has been removed).

## JWT / JWKS

The `jwt` plugin stores signing keys in MongoDB (`jwks` collection). Keys are created automatically on first use — no separate migration step is required with the MongoDB adapter.

## Layout

```
src/
  access-control/   # RBAC statements and hasPermission
  authorization/    # Better Auth createAccessControl roles
  client/           # Web + Expo clients, token storage
  server/           # betterAuth instance, handlers, getAuthFromHeaders
  testing/          # Integration test utilities
  verify/           # JWT verification via JWKS
```

## Plugins (server)

- `bearer` — Authorization header transport
- `jwt` — Access tokens + JWKS for stateless API auth
- `admin` — RBAC user management
- `haveIBeenPwned` — Password breach checks
- `openAPI` — Schema generation
- `expo` — Native OAuth deep links

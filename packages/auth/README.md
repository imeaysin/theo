# Auth & authorization (`@workspace/auth`)

Better Auth config, permissions, and framework adapters.

## Roles

### Platform (app-wide)

Defined in [`src/permissions/platform/index.ts`](./src/permissions/platform/index.ts). Stored on `user.role`. Embedded in JWT as `role`.

| Role      | Typical use                                                    |
| --------- | -------------------------------------------------------------- |
| `guest`   | Read-only access                                               |
| `user`    | Default on sign-up (`defaultRole: "user"`)                     |
| `manager` | Team lead — publish projects, invite/remove team, billing read |
| `admin`   | Full platform access + Better Auth admin API                   |

**Assign platform role** (admin only):

```ts
import { authClient } from "@workspace/auth/client"

await authClient.admin.setRole({ userId: "…", role: "manager" })
```

User must refresh JWT after role change: `await authClient.token()`.

**Protect API route:**

```ts
@RequirePermission("team", "invite")  // manager + admin have this
@Roles("admin", "manager")            // coarse alternative
```

### Organization (per org)

Defined in [`src/permissions/organization/index.ts`](./src/permissions/organization/index.ts). Stored on `member.role`. Embedded in JWT as `organizationRole` (minted at `/api/auth/token`).

| Role     | Typical use                           |
| -------- | ------------------------------------- |
| `owner`  | Full org control                      |
| `admin`  | Manage members, invitations, settings |
| `member` | Create/update own work                |

**Assign org role:**

```ts
await authClient.organization.inviteMember({ email, role: "admin" })
await authClient.organization.updateMemberRole({ memberId, role: "admin" })
```

**Protect org-scoped API route:**

```ts
@RequireOrgPermission("project", "create")
```

Requires active organization (`organization.setActive`) and a fresh JWT.

## Custom roles

### Platform — code change

1. Add role in `src/permissions/platform/index.ts`:

```ts
export const supportRole = ac.newRole({
  content: ["read"],
  settings: ["read"],
})
export const roles = {
  guestRole,
  userRole,
  managerRole,
  adminRole,
  supportRole,
}
export type RoleName = "guest" | "user" | "manager" | "admin" | "support"
```

2. Register in [`src/lib/auth.ts`](./src/lib/auth.ts) `admin({ roles: { …, support: supportRole } })`.
3. Register in [`src/lib/auth-client.ts`](./src/lib/auth-client.ts) `adminClient({ ac, roles })`.
4. Assign with `authClient.admin.setRole({ userId, role: "support" })`.

### Organization — no deploy (dynamic)

`dynamicAccessControl` is enabled. Org admins create roles at runtime:

```ts
await authClient.organization.createRole({
  role: "moderator",
  permission: {
    project: ["read", "update"],
    content: ["read"],
  },
})

await authClient.organization.updateMemberRole({ memberId, role: "moderator" })
```

`OrgRbacGuard` resolves dynamic roles from the `organizationRole` collection automatically.

## NestJS guards

Registered globally in `apps/api/src/app.module.ts`:

```
JwksGuard → RbacGuard → OrgRbacGuard
```

| Decorator                                 | Scope                                                   |
| ----------------------------------------- | ------------------------------------------------------- |
| `@Public()`                               | Skip JWT                                                |
| `@RequirePermission(resource, action)`    | Platform                                                |
| `@RequireOrgPermission(resource, action)` | Active org                                              |
| `@Roles(...)`                             | Platform role names (optional, not registered globally) |

Permission statements (resources + actions) live in the `statement` export in each permissions file. Use those keys in decorators.

## JWT claims

| Claim                  | Source                       |
| ---------------------- | ---------------------------- |
| `role`                 | `user.role` (platform)       |
| `activeOrganizationId` | session                      |
| `organizationRole`     | `member.role` for active org |

Mint: `GET /api/auth/token` (session required). Business API verifies JWT via JWKS — no DB on the hot path; org dynamic roles are loaded only when `@RequireOrgPermission` is used.

## Permission architecture

Three layers — each has a single job:

| Layer           | Location                                                                        | Responsibility                                                                 |
| --------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Definitions** | `packages/auth/src/permissions/`                                                | Access-control statements, static roles, permission keys, sync check helpers   |
| **Enforcement** | `packages/auth/src/adapters/nestjs/` + `apps/api` handlers                      | JWT guards, `@RequirePermission` / `@RequireOrgPermission`, resource ownership |
| **UI gating**   | `packages/ui/src/auth/organization/ui-permissions.ts` + `@workspace/auth/react` | Hide/disable controls via `hasPermission`; never the source of truth           |

### `permissions/` layout

```text
permissions/
  types.ts                 # PermissionMapFor, ResourceName, ActionName
  collections.ts           # Better Auth Mongo collection names
  business/
    statement.ts           # App feature resources (project, content, …)
    grants.ts              # Role grants for platform + organization
  platform/
    index.ts               # Platform AC, roles, checkPlatformPermission
  organization/
    statement.ts           # Org AC statement (org plugin + business)
    index.ts               # Org AC, roles, helpers
    server.ts              # Dynamic role checks (server only)
```

### Adding a new capability

1. Extend `business/statement.ts` and `business/grants.ts`.
2. Protect API: `@RequireOrgPermission("project", "publish")`.
3. Gate shared auth UI with `useOrganizationPermission({ permissions: { project: ["publish"] } })` — same shape as Better Auth `hasPermission`. Optional DRY constants in `packages/ui/src/auth/organization/ui-permissions.ts`.
4. App-specific pages inline permission maps or define their own `ui-permissions` — do not add UI aliases to `@workspace/auth`.

### Better Auth recommended checks

| Check                 | When                                 | API                                                                                                                   |
| --------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `checkRolePermission` | Static roles only, sync UI preview   | `authClient.organization.checkRolePermission` / `authClient.admin.checkRolePermission`                                |
| `hasPermission`       | Current user, includes dynamic roles | `authClient.organization.hasPermission({ permissions: { … } })` → `useOrganizationPermission({ permissions: { … } })` |
| JWT + guards          | Business API hot path                | `@RequirePermission`, `@RequireOrgPermission`                                                                         |

With `dynamicAccessControl` enabled, **always use `hasPermission` hooks for UI** that gates user actions. `checkRolePermission` is for static role metadata (e.g. role labels), not authoritative access.

### What belongs where

**`@workspace/auth`** — roles, statements, guards, JWT claims, `useOrganizationPermission` (wraps `hasPermission` with Better Auth input shape).

**`apps/api`** — decorate controllers with `@RequirePermission` / `@RequireOrgPermission`; ownership checks in handlers (e.g. note belongs to `user.id`).

**`apps/web`** — routing, page layout, wiring `AuthUiConfigProvider`. No permission logic unless app-specific (not org/auth UI).

**`packages/ui`** — shared auth/org components; `organization/ui-permissions.ts` for typed `hasPermission` inputs + `useOrganizationPermission`. Reusable across web and marketing.

## Exports

| Import                                     | Use                                            |
| ------------------------------------------ | ---------------------------------------------- |
| `@workspace/auth`                          | Server `auth` instance                         |
| `@workspace/auth/client`                   | Browser `authClient`                           |
| `@workspace/auth/react`                    | React hooks (`useAuthSession`, auth mutations) |
| `@workspace/auth/nestjs`                   | Guards + decorators                            |
| `@workspace/auth/permissions`              | Platform AC + roles                            |
| `@workspace/auth/permissions/organization` | Org AC + roles + server checks                 |
| `@workspace/auth/types`                    | `JWTClaims`, `RoleName`                        |

## DB migrate

After plugin changes:

```bash
pnpm --filter @workspace/auth db:migrate
```

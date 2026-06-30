# Auth & authorization (`@workspace/auth`)

Better Auth config, permissions, and framework adapters.

## Roles

### Platform (app-wide)

Defined in [`src/permissions/platform.ts`](./src/permissions/platform.ts). Stored on `user.role`. Embedded in JWT as `role`.

| Role | Typical use |
|------|-------------|
| `guest` | Read-only access |
| `user` | Default on sign-up (`defaultRole: "user"`) |
| `manager` | Team lead — publish projects, invite/remove team, billing read |
| `admin` | Full platform access + Better Auth admin API |

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

Defined in [`src/permissions/organization.ts`](./src/permissions/organization.ts). Stored on `member.role`. Embedded in JWT as `organizationRole` (minted at `/api/auth/token`).

| Role | Typical use |
|------|-------------|
| `owner` | Full org control |
| `admin` | Manage members, invitations, settings |
| `member` | Create/update own work |

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

1. Add role in `src/permissions/platform.ts`:

```ts
export const supportRole = ac.newRole({
  content: ["read"],
  settings: ["read"],
})
export const roles = { guestRole, userRole, managerRole, adminRole, supportRole }
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
JwksGuard → RbacGuard → OrgRbacGuard → RolesGuard
```

| Decorator | Scope |
|-----------|-------|
| `@Public()` | Skip JWT |
| `@RequirePermission(resource, action)` | Platform |
| `@RequireOrgPermission(resource, action)` | Active org |
| `@Roles(...)` | Platform role names (coarse) |

Permission statements (resources + actions) live in the `statement` export in each permissions file. Use those keys in decorators.

## JWT claims

| Claim | Source |
|-------|--------|
| `role` | `user.role` (platform) |
| `activeOrganizationId` | session |
| `organizationRole` | `member.role` for active org |

Mint: `GET /api/auth/token` (session required). Business API verifies JWT via JWKS — no DB on the hot path; org dynamic roles are loaded only when `@RequireOrgPermission` is used.

## Exports

| Import | Use |
|--------|-----|
| `@workspace/auth` | Server `auth` instance |
| `@workspace/auth/client` | Browser `authClient` |
| `@workspace/auth/nestjs` | Guards + decorators |
| `@workspace/auth/permissions` | Platform AC + roles |
| `@workspace/auth/permissions/organization` | Org AC + roles |
| `@workspace/auth/types` | `JWTClaims`, `RoleName` |

## DB migrate

After plugin changes:

```bash
pnpm --filter @workspace/auth db:migrate
```

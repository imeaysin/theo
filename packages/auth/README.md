# @workspace/auth

Shared authentication and authorization for Theo.

- **Better Auth** (`1.6.23`) — sessions, email/password, OAuth, 2FA, organizations, admin, API keys
- **CASL** v7 — isomorphic ABAC
- **Sessions** — Redis secondary storage (`@better-auth/redis-storage`) + Mongo copy (`storeSessionInDatabase`)

No custom JWT bearer layer. Org/admin plugins require Mongo; Redis holds hot session data for multi-instance hosts.

## Access control (org roles)

Source of truth: `src/access/roles.ts` (exported as `@workspace/auth/access`).

| Export                  | Role                                                |
| ----------------------- | --------------------------------------------------- |
| `organizationStatement` | Permission vocabulary for Better Auth `ac`          |
| `organizationRoles`     | Built-in `owner` / `admin` / `member` / `viewer`    |
| `rolePermissionCatalog` | Checkbox resources for the custom-role UI           |
| `ASSIGNABLE_ORG_ROLES`  | Roles that can be invited/assigned (excludes owner) |

Custom roles are **not** defined here — they live in Mongo (`organizationRole`) via `dynamicAccessControl` and the Workspace UI.

How modules should gate API + UI (including custom roles): **[docs/org-roles-and-ui.md](../../docs/org-roles-and-ui.md)**.

```ts
// API
@MemberHasPermission({ permissions: { project: ["read"] } })

// Web (includes dynamic roles)
const canCreate = useHasOrgPermission({ project: ["create"] }, orgId)
```

Do **not** use `checkRolePermission` when custom roles may apply — it only knows static roles.

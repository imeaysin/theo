# Organization roles, custom roles & module UI

How Theo maps Better Auth org RBAC to API guards and web UI — including **static** built-in roles and **dynamic** custom roles.

Related: [authN-authZ.md](./authN-authZ.md) (full stack), [adding-a-feature.md](./adding-a-feature.md), Organization UI at `/organization/*`.

---

## Mental model

```
┌─────────────────────────────────────────────────────────────┐
│  Code (packages/auth/src/access/roles.ts)                     │
│  • organizationStatement  → permission vocabulary             │
│  • organizationRoles      → owner | admin | member | viewer │
│  • rolePermissionCatalog  → checkboxes in role editor UI      │
└────────────────────────────┬────────────────────────────────┘
                             │ ac + roles passed to
                             │ organization() / organizationClient()
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Database                                                     │
│  • member.role          → "admin" | "support" | "admin,…"   │
│  • organizationRole     → custom roles (name + permissions) │
└────────────────────────────┬────────────────────────────────┘
                             │ hasPermission / @MemberHasPermission
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Modules (notes, uploads, …)                                  │
│  API: gate endpoints   UI: hide/disable actions               │
└─────────────────────────────────────────────────────────────┘
```

| Piece                                                    | Hardcoded in code? | Why                                                         |
| -------------------------------------------------------- | ------------------ | ----------------------------------------------------------- |
| Permission vocabulary (`project:read`, …)                | **Yes**            | Better Auth `ac` must know every resource/action up front   |
| Built-in roles (`owner` / `admin` / `member` / `viewer`) | **Yes**            | Defaults every org starts with; not DB rows                 |
| Custom roles (`support`, `contractor`, …)                | **No**             | Stored in `organizationRole`; create/edit/delete at runtime |
| Who has which role                                       | **No**             | `member.role` (+ invites)                                   |

Custom roles may **only** use actions that exist in `organizationStatement`, and only a **subset of what the creator already has**.

---

## Source of truth

| Export                                   | Package                                    | Purpose                                                         |
| ---------------------------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `organizationStatement`                  | `@workspace/auth/access`                   | Full RBAC vocabulary (server + client `ac`)                     |
| `organizationRoles` / `STATIC_ORG_ROLES` | same                                       | Built-in roles                                                  |
| `ASSIGNABLE_ORG_ROLES`                   | same                                       | Invite/assign list (excludes `owner`)                           |
| `rolePermissionCatalog`                  | same                                       | Resources shown in custom-role UI (omits `organization` + `ac`) |
| `useHasOrgPermission`                    | `apps/web/src/hooks/use-org-permission.ts` | Module UI gating (static **and** custom)                        |

Do **not** duplicate permission lists in feature folders. Web helpers re-export from auth in `apps/web/src/features/organization/lib/org-roles.ts`.

---

## Built-in role matrix (approx.)

Permissions come from `ownerRole` / `adminRole` / `memberRole` / `viewerRole` in `roles.ts` (plus Better Auth defaults for `organization`, `invitation`, `team`, `ac`).

| Capability                        | owner | admin                | member    | viewer |
| --------------------------------- | ----- | -------------------- | --------- | ------ |
| Manage members / invites          | ✓     | ✓ (no member delete) | —         | —      |
| Create / edit custom roles (`ac`) | ✓     | ✓                    | read only | —      |
| Notes (`project` create/update)   | ✓     | ✓                    | ✓         | —      |
| Notes delete                      | ✓     | ✓                    | —         | —      |
| Notes read                        | ✓     | ✓                    | ✓         | ✓      |

Exact actions: read `packages/auth/src/access/roles.ts`.

---

## Custom roles — full lifecycle

UI: **Organization → Roles** (`/organization/roles`) — custom role CRUD. Members & invites stay on **People**.

### 1. Create

Requires `ac:create` (owners/admins).

```ts
await authClient.organization.createRole({
  role: "support", // stored lowercase
  permission: {
    project: ["read", "update"],
    report: ["read"],
    member: ["read"],
  },
})
```

Server rejects unknown actions and permissions the caller does not already have.

### 2. List / edit / rename / delete

```ts
await authClient.organization.listRoles()
await authClient.organization.updateRole({
  roleId,
  data: {
    roleName: "customer-support", // rename
    permission: { project: ["read"] },
  },
})
await authClient.organization.deleteRole({ roleId })
// Fails if any member still has that role
```

### 3. Assign

Invite with the role, or change an existing member:

```ts
await authClient.organization.inviteMember({
  email: "user@example.com",
  role: "support",
})

await authClient.organization.updateMemberRole({
  memberId,
  role: "support", // or ["support", "viewer"] for multi-role
})
```

### 4. Accept invite

`/accept-invitation/:invitationId` → `authClient.organization.acceptInvitation`.

### 5. Permission checks (critical)

| API                                                       | Includes custom roles?              | Use for                 |
| --------------------------------------------------------- | ----------------------------------- | ----------------------- |
| `organization.hasPermission({ permissions })`             | **Yes**                             | UI + server truth       |
| `organization.checkRolePermission({ role, permissions })` | **No** (static only)                | Never for dynamic roles |
| CASL `defineAbilityFor` / `<Can>`                         | **No** (maps static org role names) | Ownership / ABAC only   |

---

## Module pattern (API + UI)

Notes is the reference: API uses `project:*`; UI uses the same keys via `useHasOrgPermission`.

### API (Nest)

```ts
@MemberHasPermission({ permissions: { project: ["read"] } })
@Get()
listNotes(@Session() session: UserSession) { … }

@MemberHasPermission({ permissions: { project: ["create"] } })
@Post()
createNote(…) { … }
```

- Always scope data with `session.session.activeOrganizationId`.
- Never trust `organizationId` from the client body.
- Pick resource names from `organizationStatement` (add new ones there first).

### Web UI

```ts
const { data: organization } = authClient.useActiveOrganization()
const canCreate = useHasOrgPermission(
  { project: ["create"] },
  organization?.id
)

{canCreate.data ? (
  <Button onClick={openCreate}>New note</Button>
) : null}
```

Batch checks: `useOrgPermissionFlags` (used by organization role / permission UI).

**Rules**

1. Hide or disable actions the user cannot perform (UX).
2. Never rely on UI alone — API `@MemberHasPermission` is mandatory.
3. Use the **same** permission keys as the controller.
4. Custom-role users work automatically if their role includes those keys.

### CASL (optional ABAC)

Use when the check is “can update **this** note” (ownership), not “can update notes at all”.

- Org RBAC → Better Auth `hasPermission` / `@MemberHasPermission`
- Ownership / field rules → CASL `AbilityProvider` + `<Can>` / `AccessGuard`

Do not use CASL alone for custom org roles.

---

## Adding a new permission for a feature

Example: billing module needs `billing: ["read", "pay"]`.

1. **Statement** — add to `organizationStatement` in `packages/auth/src/access/roles.ts`.
2. **Built-in roles** — grant actions on `ownerRole` / `adminRole` / … as needed.
3. **UI catalog** — add to `rolePermissionCatalog` if custom roles should be able to receive it.
4. **Rebuild** — `pnpm --filter @workspace/auth build`.
5. **API** — `@MemberHasPermission({ permissions: { billing: ["pay"] } })`.
6. **Web** — `useHasOrgPermission({ billing: ["pay"] }, orgId)`.
7. **Verify** — create a custom role with `billing:read` only; confirm pay is denied for that member.

---

## Organization management (reference UI)

| Tab      | Behavior                                       |
| -------- | ---------------------------------------------- |
| Settings | Profile, logo, danger zone (`settings:update`) |
| People   | Members + invitations (Better Auth UI)         |
| Roles    | Built-in badges + custom CRUD (Theo)           |

Routes: `/organization/settings|people|roles`.
Custom roles: `apps/web/src/features/organization/` + BA UI shell under `features/auth/components/auth/organization/`.

E2E scripts (API up + Mongo/Redis):

```bash
pnpm --filter api exec bash scripts/auth-flow-test.sh
pnpm --filter api exec bash scripts/custom-role-flow-test.sh
```

---

## Checklist for a new feature module

- [ ] Permissions live in `organizationStatement` (not invented in the controller)
- [ ] Controller uses `@MemberHasPermission` with those keys
- [ ] Web uses `useHasOrgPermission` (or flags helper) with the same keys
- [ ] Custom role with a subset of permissions can use the feature correctly
- [ ] Viewer / read-only role cannot mutate
- [ ] No `checkRolePermission` for runtime decisions when custom roles exist

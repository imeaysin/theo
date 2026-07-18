# Auth & Authorization Architecture — Turborepo

### Doc-validated against Better Auth v1.6.x, CASL v7, nestjs-better-auth, nest-casl

---

## ⚠️ Corrections from Previous Response

Before anything else — things I stated before that were **wrong or outdated**, now corrected from real docs:

| Previous claim                                    | Reality (from docs)                                                                                                                          |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| "Better Auth has a NestJS adapter"                | It's **community-maintained**: `@thallesp/nestjs-better-auth`. Not official.                                                                 |
| "Import from `better-auth/react-native`"          | **Does not exist.** Expo uses `@better-auth/expo` package + Babel aliases.                                                                   |
| "Use Casbin for dynamic custom roles"             | **Better Auth's own `organization` plugin** has native `dynamicAccessControl` (runtime role creation stored in DB). Casbin is not needed.    |
| "Lucia is a valid alternative"                    | **Deprecated March 2025.** npm package is flagged deprecated. No active development. Do not use.                                             |
| "Auth.js v5 is maintained"                        | **Security-patch only** since Auth.js team joined Better Auth in Sept 2025. New projects: Better Auth.                                       |
| "Admin plugin has dynamic roles"                  | Admin plugin roles are **static** (code-defined only). Dynamic runtime roles are in the **organization plugin** with `dynamicAccessControl`. |
| "CASL's `createMongoAbility` is always right"     | CASL v7 ships `createMongoAbility` but you pick ability type by use case. `PureAbility` is preferred for non-Mongo setups.                   |
| "`better-auth/plugins` for `createAccessControl`" | **Bundle size warning in docs:** import from `better-auth/plugins/access`, NOT `better-auth/plugins`.                                        |

---

## Architecture Overview

Your needs map to **two libraries** only — not three:

```
Authentication (WHO are you?)     → Better Auth v1.6+
Authorization  (WHAT can you do?) → Better Auth Access Control
                                  + CASL v7 (isomorphic, client+server)
```

Better Auth's built-in `createAccessControl` handles RBAC. CASL handles the ABAC layer (ownership conditions, field-level access, client-side UI gating). No Casbin needed.

---

## Library Decision, Validated

### Better Auth v1.6+ — Authentication + RBAC

**Why, from actual comparison data (July 2026):**

- ~2.3M weekly npm downloads. Latest: 1.6.23
- Auth.js team officially joined Better Auth (Sept 2025). Auth.js is now maintenance-only
- Lucia: deprecated March 2025, no security patches, do not use
- Clerk: $2,025/month at 100K MAU vs ~$50/month self-hosted. US data residency only (GDPR risk)
- Better Auth: MIT, self-hosted, you own the DB, no per-MAU pricing

**What it actually covers for your needs:**

| Need                                     | Better Auth feature                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| Email/password auth                      | Built-in (`emailAndPassword: { enabled: true }`)                                             |
| OAuth (Google, GitHub, etc.)             | Built-in `socialProviders`                                                                   |
| 2FA / TOTP                               | `twoFactor()` plugin                                                                         |
| Passkeys                                 | `passkey()` plugin                                                                           |
| Session management                       | Built-in, JWE cookie cache since v1.4                                                        |
| Stateless (DB-less) only                 | Supported by BA, **not used in Theo** — org/admin/apiKey need Mongo                          |
| Serverless-friendly sessions             | Redis `secondaryStorage` + Mongo (`storeSessionInDatabase`) via `@better-auth/redis-storage` |
| Multi-org / multi-tenant                 | `organization()` plugin                                                                      |
| Predefined roles (owner/admin/member)    | Built into `organization` + `admin` plugins                                                  |
| Custom user-defined roles at runtime     | `organization({ dynamicAccessControl: { enabled: true } })`                                  |
| Org API keys (BA plugin, not Nest `/v1`) | `@better-auth/api-key` — org-owned keys; Nest routes still use cookie sessions               |
| User admin (ban, impersonate, set-role)  | `admin()` plugin                                                                             |
| NestJS integration                       | `@thallesp/nestjs-better-auth` (community, beta Fastify support)                             |
| Expo / React Native                      | `@better-auth/expo` package                                                                  |

### CASL v7 — Isomorphic ABAC Layer

**Why CASL alongside Better Auth's own AC:**

Better Auth's access control (`createAccessControl`) is RBAC only — it checks `resource: [actions]` against a role. It does **not** support attribute/condition-based checks like "user can update only their own posts" or "member can read only resources in their org." That's where CASL fills the gap.

CASL is isomorphic — same ability definitions work in NestJS guards, React components, and Expo. Latest: `@casl/ability@7.0.1`.

**Key CASL packages:**

- `@casl/ability` — core, all environments
- `@casl/react` — `<Can>` component + context hook
- `@casl/prisma` — converts CASL rules to Prisma `where` clauses (prevents over-fetching)
- `nest-casl` — NestJS integration with `CaslModule`, `AccessGuard`, `@UseAbility` decorator

---

## Package Structure

```
packages/
└── auth/
    ├── package.json
    └── src/
        ├── access/
        │   ├── statements.ts       ← SHARED (client-safe). All resource/action definitions.
        │   ├── roles.ts            ← SHARED (client-safe). Predefined roles using ac.newRole()
        │   └── index.ts            ← Barrel: exports ac, roles, defaultStatements merge
        │
        ├── ability/
        │   ├── types.ts            ← AppAbility type, AppActions, AppSubjects
        │   ├── factory.ts          ← CASL AbilityFactory (isomorphic, no server imports)
        │   └── index.ts
        │
        ├── server/
        │   ├── auth.ts             ← Better Auth instance (server-only, imports DB)
        │   ├── nest/
        │   │   ├── auth.module.ts  ← NestJS AuthModule using @thallesp/nestjs-better-auth
        │   │   ├── casl.module.ts  ← CaslModule using nest-casl
        │   │   ├── guards/
        │   │   │   └── ability.guard.ts
        │   │   └── decorators/
        │   │       └── check-ability.decorator.ts
        │   └── index.ts
        │
        ├── client/
        │   ├── web.ts              ← createAuthClient for web (better-auth/react)
        │   └── native.ts           ← createAuthClient for Expo (@better-auth/expo/client)
        │
        └── index.ts
```

**Critical rule from docs:** The `ac` (AccessControl instance) and `roles` objects **must live in a client-safe file with zero server imports**. Both the NestJS server AND the React/Expo clients import from the same `access/` files. If you put them in a server-only module, TypeScript literal types get erased and the client falls back to only "admin"/"user" roles.

---

## Implementation — Step by Step

### Step 1: Shared Access Control Statements & Roles

#### `packages/auth/src/access/statements.ts`

```typescript
import { createAccessControl } from "better-auth/plugins/access"
// ⚠️ Import from /access NOT from /plugins — docs warn about bundle size

export const statement = {
  // Your app's resources and their possible actions
  project: ["create", "read", "update", "delete", "publish", "archive"],
  report: ["create", "read", "update", "delete", "export"],
  member: ["create", "read", "update", "delete"],
  invoice: ["create", "read", "update", "delete", "approve"],
  settings: ["read", "update"],
  // Include Better Auth's built-in org statements if you want to extend them
} as const
// ⚠️ `as const` is required — docs specifically call this out for TypeScript inference

export const ac = createAccessControl(statement)
```

#### `packages/auth/src/access/roles.ts`

```typescript
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/organization/access"
import { createAccessControl } from "better-auth/plugins/access"

// Merge your statements with BA's default org statements
// so predefined org permissions aren't overridden
const statement = {
  ...defaultStatements,
  project: ["create", "read", "update", "delete", "publish", "archive"],
  report: ["create", "read", "update", "delete", "export"],
  member: ["create", "read", "update", "delete"],
  invoice: ["create", "read", "update", "delete", "approve"],
  settings: ["read", "update"],
} as const

export const ac = createAccessControl(statement)

// Predefined roles — these override BA defaults, so merge BA's default permissions
export const ownerRole = ac.newRole({
  // owner gets everything
  project: ["create", "read", "update", "delete", "publish", "archive"],
  report: ["create", "read", "update", "delete", "export"],
  member: ["create", "read", "update", "delete"],
  invoice: ["create", "read", "update", "delete", "approve"],
  settings: ["read", "update"],
  ...adminAc.statements, // merge BA org default permissions
})

export const adminRole = ac.newRole({
  project: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "export"],
  member: ["create", "read", "update"],
  invoice: ["create", "read", "update", "approve"],
  settings: ["read", "update"],
  ...adminAc.statements,
})

export const memberRole = ac.newRole({
  project: ["create", "read", "update"],
  report: ["create", "read"],
  member: ["read"],
  invoice: ["read"],
  settings: ["read"],
})

export const viewerRole = ac.newRole({
  project: ["read"],
  report: ["read"],
  member: ["read"],
  invoice: ["read"],
  settings: ["read"],
})

// Example custom role — users can create these at runtime via dynamicAccessControl
// This is just a static example; runtime roles are stored in DB
export const contractorRole = ac.newRole({
  project: ["read", "update"],
  report: ["create", "read"],
  member: ["read"],
  invoice: ["read"],
})
```

### Step 2: Better Auth Server Instance

#### `packages/auth/src/server/auth.ts`

```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { twoFactor } from "better-auth/plugins"
import { apiKey } from "@better-auth/api-key"
import {
  ac,
  ownerRole,
  adminRole,
  memberRole,
  viewerRole,
} from "../access/roles"
import { db } from "./db" // your Drizzle/Prisma instance

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    // ── User-level global roles (SUPER_ADMIN, USER, etc.) ──────────────
    admin({
      ac,
      roles: {
        admin: adminRole,
        user: memberRole,
      },
      // Users can have multiple roles stored comma-separated in DB
    }),

    // ── Org-scoped roles + dynamic custom role creation ──────────────
    organization({
      ac,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        member: memberRole,
        viewer: viewerRole,
      },

      // ✅ Dynamic Access Control — users can create custom roles at runtime
      // Stored in `organizationRole` table in DB
      dynamicAccessControl: {
        enabled: true,
        maximumRolesPerOrganization: async (organizationId) => {
          // Can be dynamic based on plan
          return 20
        },
      },

      // Control who can create orgs
      allowUserToCreateOrganization: true,

      // Invitation email setup (required for invitations to work)
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.APP_URL}/accept-invitation/${data.id}`
        // send email with inviteLink
      },

      // Teams within orgs
      teams: {
        enabled: true,
        maximumTeams: 10,
      },

      // Lifecycle hooks
      organizationHooks: {
        afterCreateOrganization: async ({ organization, user }) => {
          // e.g. create default project, seed data
        },
        beforeAddMember: async ({ user, organization }) => {
          // e.g. check seat limits
        },
      },
    }),

    // ── 2FA ───────────────────────────────────────────────────────────
    twoFactor(),

    // ── Machine-to-machine API Keys ──────────────────────────────────
    apiKey({
      // User-owned keys
    }),
    apiKey([
      {
        configId: "org-keys", // Org-owned keys
        defaultPrefix: "org_",
        references: "organization",
      },
    ]),
  ],
})

export type Auth = typeof auth
```

### Step 3: NestJS Setup

#### `apps/api/src/main.ts`

```typescript
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // ⚠️ Required — docs explicitly state this for Better Auth
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

#### `apps/api/src/app.module.ts`

```typescript
import { Module } from "@nestjs/common"
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { CaslModule } from "nest-casl"
import { auth } from "@myapp/auth/server" // from your shared package
import { Roles } from "@myapp/auth/access" // your Roles enum

@Module({
  imports: [
    // Better Auth — registers global AuthGuard
    // All routes are protected by default
    AuthModule.forRoot({ auth }),

    // CASL — registers AccessGuard, CaslConditions, CaslSubject decorators
    CaslModule.forRoot<Roles>({
      superuserRole: Roles.SuperAdmin,
      getUserFromRequest: (request) => request.user, // user set by AuthGuard
    }),
  ],
})
export class AppModule {}
```

#### `apps/api/src/projects/projects.controller.ts`

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common"
import {
  Session,
  UserSession,
  AllowAnonymous,
} from "@thallesp/nestjs-better-auth"
import { UseGuards } from "@nestjs/common"
import { AccessGuard, UseAbility, Actions, CaslConditions } from "nest-casl"
import { ProjectHook } from "./project.hook"
import { Project } from "./project.entity"

@Controller("projects")
export class ProjectsController {
  // Public route — no auth needed
  @Get("public")
  @AllowAnonymous()
  getPublic() {
    return []
  }

  // Auth required (global guard), no ability check
  @Get()
  findAll(@Session() session: UserSession) {
    return []
  }

  // Auth + CASL ability check
  @Post()
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Project)
  create(@Body() dto: CreateProjectDto) {}

  // Auth + CASL + ownership check via hook
  @Put(":id")
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Project, ProjectHook) // hook loads the subject
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto) {}

  // Conditions usable for DB query filtering
  @Get("mine")
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Project)
  findMine(@CaslConditions() conditions: any) {
    // conditions becomes a Prisma/Drizzle where clause via @casl/prisma
    return this.projectService.findAll(conditions)
  }
}
```

#### `apps/api/src/projects/project.hook.ts`

```typescript
import { Injectable } from "@nestjs/common"
import { SubjectBeforeFilterHook, Request } from "nest-casl"
import { Project } from "./project.entity"
import { ProjectsService } from "./projects.service"

// Loads the actual project from DB before the CASL guard checks ownership
@Injectable()
export class ProjectHook implements SubjectBeforeFilterHook<Project, Request> {
  constructor(private projectsService: ProjectsService) {}

  async run({ params }: Request) {
    return this.projectsService.findById(params.id)
  }
}
```

### Step 4: CASL Ability Factory (Isomorphic)

#### `packages/auth/src/ability/factory.ts`

```typescript
import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
  subject,
} from "@casl/ability"

export type AppActions =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "manage" // wildcard
  | "publish"
  | "archive"
  | "approve"
  | "export"

export type AppSubjects =
  | "Project"
  | "Report"
  | "Member"
  | "Invoice"
  | "Settings"
  | { __typename: string; [key: string]: any }
  | "all"

export type AppAbility = MongoAbility<[AppActions, AppSubjects]>

export interface AbilityUser {
  id: string
  role: string // global role from admin plugin (comma-separated)
  organizationId?: string
  organizationRole?: string // role in active org (from session)
}

export function defineAbilityFor(user: AbilityUser): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  )

  const globalRoles = user.role?.split(",") ?? []
  const orgRoles = user.organizationRole?.split(",") ?? []
  const allRoles = [...new Set([...globalRoles, ...orgRoles])]

  // ── Global roles (from admin plugin) ──────────────────────────────
  if (allRoles.includes("admin") && !user.organizationId) {
    // Super admin context
    can("manage", "all")
  }

  // ── Org-scoped roles ───────────────────────────────────────────────
  if (allRoles.includes("owner")) {
    can("manage", "all")
  }

  if (allRoles.includes("admin")) {
    can(["create", "read", "update", "delete"], "Project")
    can(["create", "read", "update", "delete"], "Report")
    can(["create", "read", "update"], "Member")
    can(["create", "read", "update", "approve"], "Invoice")
    can(["read", "update"], "Settings")
  }

  if (allRoles.includes("member")) {
    can(["create", "read"], "Project")
    can(["create", "read"], "Report")
    can("read", "Member")
    can("read", "Invoice")
    // Ownership-based: can update their own projects
    can("update", "Project", { ownerId: user.id })
    can("delete", "Project", { ownerId: user.id })
  }

  if (allRoles.includes("viewer")) {
    can("read", ["Project", "Report", "Member", "Invoice", "Settings"])
  }

  // ── Always: users manage their own profile ─────────────────────────
  can(["read", "update"], "Member", { userId: user.id })

  return build({
    detectSubjectType: (item: any) => item.__typename,
  })
}
```

#### `packages/auth/src/ability/permissions.ts` (nest-casl format)

```typescript
import { Permissions, Actions } from "nest-casl"
import { AppSubjects } from "./types"
import { Roles } from "../access"

// This is the nest-casl permissions map — used in each NestJS feature module
export const projectPermissions: Permissions<Roles, AppSubjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, "Project")
  },
  member({ user, can }) {
    can(Actions.create, "Project")
    can(Actions.update, "Project", { ownerId: user.id }) // ownership condition
  },
  admin({ can, extend }) {
    extend(Roles.Member)
    can(Actions.manage, "Project")
    cannot(Actions.delete, "Project") // admins can't delete, only owners can
  },
  owner({ can }) {
    can(Actions.manage, "Project")
  },
}
```

### Step 5: Web Client (Next.js)

#### `packages/auth/src/client/web.ts`

```typescript
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"
import { twoFactorClient } from "better-auth/client/plugins"
import { apiKeyClient } from "@better-auth/api-key/client"
import {
  ac,
  ownerRole,
  adminRole,
  memberRole,
  viewerRole,
} from "../access/roles"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    organizationClient({
      ac, // ⚠️ Must be the actual uncast object, not a type assertion
      roles: {
        owner: ownerRole,
        admin: adminRole,
        member: memberRole,
        viewer: viewerRole,
      },
      dynamicAccessControl: { enabled: true },
    }),
    adminClient({
      ac, // ⚠️ Same — literal types must be preserved for TS inference
      roles: { admin: adminRole, user: memberRole },
    }),
    twoFactorClient(),
    apiKeyClient(),
  ],
})

export const { useSession, signIn, signOut, signUp } = authClient
```

**CASL React context for web:**

```typescript
// packages/auth/src/ability/react.tsx
import { createContext, useContext } from "react"
import { createContextualCan } from "@casl/react"
import { AppAbility, defineAbilityFor } from "./factory"
import { useSession } from "../client/web"

export const AbilityContext = createContext<AppAbility>(undefined!)
export const Can = createContextualCan(AbilityContext.Consumer)

export function useAbility() {
  return useContext(AbilityContext)
}

// Wrap in provider at root:
// <AbilityContext.Provider value={defineAbilityFor(session.user)}>
```

**Usage in React:**

```tsx
import { Can } from "@myapp/auth/ability/react";

// Declarative UI gating — no round-trip to server needed
<Can I="delete" a="Project">
  <DeleteButton />
</Can>

<Can I="create" a="Invoice">
  <CreateInvoiceButton />
</Can>
```

### Step 6: Expo Client

#### `packages/auth/src/client/native.ts`

```typescript
// ⚠️ Expo DOES NOT use better-auth/react-native (doesn't exist)
// Uses @better-auth/expo package + babel config aliases

import { createAuthClient } from "better-auth/client"
import { expoClient } from "@better-auth/expo/client"
import { organizationClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"
import {
  ac,
  ownerRole,
  adminRole,
  memberRole,
  viewerRole,
} from "../access/roles"

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "myapp", // your app's deep link scheme
      storagePrefix: "myapp",
    }),
    organizationClient({
      ac,
      roles: {
        owner: ownerRole,
        admin: adminRole,
        member: memberRole,
        viewer: viewerRole,
      },
      dynamicAccessControl: { enabled: true },
    }),
    adminClient({
      ac,
      roles: { admin: adminRole, user: memberRole },
    }),
  ],
})
```

**Required Babel config (Expo SDK 55+, New Architecture only):**

```javascript
// apps/mobile/babel.config.js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "better-auth/react":
              "./node_modules/better-auth/dist/client/react/index.mjs",
            "better-auth/client/plugins":
              "./node_modules/better-auth/dist/client/plugins/index.mjs",
            "@better-auth/expo/client":
              "./node_modules/@better-auth/expo/dist/client.mjs",
          },
        },
      ],
    ],
  }
}
// After changes: npx expo start --clear
```

**Session in Expo — auto-cached in SecureStore by the expo plugin:**

```tsx
import { Text } from "react-native"
import { authClient } from "@myapp/auth/native"

export default function Index() {
  const { data: session } = authClient.useSession()
  return <Text>Welcome, {session?.user.name}</Text>
}
```

---

## Role Architecture: Two-Level System

Better Auth gives you two distinct role layers. Use both:

```
Level 1: Global roles (admin plugin)
         Scoped to: the entire application
         Roles: "admin" | "user"  (comma-separated in user.role column)
         Use for: SUPER_ADMIN vs regular user distinction
         Server check: auth.api.userHasPermission({ body: { userId, permissions } })

Level 2: Org-scoped roles (organization plugin)
         Scoped to: a specific organization
         Roles: "owner" | "admin" | "member" | "viewer" | <dynamic-custom>
         Use for: multi-tenant per-org permissions
         Server check: auth.api.hasPermission({ headers, body: { permissions } })
         Client check: authClient.organization.hasPermission({ permissions })
         Dynamic: authClient.organization.createRole({ role, permission, organizationId })
```

### Dynamic Custom Roles (from docs — organization plugin)

> **Theo playbook:** static vs custom roles, Workspace UI, and how every module should gate API + web UI — [org-roles-and-ui.md](./org-roles-and-ui.md).

```typescript
// Create a custom role at runtime (stored in organizationRole table)
await authClient.organization.createRole({
  role: "contractor", // unique name
  permission: {
    project: ["read", "update"],
    report: ["create", "read"],
  },
  organizationId: "org-id",
})

// Assign it to a member
await authClient.organization.updateMemberRole({
  role: ["contractor"], // can be array — multi-role support
  memberId: "member-id",
  organizationId: "org-id",
})

// Check permission (includes dynamic roles — must use API, not checkRolePermission)
const { data } = await authClient.organization.hasPermission({
  permissions: { project: ["update"] },
})

// ✅ checkRolePermission is synchronous/client-side only — does NOT include dynamic roles
// ❌ Do NOT use for dynamic role checks
const result = authClient.organization.checkRolePermission({
  permissions: { project: ["create"] },
  role: "admin",
})
```

---

## Package `package.json`

```json
{
  "name": "@myapp/auth",
  "dependencies": {
    "better-auth": "^1.6.0",
    "@better-auth/api-key": "^1.0.0",
    "@better-auth/expo": "^1.0.0",
    "@thallesp/nestjs-better-auth": "^1.0.0",
    "@casl/ability": "^7.0.0",
    "@casl/react": "^4.0.0",
    "@casl/prisma": "^1.4.0",
    "nest-casl": "^2.0.0"
  },
  "peerDependencies": {
    "@nestjs/common": ">=10",
    "react": ">=18",
    "react-native": ">=0.73"
  }
}
```

---

## Database Schema (What Better Auth Creates)

Run `npx auth generate` in your NestJS app to generate migration files for your ORM.

**Core tables (always):** `user`, `session`, `account`, `verification`

**`organization` plugin adds:**

- `organization` — org records
- `member` — org membership with `role` column (comma-separated, can be multi-role)
- `invitation` — pending invites
- `session` — gets `activeOrganizationId` + `activeTeamId` columns added

**`dynamicAccessControl: { enabled: true }` adds:**

- `organizationRole` — runtime-created roles with permissions JSON stored in DB

**`teams: { enabled: true }` adds:**

- `team`, `teamMember`

**`@better-auth/api-key` adds:**

- `apiKey` — hashed keys with `referenceId`, permissions, rate limiting columns

---

## Serverless / multi-instance session model

Theo keeps Mongo (`mongodbAdapter`) because `organization`, `admin`, `twoFactor`, and `apiKey` need durable tables. Fully DB-less mode is not used.

**Recommended BA setup (what we ship):**

1. **`secondaryStorage`** — official `@better-auth/redis-storage` + `@workspace/redis` (`REDIS_URL`). Sessions and short-lived auth data live in Redis (fast across instances / cold starts).
2. **`session.storeSessionInDatabase: true`** — also write sessions to Mongo so data survives Redis flush.
3. **No `cookieCache`** — BA org `create` updates `activeOrganizationId` in storage but does not refresh the browser `session_data` cookie. Cookie cache would serve a stale session until expiry. Redis already avoids a Mongo hit per `getSession`.

Hosting notes: run Redis (`docker compose` service `redis`). Prefer pooled Mongo (Atlas). Cloudflare Workers need `nodejs_compat`. Do not add a custom JWT bearer layer — cookie sessions are the supported path for Nest `/v1` routes.

Auth abuse protection: Better Auth `rateLimit` (Redis secondary storage) covers `/api/auth/*`. Nest's IP rate limiter skips those paths on purpose.

---

## Edge Cases (Validated)

| Edge Case                                           | Correct Solution                                                                                                                                                                                                 |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-role user**                                 | Better Auth stores multiple roles as comma-separated string. Split on `,` before checking.                                                                                                                       |
| **Dynamic role not found in `checkRolePermission`** | Expected — `checkRolePermission` is synchronous and static only. Use `hasPermission` API for dynamic roles.                                                                                                      |
| **`ac` types erased on client**                     | Define `ac` + `roles` in a client-safe shared file. Never import from a server-only module. Never cast them.                                                                                                     |
| **Expo New Architecture required**                  | `@better-auth/expo` requires SDK 55 + New Architecture. Legacy arch not supported.                                                                                                                               |
| **NestJS body parser conflict**                     | Set `bodyParser: false` in `NestFactory.create`. Better Auth handles body parsing.                                                                                                                               |
| **Serverless cold start**                           | Redis secondary storage for sessions + pooled Mongo. Avoid cookieCache with org create until BA refreshes `session_data`.                                                                                        |
| **ABAC (ownership checks)**                         | Better Auth can't do this natively. Use CASL conditions: `can('update', 'Project', { ownerId: user.id })`.                                                                                                       |
| **Client-side UI gating**                           | Use CASL `<Can>` component. Zero server round-trip. Isomorphic in Expo too.                                                                                                                                      |
| **Org data isolation**                              | Always extract `organizationId` from verified session (not from request body). Use as scope on all DB queries.                                                                                                   |
| **Admin plugin dynamic roles**                      | Not supported (open GitHub issue #4557). Admin plugin roles are static/code-defined only. Dynamic roles = organization plugin only.                                                                              |
| **API Key auth for NestJS routes**                  | **Not enabled.** Org-owned Better Auth API keys (`org_` prefix) are managed in the UI for BA api-key features only. Nest `/v1` routes require cookie sessions. Do not send `x-api-key` expecting a Nest session. |
| **SSO for enterprise orgs**                         | Better Auth has `sso()` plugin (enterprise feature). Fixed SSO SSRF vulnerability in v1.6 — ensure you're on latest.                                                                                             |
| **Token secret rotation**                           | Use `BETTER_AUTH_SECRETS` (plural, comma-separated) env var — docs confirm rolling without invalidating existing sessions.                                                                                       |

---

## Summary: What Each Library Owns

```
Better Auth    → Token issuance, session lifecycle, OAuth flows, 2FA,
                 email/password, passkeys, API keys, org CRUD,
                 RBAC (static predefined roles), RBAC (dynamic runtime roles),
                 invitation flow, team management, user admin

CASL v7        → ABAC (attribute/ownership conditions), isomorphic permission
                 checking in React + Expo + NestJS guards, Prisma query
                 filtering from rules, client-side <Can> UI gating

nest-casl      → NestJS wiring: CaslModule, AccessGuard, @UseAbility decorator,
                 subject hooks, CaslConditions for query filtering

@thallesp/     → NestJS wiring: AuthModule, global AuthGuard,
nestjs-better  → @Session() decorator, @AllowAnonymous(), @OptionalAuth()
-auth
```

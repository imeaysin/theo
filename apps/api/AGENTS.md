# API app — agent guide

NestJS 11 REST API with Better Auth sessions, MongoDB, and Light-CQRS feature modules.

## Module structure (copy from `notes`)

```
modules/<feature>/
  domain/             *.model.ts (Domain entities) + exceptions/
  dto/                create-[feature].dto.ts, update-[feature].dto.ts, etc.
  repository/         *.command.ts (writes) + *.query.ts (reads)
  listeners/          *.listener.ts (Cross-module events via event-emitter)
  <feature>.controller.ts   Ingress Routing & Delivery
  <feature>.service.ts      Workflow Orchestrator (No CQRS boilerplate)
  <feature>.module.ts       Dependency Providers
```

**Uploads** follows the same pattern with `StorageRepository` instead of Mongo.

**Health** and **Me** use a thin controller + service (no CQRS) — simple reads with no domain logic.

## Cross-cutting (`src/common/`)

| Path                          | Role                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `configure-app.ts`            | CORS, helmet, versioning, swagger (`cleanupOpenApiDoc`), signed local `/uploads` |
| `interceptors/`               | HTTP logging (with `requestId`), success envelope transform                      |
| `middleware/`                 | Request ID propagation, MongoDB-backed `/v1/*` rate limiting                     |
| `jobs/`                       | BullMQ job queue (Redis)                                                         |
| `realtime/`                   | Socket.IO gateway (session cookie auth, user rooms)                              |
| `filters/`                    | Global exception handler (machine-readable `code`)                               |
| `decorators/`                 | Re-exports from `@workspace/auth/nestjs` + OpenAPI error helpers                 |
| `exceptions/`                 | Base `DomainException` for throwing pure domain errors                           |
| `storage/storage.module.ts`   | `STORAGE` provider from `@workspace/storage`                                     |
| `database/database.module.ts` | Global `DATABASE_READY` + injectable Mongo connection                            |

## Auth

`WorkspaceAuthModule` from `@workspace/auth/nestjs` registers Better Auth
(`@thallesp/nestjs-better-auth`) with cookie sessions and org RBAC.

| Decorator / guard           | Purpose                                 |
| --------------------------- | --------------------------------------- |
| Global `AuthGuard`          | Session required by default             |
| `@AllowAnonymous()`         | Public route                            |
| `@Session()`                | Inject Better Auth session              |
| `@MemberHasPermission(...)` | Org RBAC via Better Auth access control |

Org-scoped routes must use `session.session.activeOrganizationId` (via
`requireActiveOrganizationId`) — never accept `organizationId` from query/body.

Notes are **per-member within an organization** (scoped by `organizationId` +
`userId`). `@MemberHasPermission` gates which roles can call the endpoint;
the repository still only returns/mutates that member’s notes.

For static vs **custom** org roles and how the web app should mirror these
guards, see [docs/org-roles-and-ui.md](../../docs/org-roles-and-ui.md).

CASL (`AccessGuard`, `@UseAbility`) is available from `@workspace/auth/nestjs`
for attribute-based checks when needed — not used on controllers yet.

`NestFactory.create(AppModule, { bodyParser: false })` is required for Better Auth.

## Testing

| Layer                      | Location                                    | Command                                     |
| -------------------------- | ------------------------------------------- | ------------------------------------------- |
| **Unit**                   | `test/unit/**/*.spec.ts`                    | `pnpm test`                                 |
| **E2E**                    | `test/e2e/**/*.e2e-spec.ts`                 | `pnpm test:e2e` (MongoDB required)          |
| **Integration (live API)** | `test/integration/**/*.integration-spec.ts` | `pnpm test:integration` with `pnpm dev:api` |

Authenticated flows use Better Auth session cookies (supertest agent), not JWTs.

## Adding an endpoint

1. Add Zod schema (+ `.meta()` / `.describe()` for Swagger) to `packages/contracts`.
2. Add `createZodDto` wrappers in the module `dto/` directory.
3. Create repository methods and orchestrate them in `*.service.ts`.
4. Wire service and repositories in module `providers`.
5. Expose via controller — `@Body() MyDto` validates automatically; add `@ApiAuthErrorResponses()` or `@ApiPublicErrorResponses()`.

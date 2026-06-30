# API app — agent guide

NestJS 11 REST API with Better Auth, MongoDB, and CQRS feature modules.

## Module structure (copy from `notes`)

```
modules/<feature>/
  commands/           *.command.ts + *.handler.ts
  queries/            *.query.ts + *.handler.ts  (when reads are non-trivial)
  notes.dto.ts       createZodDto wrappers (request + `{ data }` response envelopes)
  entities/           Domain types / DB document shape
  repositories/       Data access (Mongo, storage, etc.)
  <feature>.controller.ts   CommandBus / QueryBus only
  <feature>.module.ts       CqrsModule + handlers + repository
```

**Uploads** follows the same pattern with `StorageRepository` instead of Mongo.

## Cross-cutting (`src/common/`)

| Path                        | Role                                                                    |
| --------------------------- | ----------------------------------------------------------------------- |
| `configure-app.ts`          | CORS, helmet, versioning, swagger (`cleanupOpenApiDoc`), static uploads |
| `interceptors/`             | HTTP logging (`createLogger("HTTP")`), `{ data }` transform             |
| `filters/`                  | Global exception handler                                                |
| `decorators/`               | Re-exports auth decorators + `@Roles`                                   |
| `storage/storage.module.ts` | `STORAGE` provider from `@workspace/storage`                            |

## Testing

- **Unit:** `test/unit/**/*.spec.ts` — run via `pnpm test` in this app.
- **E2e:** `test/e2e/**/*.e2e-spec.ts` — run via `pnpm test:e2e` (needs MongoDB).
- Shared setup: `test/jest-setup.ts`.

## Adding an endpoint

1. Add Zod schema (+ `.meta()` / `.describe()` for Swagger) to `packages/contracts`.
2. Add `createZodDto` wrapper in the module (e.g. `notes.dto.ts`).
3. Create command/query + handler + repository method.
4. Wire handler in module `providers`.
5. Expose via controller — `@Body() MyDto` documents and validates request bodies automatically.

Do not call repositories or storage directly from controllers.

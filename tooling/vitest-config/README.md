# @workspace/vitest-config

Shared [Vitest](https://vitest.dev) presets for the monorepo.

| Export | Use for |
|--------|---------|
| `@workspace/vitest-config/node` | `packages/*` (default), Node / Nest-style code |
| `@workspace/vitest-config/react` | `apps/web`, `apps/marketing` |

## Package

```ts
// vitest.config.ts
import node from "@workspace/vitest-config/node"

export default node
```

With path aliases:

```ts
import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, mergeConfig } from "vitest/config"
import node from "@workspace/vitest-config/node"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  node,
  defineConfig({
    resolve: {
      alias: {
        "@src": path.join(rootDir, "src"),
      },
    },
  }),
)
```

## App (React)

```ts
// vitest.config.ts
import react from "@workspace/vitest-config/react"

export default react
```

`apps/api` uses Jest today; these presets are for Vitest only.

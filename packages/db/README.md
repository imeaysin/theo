# @repo/db

The centralized database layer for **theo**, built with a multi-provider architecture to easily support different databases (like MongoDB and PostgreSQL).

## 🚀 Providers

### MongoDB (Default)

Currently, Mongoose is used as the primary data provider. All existing models, connections, and factories are located in `src/mongoose/`.
Since it's the primary provider, it is exported by default from this package.

### PostgreSQL (Example)

An example template for PostgreSQL (using Drizzle/pg) is located in `src/postgres/`.

## 🛠️ Usage

### Using MongoDB (Primary)

```typescript
import { connectDb, UserModel } from "@repo/db"

await connectDb(process.env.MONGODB_URI)
const users = await UserModel.find()
```

### Switching to PostgreSQL

If you decide to switch to PostgreSQL:

1. Implement your schemas in `src/postgres/schema.ts`.
2. Implement your connection logic in `src/postgres/connection.ts`.
3. Update `src/index.ts` to export from `./postgres` instead of `./mongoose` (or import directly from `@repo/db/postgres` if your config supports subpath exports).
4. Update your consuming applications (like `apps/api`) to use the new schemas and clients.

---

Part of the [theo](https://github.com/your-username/theo) starter template.

# @workspace/db

MongoDB connection for **theo**, via Mongoose.

## Usage

```typescript
import { connectDb, getDb } from "@workspace/db"

await connectDb()
```

`getDb()` and `getMongoClient()` expose the native MongoDB handle and client from the shared Mongoose connection (single pool per instance).

## Better Auth

Auth and business data share this connection. The MongoDB adapter creates collections on first use — no separate migration command is needed.

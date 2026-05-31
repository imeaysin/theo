# @repo/config

Centralized environment variable validation and management for the monorepo.

## 🚀 Purpose

This package ensures that all required environment variables are present and valid before the application starts. It uses **Zod** for schema validation and provides a type-safe `env` object that can be used across both backend and frontend (Next.js) environments.

## 🛠️ Usage

### Validation Schema

The schema is defined in `src/env.ts`. It includes both required and optional variables for:

- Database connectivity (MongoDB)
- Authentication (Better-Auth)
- External services (Resend, Google, GitHub)
- App configuration

### Accessing Env Vars

```typescript
import { env } from "@repo/config";

console.log(env.NEXT_PUBLIC_API_URL);
```

## 🏗️ Architecture

- **Automatic Root Loading**: Automatically finds and loads the `.env` file from the workspace root using a recursive search.
- **Build-time Defaults**: Provides safe defaults during the build phase to prevent CI/CD failures.
- **Strict Parsing**: Throws a clear error if validation fails, preventing the app from starting in an inconsistent state.

# @repo/api-client

A standardized, type-safe API communication layer for the codebase-x monorepo.

## 🚀 Purpose

This package provides a consistent way to interact with the backend API. It abstracts away the complexity of headers, base URLs, and response parsing, ensuring that all requests follow the same standard.

## 🛠️ Features

- **Typed Requests**: Fully integrated with `@repo/contracts` for Zod-validated request/response types.
- **Cross-Platform Support**: Works in browser (Web), Node.js (API/Main process), and Electron (Renderer).
- **Interceptors**: Pre-configured for authentication header injection and error handling.
- **Lightweight**: Minimal dependencies, optimized for both client and server usage.

## 🏗️ Usage

```typescript
import { createApiClient } from "@repo/api-client";

const client = createApiClient({
  baseUrl: "http://localhost:4000",
  getToken: () => "your-token",
});

// Fully typed request
const data = await client.get("/users/profile");
```

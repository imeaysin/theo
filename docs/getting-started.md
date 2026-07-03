# Getting started

1. **Clone** and install:

   ```bash
   git clone <repo-url> my-app && cd my-app
   pnpm setup   # copies .env.example → .env, installs, starts MongoDB
   ```

2. **Configure** root `.env` — set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`).

3. **Run** everything:

   ```bash
   pnpm dev
   ```

   The first run builds shared packages (`@workspace/auth`, `@workspace/contracts`, etc.) before starting apps.

| App        | URL                        |
| ---------- | -------------------------- |
| Web        | http://localhost:5173      |
| API + auth | http://localhost:4000      |
| Swagger    | http://localhost:4000/docs |
| Marketing  | http://localhost:3000      |

4. **Sign up** at the web app, then optionally seed demo notes:
   ```bash
   pnpm --filter api seed
   ```

See [env-reference.md](./env-reference.md) for all variables.

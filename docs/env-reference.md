# Environment reference

All apps read the **root** `.env` via `@workspace/config`. Copy from [`.env.example`](../.env.example).

## Required

| Variable             | Description                                 |
| -------------------- | ------------------------------------------- |
| `BETTER_AUTH_SECRET` | Min 32 chars — `openssl rand -base64 32`    |
| `BETTER_AUTH_URL`    | API base URL (e.g. `http://localhost:4000`) |
| `MONGODB_URI`        | MongoDB connection string                   |
| `ALLOWED_ORIGINS`    | Comma-separated CORS origins                |
| `CLIENT_URL`         | Web app URL (emails, redirects)             |

## Client (build-time)

| Variable                        | App       |
| ------------------------------- | --------- |
| `VITE_API_URL`, `VITE_AUTH_URL` | Web       |
| `NEXT_PUBLIC_*`                 | Marketing |
| `EXPO_PUBLIC_*`                 | Mobile    |

## Optional OAuth

`GOOGLE_*`, `GITHUB_*`, `APPLE_*`, `MICROSOFT_*`, `DISCORD_*` — leave blank to disable.

## Storage

| Variable             | Default                         | Notes                               |
| -------------------- | ------------------------------- | ----------------------------------- |
| `STORAGE_PROVIDER`   | `local`                         | `local` or `s3`                     |
| `STORAGE_LOCAL_PATH` | `./uploads`                     | API serves `/uploads` in local mode |
| `STORAGE_LOCAL_URL`  | `http://localhost:4000/uploads` | Public URL prefix                   |

## Email

| Variable         | Required | Notes                                                                    |
| ---------------- | -------- | ------------------------------------------------------------------------ |
| `RESEND_API_KEY` | No       | Leave empty in dev — links are logged to the API console (`[email:dev]`) |
| `EMAIL_FROM`     | No       | Defaults to `APP_NAME <no-reply@BETTER_AUTH_HOST>`                       |

Set `RESEND_API_KEY` in production for real email delivery.

## Observability (optional)

Disabled by default. Active only when the variable is set **and** `NODE_ENV=production`.

| Variable                      | App | Description                                    |
| ----------------------------- | --- | ---------------------------------------------- |
| `SENTRY_DSN`                  | API | Sentry error + performance monitoring          |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | API | OpenTelemetry trace export URL (OTLP/HTTP)     |
| `OTEL_SERVICE_NAME`           | API | Service name in traces (default: `api`)        |
| `VITE_SENTRY_DSN`             | Web | Sentry DSN for client-side errors (build-time) |

See `.env.example` for the full list.

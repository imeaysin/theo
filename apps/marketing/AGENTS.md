# Marketing landing template

Frontend-only Next.js 16 site for this monorepo template. Intentionally minimal
— one homepage that introduces the project as a starter for others to fork.

## Customize

- Brand, URLs, emails: `@workspace/config/public` (`productConfig`)
- Page copy & stack list: `app/page.tsx`

## Kept routes

`/` only

## Rules

- Do not add API routes, authentication, database code, or product backends.
- Build with `@workspace/ui` semantic tokens only (no raw colors).
- Apply `font-sans` on the document body (do not edit `packages/ui` globals).
- Prefer a single thin page over marketing section sprawl until you need it.

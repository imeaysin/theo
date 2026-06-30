# Web app — agent guide

Vite + React 19 + React Router 7 + TanStack Query.

## Route config (two files)

| File                   | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `config/routes.ts`     | App: `routeSegments` (router) + `routes` (Link / navigate) |
| `config/api-routes.ts` | API: versioned paths for `apiFetch()`                      |

**Do not hardcode path strings elsewhere.** Feature `routes.tsx` imports `routeSegments`; pages import `routes`.

## Adding a feature

1. Add segment under `routeSegments.app` in `config/routes.ts`
2. Add full URL to `routes` in the same file
3. Add `apiRoutes` entry in `config/api-routes.ts` if it calls the API
4. Create feature `routes.tsx` using `routeSegments`
5. Register in `app/router.tsx` and `config/app-navigation.ts`

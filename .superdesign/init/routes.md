# Routes

## Route Map

| Path | Route File | Component | Description |
|------|-----------|-----------|-------------|
| `/` | `frontend/src/routes/index.tsx` | `Home` from `@/pages/static/Home` | Blank black page with "TrueBuilder.ai" text |

Single route. No other pages exist.

## Router Configuration

```tsx
// frontend/src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

## Route Tree (Auto-generated)

```ts
// frontend/src/routeTree.gen.ts
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
```

## Root Route

```tsx
// frontend/src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => <Outlet />,
})
```

## Index Route

```tsx
// frontend/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import Home from '@/pages/static/Home'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'TrueBuilder.ai — AI-powered construction intelligence. The future is coming. Sign up for early access.',
      },
      {
        name: 'keywords',
        content: 'truebuilder, AI, construction, intelligence, building, future',
      },
      {
        property: 'og:title',
        content: 'TrueBuilder.ai — The Future Is Coming',
      },
      {
        property: 'og:description',
        content: 'AI-powered construction intelligence. Be the first to experience what\'s next.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
    ],
  }),
})
```

## Routing Pattern

- Uses TanStack Router with **file-based routing** (`routeTree.gen.ts` is auto-generated)
- `defaultPreload: 'intent'` enables preloading on hover/focus
- SEO meta tags are defined via the `head()` function on routes
- New routes are added by creating files in `frontend/src/routes/` (the route tree regenerates automatically)

## Deleted Routes (from original starter)

These were removed during the strip-down:
- `blog.$slug.tsx`, `blog.index.tsx`, `blog.new.tsx`, `blog.edit.$slug.tsx`
- `blog.category.$slug.tsx`, `blog.tag.$slug.tsx`, `blog.dashboard.tsx`
- `login.tsx`, `logout.tsx`, `signup.tsx`
- `ssr-test.tsx`

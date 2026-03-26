# Layouts

## Current State: No Shared Layouts

This app has no shared layout components. The header/nav/footer that existed in the original Django React Blog starter were removed during the strip-down to a blank landing page.

### Root Route

The root route is a bare `Outlet` with no wrapping layout:

```tsx
// frontend/src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => <Outlet />,
})
```

### Entry Point

The client entry renders only the router with no layout wrappers:

```tsx
// frontend/src/client.tsx
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const router = getRouter()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

### Implications for New Pages

- There is no shared header, footer, or navigation bar.
- Any layout wrapping (e.g., a landing page layout with a nav + footer) must be created from scratch.
- The `__root.tsx` is the natural place to add a shared layout if one is needed across all routes.
- Alternatively, route-specific layouts can be added as wrapper components inside individual page components.

### Existing CSS Layout Utilities

The global `index.css` defines a `.container` class with responsive padding:

```css
@layer components {
  .container {
    @apply mx-auto px-4;
  }
  @media (min-width: 640px) {
    .container {
      @apply px-6;
    }
  }
  @media (min-width: 1024px) {
    .container {
      @apply px-8;
    }
  }
}
```

### Available Animation Libraries

- `framer-motion` / `motion` v12.16.0 (installed in package.json)
- `tailwindcss-animate` (configured in tailwind.config.js)
- Custom keyframes: float-slow, float-medium, float-slower, float-slowest, pulse-slow, slide-right/left, accordion-down/up, scroll, marquee

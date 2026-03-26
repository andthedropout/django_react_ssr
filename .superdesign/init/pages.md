# Pages

## Page Inventory

There is exactly **one page**: the Home page at `/`.

## Home Page

**URL:** `/`
**File:** `frontend/src/pages/static/Home.tsx`

### Source Code

```tsx
// frontend/src/pages/static/Home.tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white text-sm">TrueBuilder.ai</p>
    </div>
  );
}
```

### Current State

A blank black fullscreen page with centered "TrueBuilder.ai" text in white, small size. No interactivity, no components, no imports beyond React implicit.

### Dependency Tree

```
client.tsx
  └── router.tsx (getRouter)
        └── routeTree.gen.ts (auto-generated)
              ├── routes/__root.tsx (bare Outlet)
              └── routes/index.tsx
                    └── pages/static/Home.tsx (the rendered component)
                          └── (no dependencies — zero imports)
```

### Route Definition

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

### SEO Meta Tags (already configured)

- **Description:** "TrueBuilder.ai -- AI-powered construction intelligence. The future is coming. Sign up for early access."
- **Keywords:** truebuilder, AI, construction, intelligence, building, future
- **OG Title:** "TrueBuilder.ai -- The Future Is Coming"
- **OG Description:** "AI-powered construction intelligence. Be the first to experience what's next."
- **OG Type:** website

### Page Convention

Pages live in `frontend/src/pages/` organized by category:
- `pages/static/` -- Static/marketing pages (currently only Home.tsx)

Routes live in `frontend/src/routes/` and import from pages. The route file handles routing config + SEO; the page file handles rendering.

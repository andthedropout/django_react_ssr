# Theme System

45 pre-built JSON themes shipped with the template. Each is a self-contained set of CSS variables (colors, fonts, radii, shadows) for both light and dark modes. The frontend picks one at boot and applies its CSS variables to `:root` (and `.dark` for dark mode).

## Quick start

1. Pick a theme name — see the list at the bottom of this file.
2. Set it in `.env`:
   ```bash
   VITE_FRONTEND_THEME=cyberpunk
   ```
3. Restart the frontend (`bin/dev` or `docker compose --profile prod up --build`).

That's it. The theme is fetched from `/static/themes/{name}.json` at boot via `useTheme()` (in `frontend/src/hooks/useTheme.ts`).

## How it works

```
design-system/themes/{name}.json    ← canonical source (this folder)
        │
        │  served by Django staticfiles + nginx at /static/themes/
        ↓
useTheme() in the React app fetches the JSON, applies CSS vars to :root,
toggles `.dark` on document.documentElement based on user/system preference,
preloads any Google Fonts the theme references (via useDynamicFonts).
```

Each theme JSON drives:
- **Color tokens** for both `light` and `dark` modes
- **Font families** (sans / serif / mono — fetched from Google Fonts at boot if non-system)
- **Border radii** + **shadow tokens**
- All values flow through Tailwind 4's `@theme {}` block in `frontend/src/index.css` — your component classes (`bg-primary`, `text-foreground`, `shadow-md`, etc.) automatically respect the active theme.

No backend involvement. No AI generation. Just static JSON files a developer chooses from.

## Theme JSON shape

```json
{
  "theme_name": "my-theme",
  "display_name": "My Theme",
  "cssVars": {
    "theme": {
      "font-sans":  "Inter, sans-serif",
      "font-serif": "Georgia, serif",
      "font-mono":  "JetBrains Mono, monospace",
      "radius":     "0.5rem"
    },
    "light": {
      "background":              "oklch(1 0 0)",
      "foreground":              "oklch(0.15 0 0)",
      "primary":                 "oklch(0.6 0.2 280)",
      "primary-foreground":      "oklch(1 0 0)",
      "secondary":               "oklch(0.96 0.005 270)",
      "secondary-foreground":    "oklch(0.2 0.02 280)",
      "muted":                   "oklch(0.96 0 0)",
      "muted-foreground":        "oklch(0.5 0 0)",
      "accent":                  "oklch(0.95 0.02 280)",
      "accent-foreground":       "oklch(0.2 0.02 280)",
      "destructive":             "oklch(0.65 0.25 25)",
      "destructive-foreground":  "oklch(1 0 0)",
      "border":                  "oklch(0.92 0 0)",
      "input":                   "oklch(0.92 0 0)",
      "ring":                    "oklch(0.6 0.2 280)",
      "card":                    "oklch(1 0 0)",
      "card-foreground":         "oklch(0.15 0 0)",
      "popover":                 "oklch(1 0 0)",
      "popover-foreground":      "oklch(0.15 0 0)",
      "shadow":                  "0 1px 2px rgba(0,0,0,0.05)"
      // ... chart-1..5, sidebar-* etc. (see vercel.json for the canonical full list)
    },
    "dark": {
      // same keys, dark-mode values
    }
  }
}
```

Use OKLCH color space for all colors — Tailwind 4's `@theme` block expects bare OKLCH values (the `oklch(...)` wrapper is stripped at runtime so Tailwind opacity modifiers like `bg-primary/50` work).

## Adding a new theme

1. Drop `my-theme.json` into this folder. Match the structure of an existing one — copy `vercel.json` as a starting point.
2. Set `VITE_FRONTEND_THEME=my-theme` in `.env`.
3. Restart the frontend.

No code changes needed. The file is auto-served at `/static/themes/my-theme.json`.

## Switching themes at runtime (per-user)

Currently the active theme is set via `VITE_FRONTEND_THEME` and applied at boot for all users. To support per-user theme switching:

1. Add a state setter to `useTheme()` and persist the choice (e.g. localStorage).
2. Update the fetch URL to use the user's choice instead of `import.meta.env.VITE_FRONTEND_THEME`.
3. Provide a UI selector that calls the setter.

Out of scope for the starter — add per-project as needed.

## All 45 themes shipped

```
amber-minimal      caffeine            cosmic-night        graphite
amethyst-haze      candyland           cyberpunk           kodama-grove
bold-tech          catppuccin          doom-64             midnight-bloom
bubblegum          claude              elegant-luxury      mocha-mousse
clean-slate        ghibli-studio       modern-minimal      mono
claymorphism       nature              neo-brutalism       northern-lights
notebook           ocean-breeze        pastel-dreams       perpetuity
popstar            quantum-rose        retro-arcade        solar-dusk
starry-night       sunset-horizon      supabase            t3-chat
tangerine          twitter             vercel              vintage-paper
```

Browse them in [tweakcn.com](https://tweakcn.com) — the JSON format here matches their export schema.

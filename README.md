# Django + React + Real SSR Starter

A lean, modern, opinionated scaffold for shipping production SaaS. **Django REST API** behind a **React 19 + TanStack Start** frontend with **real server-side rendering** via Bun, fronted by nginx, themable via shadcn/ui + a baked-in design system (45+ themes).

```
nginx (host port)  ┬─→  ssr      (Bun: TanStack Start renders React server-side)
                   ├─→  web      (Django + gunicorn — REST API + admin)
                   └─→  /static/ (long-cache assets baked into the nginx image)

           postgres + redis sit on the docker network, never exposed to host
```

This template is **production-ready out of the box**: real SSR (verified by curl), uv for fast Python installs, BuildKit cache mounts, log rotation that won't fill your disk, healthcheck-gated startup, conflict-free auto-port assignment, and a clean three-container split that scales each concern independently.

---

## Quick start (60 seconds)

```bash
git clone https://github.com/andthedropout/django_react_ssr  my_project
cd my_project
bin/setup
```

`bin/setup` creates `.env`, picks **conflict-free host ports** based on your project name (so 12 clones of this template don't all fight over `:8002`), builds the prod stack, runs migrations, and prints your URL.

> Default admin: `admin` / `changeme` — change `DJANGO_SUPERUSER_*` in `.env` before deploying anywhere.

**Verify SSR is real** after setup:
```bash
curl -s http://localhost:$WEB_PORT/ | grep '<h1>'
# → <h1 class="...">Django + React, with SSR baked in.</h1>
# (rendered HTML in the response = real server rendering, not just a CSR shell)
```

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | Django **5.2 LTS** | Security patches through April 2028 |
| API | DRF 3.17 | OpenAPI schema generation, mature ecosystem |
| Database | Postgres 17 (alpine) | Best free OLTP DB, JSON+full-text built in |
| Cache/queue | Redis 7.4 (alpine), optional | Set `REDIS_URL` in `.env` to enable |
| Background tasks | Celery 5.6, optional | Workers run via the `celery` compose profile |
| Python | **3.13-slim** + uv 0.11 | Fast cold-start, fast installs |
| Frontend | React **19** + TanStack Start | File-based routing with real SSR |
| Build | Vite 7 + Bun 1.x | Fast HMR in dev, Bun runs SSR in prod |
| Styling | Tailwind **4** + shadcn/ui | CSS-first config, composable primitives |
| Themes | 45 JSON files in `design-system/themes/` | Pick one with `VITE_FRONTEND_THEME` |
| WSGI | gunicorn 25 | Battle-tested, handles SIGTERM cleanly |
| Static | nginx 1.28 (unprivileged) | Non-root, `-60 MB` vs stock alpine |

---

## Two ways to run

### Production stack (default — what `bin/setup` uses)
```bash
docker compose --profile prod up --build -d
open http://localhost:$WEB_PORT     # nginx → ssr (real SSR) + django (API)
```

### Dev mode (Vite HMR + Django --reload, no SSR/nginx)
Fastest iteration. Vite serves the client with hot reload, Django runs with `--reload`. SSR is skipped in dev — view it via the prod profile when you need to verify.
```bash
bin/dev                              # = docker compose --profile dev up
open http://localhost:$VITE_PORT     # Vite dev server
```

---

## Renaming for a new project

The project name is the **single source of truth** for Docker volume names, the Celery app name, and session/CSRF cookie names. Change it in **one place** and the rest follows.

```bash
bin/rename-project my_app MyApp
```

This rewrites `COMPOSE_PROJECT_NAME`, `POSTGRES_USER`, `POSTGRES_DB` in `.env` plus any other lingering literal references. `bin/setup` calls this automatically if you say yes when it asks.

---

## Port conflicts (running multiple clones)

Each clone gets its own ports via `bin/pick-ports`, which:
1. Picks a **deterministic base port** from a hash of `COMPOSE_PROJECT_NAME` (so the same project always lands on the same ports)
2. Falls back to the next free port if the base is taken
3. Writes `WEB_PORT`, `DJANGO_PORT`, `VITE_PORT` to `.env`

Run any time:
```bash
bin/pick-ports          # only reassign ports that are currently bound
bin/pick-ports --force  # reassign all of them
```

Postgres and Redis are **never** exposed to the host — they only talk over the Docker network.

---

## Layout

```
backend/
  config/         # settings, urls, gunicorn config, auth views, celery, asgi/wsgi
  users/          # custom user app + create_default_superuser cmd
  up/             # /up health check (with retry-aware DB ping)
  templates/      # SPA shell + admin overrides
frontend/
  src/
    routes/       # TanStack Router file-based routes (SSR by default)
    pages/        # Page components imported by routes
    components/   # ui/ (shadcn), layout/, custom
    hooks/        # useTheme, useAuth, useDynamicFonts, use-toast
    api/          # API client modules (add per feature)
    server.ts     # SSR fetch handler (delegates to TanStack Start's server-entry)
    client.tsx    # Client hydration entry — hydrates document with <StartClient />
    router.tsx    # createRouter() factory used by both client + server
    routeTree.gen.ts  # generated by TanStack Start vite plugin
  vite.config.js  # tanstackStart plugin + nitro({ preset: 'bun' })
  # Note: no index.html — TanStack Start renders the entire <html> from __root.tsx
design-system/    # Theme JSON + backgrounds (drop a *.json, set VITE_FRONTEND_THEME, done)
public/           # Static assets bundled into the nginx image at build time
bin/              # setup, dev, rename-project, pick-ports, docker-entrypoint-web, ...
Dockerfile        # Multi-target: web | ssr | nginx (one source, three lean images)
compose.yaml      # Profiles: prod | dev | postgres | redis | celery | beat | worker
nginx.conf        # Reverse proxy: /api,/admin,/up,/media → web; /static → cache; rest → ssr
CLAUDE.md         # Project guidance for Claude Code (and similar coding assistants)
MIGRATION.md      # Step-by-step guide for forks of older versions to apply these wins
```

---

## Adding things

### A new page (SSR by default)
1. Create `frontend/src/pages/MyPage.tsx`
2. Create `frontend/src/routes/my-page.tsx`:
   ```tsx
   import { createFileRoute } from '@tanstack/react-router';
   import MyPage from '@/pages/MyPage';
   export const Route = createFileRoute('/my-page')({
     loader: async () => ({ /* server-side data */ }),
     component: MyPage,
   });
   ```
3. Visit `/my-page`. Vite regenerates `routeTree.gen.ts` in dev. The route is **server-rendered by default** — `curl http://localhost:$WEB_PORT/my-page` will return the rendered HTML.

### A new shadcn component
```bash
docker compose --profile dev exec js bunx shadcn@latest add tooltip
```
Lands in `frontend/src/components/ui/`. (Note: the package is `shadcn`, not the deprecated `shadcn-ui`.)

### A new Django app
```bash
docker compose --profile prod exec web python manage.py startapp my_app
```
Add it to `INSTALLED_APPS` in `backend/config/settings.py` and include its URLs in `backend/config/urls.py` under `api_patterns`.

### A new theme
Drop `my-theme.json` into `design-system/themes/` (match the shape of an existing one — see `design-system/themes/README.md`). Set `VITE_FRONTEND_THEME=my-theme` in `.env`. Done — the theme is auto-served at `/static/themes/my-theme.json` and picked up by `useTheme()`.

---

## Useful commands

```bash
docker compose --profile prod up --build -d   # rebuild & start prod stack
docker compose --profile dev  up              # dev with HMR
docker compose logs -f                        # tail logs (capped at 30MB/file × 3)
docker compose down                           # stop everything
docker compose --profile prod exec web python manage.py <cmd>     # any manage.py command
docker compose --profile prod exec web python manage.py createsuperuser
docker compose --profile prod exec web bash   # shell in the web container
bin/pick-ports --force                        # reassign host ports
bin/rename-project new_name NewName           # rename the whole project
```

---

## What you get vs other Django + React templates

| Concern | What we did | Result |
|---|---|---|
| **Real SSR** | TanStack Start native build with proper server bundle | curl returns rendered HTML, not an empty `<div id="root">` |
| **Build speed** | uv + BuildKit cache mounts + `.dockerignore` | ~10 sec warm rebuilds (was 30-90 sec) |
| **Disk hygiene** | Local logging driver capped at 30 MB × 3 per service | `~270 MB` ceiling instead of unbounded GBs |
| **Container split** | Three single-purpose images (nginx / ssr / web) | Independently scalable; each container has one process |
| **RAM** | gunicorn alone in `web`; Bun alone in `ssr`; nginx alone | `~165 MiB` total at idle (was `~547 MiB`) |
| **Port conflicts** | `bin/pick-ports` hashes project name → unique ports | Multiple clones don't fight over `:8002` |
| **Healthcheck races** | postgres + redis healthchecks gate `web` startup | No more "Django can't connect to postgres" cold-boot failures |
| **Modern stack** | Python 3.13, Django 5.2 LTS, React 19, Tailwind 4 | Future-facing, not technical debt at clone time |

---

## Production deploy

The three images (`web`, `ssr`, `nginx`) are independently buildable and deployable. Two patterns:

- **Single host (Compose / Docker Swarm):** ship all three, expose nginx on 80/443.
- **Platform (Railway / Fly / Render / K8s):** deploy `web` and `ssr` as separate services and let the platform's HTTP router do what nginx does locally. Drop the nginx container; serve static assets from a CDN or directly from the SSR container.

`backend/config/settings.py` already trusts `X-Forwarded-Proto` and accepts `RAILWAY_PUBLIC_DOMAIN` for CSRF.

---

## Slimming an existing fork of this template

If you originally cloned an older heavier version of this template, see [**MIGRATION.md**](MIGRATION.md) for a tiered, **purely additive** guide to applying these wins to your existing project without losing any of your code.

The migration doc covers infra wins (Tier 1-3) and runtime/package upgrades (Tier 4) with explicit "when to hold" guidance for mature projects with technical debt.

---

## License

MIT — see [LICENSE](LICENSE).

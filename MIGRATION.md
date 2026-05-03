# Migrating an existing fork

If you forked an older heavyweight version of this template, you don't need to gut anything to get most of the speed/disk/RAM wins. **Every change in this document is purely additive** — your existing apps, deps, models, and features keep working exactly as they did. Apply in any order, skip anything that doesn't fit.

The three pain points this guide fixes:
1. **You have to `docker prune` constantly** — fixed by capping log file growth and switching to a build cache that GC's itself
2. **Builds are slow** — fixed by `uv`, BuildKit cache mounts, and a proper `.dockerignore`
3. **High RAM at idle / hard to scale individual concerns** — partial fix in Tier 1, full fix in Tier 3 (splitting containers)

Each section is tagged: **🟢 Safe** (drop in, zero risk) · **🟡 Careful** (requires reading + light testing) · **🔴 Structural** (real refactor)

---

## Tier 1 — Quick wins (10 minutes, zero risk)

These are the changes you should make first. They give you 80% of the benefit and break nothing.

### 🟢 1. Add a `.dockerignore` (single biggest build-speed win)

If you don't have one, every `docker build` uploads your entire repo (including `.git`, `node_modules`, `.vite-cache`, `media/`, etc.) to the Docker daemon. **Often hundreds of MB of garbage per build.**

Create `.dockerignore` at the repo root:

```
.git
.gitignore
.github
__pycache__
*.py[cod]
.venv
venv
*.egg-info
.pytest_cache
.coverage
node_modules
.npm
.eslintcache
*.tsbuildinfo
.vite
.vite-cache
frontend/node_modules
frontend/dist
frontend/.tanstack
public_collected
staticfiles
media
db.sqlite3
*.log
.env
.env.local
.env.*.local
.mcp.json
.idea
.vscode
.DS_Store
*.swp
README.md
MIGRATION.md
LICENSE
```

**Impact**: build context drops from ~250 MB to ~10 MB. Builds **30-50% faster** wall-clock just from this.

### 🟢 2. Cap log file growth (the big `docker prune` fix)

The default `json-file` log driver has **no rotation**. Logs accumulate forever in `/var/lib/docker/containers/*/`. Over weeks of dev work this is GBs and is the #1 reason you keep needing to `docker system prune`.

In your `compose.yaml`, add a top-level shared logging config:

```yaml
x-logging: &default-logging
  driver: "local"            # auto-rotates; bounded by default
  options: { max-size: "10m", max-file: "3" }
```

Then add `logging: *default-logging` to **every service** (or merge it into your existing `x-` anchor). Example:

```yaml
services:
  web:
    image: ...
    logging: *default-logging   # ← add this line
  postgres:
    image: postgres:17.1-alpine
    logging: *default-logging   # ← add this line
```

**Impact**: log files capped at `10m × 3 files = 30 MB per service`. For a typical 6-service stack: **~180 MB hard ceiling** instead of unbounded GBs. This alone may eliminate your need to `docker system prune` weekly.

### 🟢 3. Switch your Dockerfile from `pip` to `uv`

`uv` (from Astral, the Ruff people) is a drop-in pip-compatible installer written in Rust. **5-10× faster**, slightly smaller resulting image, no behavior change.

Find your Dockerfile's pip install step (probably looks like `RUN pip install -r requirements.txt`). Replace with:

```dockerfile
# At the top of your build stage:
FROM python:3.12-slim-bookworm AS build
ENV UV_LINK_MODE=copy UV_COMPILE_BYTECODE=1

# Replace your pip install with uv. The uv binary is mounted from a tiny image —
# never lives in your final image.
COPY requirements.txt .
RUN --mount=from=ghcr.io/astral-sh/uv:0.5,source=/uv,target=/usr/local/bin/uv \
    --mount=type=cache,target=/root/.cache/uv,sharing=locked \
    uv pip install --system -r requirements.txt
```

**The two `--mount` lines do the work:** the first borrows the `uv` binary just for this RUN (no bloat), the second persists uv's download cache across builds (huge speedup on rebuilds).

If you use a multi-stage wheel build, do the same swap on `pip wheel`:

```dockerfile
RUN --mount=from=ghcr.io/astral-sh/uv:0.5,source=/uv,target=/usr/local/bin/uv \
    --mount=type=cache,target=/root/.cache/uv,sharing=locked \
    uv pip wheel --wheel-dir=/wheels -r requirements.txt
```

**Impact**: cold install ~5× faster, warm rebuild ~10× faster, image ~3 MB smaller, `.pyc` precompiled at build time (faster cold start). **Zero functional change** — same wheels installed.

### 🟢 4. Add BuildKit cache mounts to apt + bun

If you `apt-get install` system packages, the default `apt-get clean` discards everything between builds. Cache mount keeps the `.deb` cache outside the image:

```dockerfile
# Tell apt to keep the cache so the mount works
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
 && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' \
    > /etc/apt/apt.conf.d/keep-cache

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
        build-essential libpq-dev
```

For Bun (in any stage that runs `bun install`):

```dockerfile
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile
```

**Impact**: rebuilds where deps haven't changed go from minutes → seconds. Caches live in BuildKit's bounded cache — they GC themselves. Zero image size impact.

### 🟢 5. Make sure `Dockerfile` opts into BuildKit features

If your Dockerfile doesn't already start with this line, add it:

```dockerfile
# syntax=docker/dockerfile:1.7
```

This unlocks `--mount=type=cache`, `COPY --link`, heredocs, and other modern features. Without it, the `--mount` lines above silently fail or get ignored. Set `DOCKER_BUILDKIT=1` in your `.env` too (it's the default in recent Docker versions but doesn't hurt).

---

## Tier 2 — Reliability + small additional wins (15 min)

Still pure-additive. Mostly compose.yaml tweaks.

### 🟢 6. Add real healthchecks to postgres and redis

Stops Django from racing a not-yet-ready postgres on cold boot. In your compose.yaml:

```yaml
postgres:
  image: postgres:17.1-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
    interval: 5s
    timeout: 5s
    retries: 10
    start_period: 10s

redis:
  image: redis:7.4.1-alpine
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 5s
    timeout: 3s
    retries: 5
```

Then change your `web` (or whatever depends on them) from:
```yaml
depends_on: [postgres, redis]
```
to:
```yaml
depends_on:
  postgres: { condition: service_healthy }
  redis:    { condition: service_healthy }
```

The `$${POSTGRES_USER}` (double `$`) is intentional — escapes Compose interpolation so the shell inside the container expands it.

**Impact**: kills the "first boot fails because Django connected to postgres before it was accepting connections" race. Subsequent boots are gated cleanly.

### 🟢 7. Add `init: true` to long-running containers

Without this, your container's PID 1 is your app process, which is bad at reaping zombie children and forwarding signals. `init: true` runs `tini` as PID 1 instead. ~50 KB binary, ~1 MB extra RAM, fixes a class of subtle bugs.

Add to celery workers, beat, and any container running a JS/Python tool that spawns subprocesses:

```yaml
worker:
  init: true
beat:
  init: true
```

### 🟢 8. Use `restart: on-failure:N` for crash-prone services

Workers processing user input can hit poison-pill tasks that crash-loop forever. `unless-stopped` will keep restarting indefinitely, burning CPU. `on-failure:5` gives up after 5 attempts:

```yaml
worker:
  restart: "on-failure:5"
beat:
  restart: "on-failure:5"
```

For your `web` and `postgres`, keep `unless-stopped`. For dev-only services, `restart: "no"` is better — you want them to die loudly so you notice broken state.

### 🟢 9. Add `COPY --link` to cross-stage copies

In multi-stage Dockerfiles, when you `COPY --from=build /something /destination`, that layer normally depends on every layer below it in the destination stage. `--link` makes it independent — survives base-image bumps and cache invalidations upstream.

```dockerfile
# Before:
COPY --from=build /wheels /wheels
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# After:
COPY --link --from=build /wheels /wheels
COPY --link --from=frontend-build /app/dist /usr/share/nginx/html
```

Apply only to `--from=` copies (not the small `COPY --chown=user file ./` lines — `--link` actually slightly hurts there).

**Impact**: when you pin a new base image (security update, etc.), only the layers above the bump rebuild. Saves time on rebuilds and reduces dangling-image churn (= less to prune).

### 🟢 10. Minify your Bun SSR bundle

If you have `bun build server.ts`, add `--minify`:

```dockerfile
RUN bun build server.ts \
      --outfile dist/server.js \
      --target=bun \
      --minify \
      --define:process.env.NODE_ENV='"production"'
```

**Impact**: 30-50% smaller `server.js`. ~5-10 MB less RAM at runtime (smaller bundle to hold in memory). No correctness change.

---

## Tier 3 — Structural (real refactor, biggest RAM + scaling wins)

These actually change your container architecture. Skip if your project is humming along — apply when you need to scale specific concerns independently or when the ops complexity of one giant container is biting you.

### 🟡 11. Switch nginx → `nginxinc/nginx-unprivileged:alpine-slim`

If you have an nginx container, swap the base image:

```dockerfile
FROM nginxinc/nginx-unprivileged:1.27-alpine-slim AS nginx
```

You'll need to:
1. Update `nginx.conf` to listen on `8080` instead of `80` (unprivileged users can't bind <1024)
2. Add `pid /tmp/nginx.pid;` to the top of `nginx.conf`
3. Add these inside `http {}`: `client_body_temp_path /tmp/client_body; proxy_temp_path /tmp/proxy; fastcgi_temp_path /tmp/fastcgi;` (so nginx can write temp files as non-root)
4. Update your compose `ports:` to map to container port 8080: `"${WEB_PORT}:8080"`

**Impact**: -60 MB image, runs as UID 101 (non-root), better security posture. ~10 min of testing to make sure your routes still work.

### 🔴 12. Split a single multi-process container into separate services

If you currently run nginx + gunicorn + bun-ssr (or similar) inside one container with supervisord, splitting into separate containers gives you:

- **Independent scaling** — scale your SSR container to 4 replicas without quadrupling Python and nginx footprint
- **Smaller images per concern** — Python image has no node, SSR image has no Python, nginx image has neither
- **Clearer ops** — `docker compose logs ssr` instead of grepping supervisord output
- **No supervisord overhead** — ~5-15 MB per container

**The architecture:**
```
nginx (port 80/8080 exposed)
  ├── /api, /admin, /up, /media, /markdownx → web (gunicorn :8000)
  └── everything else                       → ssr (bun :3000)
postgres + redis on the docker network, never exposed to host
```

**The change:** convert your single Dockerfile into a multi-target Dockerfile (one `FROM ... AS web`, one `FROM ... AS ssr`, one `FROM ... AS nginx`). Compose picks the target per service:

```yaml
services:
  web:
    build: { context: ., dockerfile: Dockerfile, target: web }
    expose: ["8000"]
  ssr:
    build: { context: ., dockerfile: Dockerfile, target: ssr }
    expose: ["3000"]
  nginx:
    build: { context: ., dockerfile: Dockerfile, target: nginx }
    ports: ["${WEB_PORT}:8080"]
    depends_on: [web, ssr]
```

Reference the canonical [`Dockerfile`](Dockerfile), [`compose.yaml`](compose.yaml), and [`nginx.conf`](nginx.conf) in this repo for a working example.

**Impact**: **-100 to -300 MB total image weight**, RAM savings depend on your worker counts but typically 50-150 MB at idle, and you can independently scale the part of the stack that's hot.

**Risk**: real refactor. Allocate a half-day to test routing, healthchecks, and your existing app contracts. Worth it if you've felt the pain of one fat container; skip if everything runs fine.

### 🟡 13. Avoid port conflicts when running multiple clones

If you have several forks of this template running side-by-side and they fight over `:8002` or `:5175`, copy [`bin/pick-ports`](bin/pick-ports) into your project. It hashes `COMPOSE_PROJECT_NAME` to a deterministic base port and falls back to the next free port if taken. Run it once after cloning.

---

## How to verify your wins

Before applying anything:

```bash
docker system df              # baseline disk usage
time docker compose build     # baseline cold build time
docker compose up -d
docker stats --no-stream      # baseline RAM per container
```

After:

```bash
docker system prune -f        # clear old dangling stuff so the comparison is fair
time docker compose build     # should be 2-3× faster cold
# ... edit a code file ...
time docker compose build     # should be 5-10× faster warm (cache mounts kick in)
docker stats --no-stream      # compare RAM
docker system df              # less churn over time
```

Wait a week of normal dev activity, then:
```bash
docker system df              # the log-rotation fix should keep this flat
du -sh /var/lib/docker/containers/*/  # log files should be capped at ~30 MB each
```

If `docker system df` is still creeping up, find the culprit:
```bash
docker system df -v           # detailed breakdown
docker builder prune -f       # bounded cache, but you can manually clear it
```

---

## What this won't fix

- **Postgres data volumes growing** — that's your data; archive or vacuum
- **A leaky app process eating RAM** — Tier 1-2 changes don't profile your code
- **Slow API endpoints** — Docker can't speed up your N+1 queries

For those, you need profiling, not infra tweaks.

---

## TL;DR — the 5 changes that fix 80% of the pain

1. **Add `.dockerignore`** — instant 30-50% faster builds
2. **Add log rotation** (`logging` block in compose) — stops the unbounded log growth that drives `docker prune`
3. **Switch `pip` → `uv`** with cache mounts — 5-10× faster Python installs
4. **Add `--mount=type=cache`** to apt and bun install — caches survive rebuilds
5. **Add real healthchecks** + `condition: service_healthy` — kill the cold-boot races

Apply those five and you've fixed the build speed + prune + reliability problems. Tier 2 polish and Tier 3 structural changes are gravy.

---

# Tier 4 — Upgrading runtimes & packages (decide per-project)

> **Mature projects need more care than this starter template.** If your project has been live for a while, it has custom code, custom deps, and production users. Don't bulk-upgrade everything just because the template did. Read each section and decide *per upgrade* whether the gain is worth the risk in YOUR codebase.

For each upgrade below:
- **Why** — what you actually get
- **When to hold** — red flags that mean "don't bump yet"
- **Breaking** — gotchas to test for
- **Migration cost** — rough effort

## Backend

### Python 3.12 → 3.13 — usually safe
- **Why:** ~10-15% faster import startup (matters for cold-start serverless), better error messages, free-threaded mode (experimental)
- **When to hold:** if any of your deps (especially C extensions like `cryptography`, `lxml`, `pillow`, custom-built wheels) hasn't released a 3.13 wheel. Verify with `pip install --dry-run -r requirements.txt` against a 3.13 venv first.
- **Breaking:** the `imp` module is finally removed (was deprecated since 3.4). Some old scientific Python libs may still use it.
- **Migration cost:** typically zero — most modern libraries already support 3.13. Just bump the Dockerfile base image.

### Django 5.1 → 5.2 LTS — **bump regardless**
- **Why:** 5.1 is **end-of-life** as of early 2026 — no more security patches. 5.2 is LTS through April 2028.
- **When to hold:** never. EOL Django in production is a real security risk.
- **Breaking:** minimal between 5.1 and 5.2 (it's a minor version bump). Read the [release notes](https://docs.djangoproject.com/en/5.2/releases/5.2/) for any deprecations you've been ignoring.
- **Migration cost:** ~30 min. Run `python manage.py makemigrations --dry-run` and `python manage.py check --deploy` to catch issues.

### DRF, gunicorn, whitenoise, psycopg, redis-py, celery — drop-in
- **Why:** bug fixes, perf improvements, security patches
- **When to hold:** if you've subclassed any of these heavily (especially DRF serializers/permissions or custom Celery base tasks), regression-test your customizations.
- **Breaking:** these are all minor/patch within their majors — no API breaks expected.
- **Migration cost:** ~15 min testing.

### Switching `pip` → `uv` — usually safe, big win
- **Why:** 5-10× faster installs, smaller resulting image, automatic bytecode precompile
- **When to hold:** if you have a private PyPI index with auth that requires pip-specific config. uv supports indexes but the auth pattern differs.
- **Breaking:** none with the wheel/install pattern shown in Tier 1. uv is pip-CLI-compatible for the operations we use.
- **Migration cost:** ~10 min Dockerfile edit.

## Frontend

### React 18 → 19 — bump for new projects, careful for mature
- **Why:** ref-as-prop (no more `forwardRef` boilerplate), Server Actions, faster Suspense, smaller bundle
- **When to hold:**
  - You depend on React component libraries that still pin React 18 only (check their peerDeps)
  - You have heavy use of `forwardRef` (React 19 still supports it, but warns)
  - You use legacy context API anywhere (removed in 19)
  - You have third-party state libs (zustand, jotai, redux) — verify they work on 19
- **Breaking:**
  - `PropTypes` removed (use TypeScript or migrate to runtime validators)
  - Legacy context (`getChildContext` etc.) removed
  - `defaultProps` on function components removed (use destructuring defaults)
  - String refs removed (use callback refs or `useRef`)
- **Migration cost:** ~1-2 hours for typical projects, more if you have lots of `forwardRef` chains. Run the official codemod: `npx codemod@latest react/19/migration-recipe`

### Tailwind 3 → 4 — ⚠️ the biggest one
- **Why:** 5-10× faster builds, no PostCSS step (3 fewer deps), CSS-first config, container queries built-in, modern color palette with OKLCH support
- **When to hold:**
  - You target browsers older than **Safari 16.4 / Chrome 111 / Firefox 128** (Tailwind 4's browser floor)
  - You have a HUGE custom Tailwind config with 5+ plugins (some plugins haven't ported to v4 — check each)
  - You use `tailwindcss-animate` heavily (replace with `tw-animate-css` 1.4+ — drop-in for v4)
  - You're in a feature freeze / pre-launch crunch (this isn't a 5-minute upgrade)
- **Breaking:**
  - `tailwind.config.js` → `@theme {}` blocks in CSS (or keep the config via `@config "tailwind.config.js"` directive in CSS)
  - Utility renames: `shadow-sm` → `shadow-xs`; bare `shadow` → `shadow-sm`; bare `ring` → `ring-3` (numbered variants like `ring-2` unchanged)
  - `bg-opacity-X` removed → use `bg-{color}/{opacity}` syntax
  - `@tailwind base/components/utilities` → `@import "tailwindcss";`
  - PostCSS, autoprefixer, postcss-import all removed; add `@tailwindcss/vite` plugin
  - Default border color changed from `gray-200` to `currentColor` — add a compat layer if you relied on the default
- **Migration cost:** ~2-4 hours. **Run the official codemod first**: `npx @tailwindcss/upgrade` — handles 90% of the renames automatically. Then test every page.

### Vite 7 → 8 — ⚠️ STAY ON V7 for now
- **Why:** Rolldown bundler (Rust, faster), better tree-shaking
- **When to hold:** **right now, for almost everyone.** Vite 8's plugin ecosystem isn't fully ready:
  - Many plugins still use `transformWithEsbuild` (deprecated in v8 — must migrate to `transformWithOxc`)
  - `@tailwindcss/vite` had compatibility issues at the time of writing
  - We had to revert from v8 → v7 in this template
- **Breaking:**
  - `manualChunks` as object → must be a function (Rolldown API)
  - Plugins using legacy esbuild APIs fail outright
  - Some Rollup plugins haven't been ported
- **Migration cost:** depends entirely on your plugin set — could be 30 min, could be 2 days. **Wait 2-3 months and re-evaluate.**

### TanStack Router/Start (1.x bumps within the alpha)
- **Why:** bug fixes, perf, occasional new features
- **When to hold:** TanStack Start is **still labeled alpha**. Pin a known-good version, test thoroughly before bumping in prod. Don't follow `^` ranges in CI.
- **Breaking:** API surface still shifts between minors (e.g., loader signatures, server-side props). Read changelogs for every minor bump.
- **Migration cost:** small per minor (~30 min each), but cumulative over 30+ versions = real testing if you've been on an old version.

### lucide-react 0.x → 1.x
- **Why:** 1.0 stability marker (mostly the same icons, signaling API stability)
- **When to hold:** you use unusual icons that may have been renamed or removed
- **Breaking:** some icon names changed in the 0.x → 1.0 transition
- **Migration cost:** grep your codebase for `<Icon name="X" />` and `import { ... } from 'lucide-react'`, then verify each icon name still exists at lucide.dev.

### shadcn-ui (deprecated package) → shadcn 4.x
- **Why:** the npm package was renamed; new CLI supports React 19 + Tailwind 4 + blocks
- **When to hold:** never (the old package is dead — no more updates)
- **Breaking:** **no component code changes** — your existing `components/ui/*.tsx` are unchanged. Only the CLI invocation differs: `npx shadcn@latest add <component>` instead of `npx shadcn-ui@latest add ...`.
- **Migration cost:** swap one devDep, update any docs/scripts that reference `shadcn-ui`.

## Docker images

### Postgres patch bumps (e.g., 17.1 → 17-alpine floating)
- **Why:** automatic security/bug fixes
- **When to hold:** never for patch bumps within the same major
- **Breaking:** none
- **Migration cost:** zero — switch to floating tag (`postgres:17-alpine`)

### Postgres MAJOR bumps (e.g., 17 → 18) — careful
- **Why:** new features, perf
- **When to hold:** until you've planned a `pg_upgrade` migration window
- **Breaking:** data files are NOT compatible across major versions. You need to either:
  - Run `pg_dump` then restore on new major
  - Use `pg_upgrade` (faster, in-place)
- **Migration cost:** depends on data size. For small DBs: ~30 min. For multi-GB: plan a maintenance window.

### Redis 7.4 → 8 — wait
- **Why:** new commands, perf
- **When to hold:** ecosystem is still settling on Redis 8 as of early 2026. Stay on `7.4-alpine`.
- **Breaking:** licensing changes, some clients haven't fully adopted RESP3 yet
- **Migration cost:** TBD — re-evaluate in late 2026.

### nginx patch bumps (e.g., 1.27 → 1.28)
- **Why:** security patches, http/3 improvements
- **When to hold:** if you depend on a specific nginx module that takes time to rebuild
- **Breaking:** rare — nginx is extremely conservative about breaking changes
- **Migration cost:** zero — `1.28-alpine-slim` is drop-in for `1.27-alpine-slim`

### nginx → nginx-unprivileged-slim (architectural)
- **Why:** -60 MB image, runs as non-root UID 101 (better security posture)
- **When to hold:** if you have nginx config that writes to `/var/cache/nginx` (unprivileged version can't — use `/tmp`)
- **Breaking:** listens on 8080 instead of 80; needs `pid /tmp/nginx.pid` and `*_temp_path /tmp/...` directives
- **Migration cost:** ~10 min nginx.conf tweak + update compose port mapping

### uv 0.5 → 0.11+ (floating tag)
- **Why:** ~3× faster than 0.5
- **When to hold:** never (it's drop-in)
- **Breaking:** `uv venv` requires `--clear` to overwrite an existing venv (only matters if you reuse venvs in scripts — not typical in Docker builds)
- **Migration cost:** trivial — change one line in Dockerfile mount

## A general framework for deciding

For every upgrade, ask:

1. **Is the project I'm upgrading actively maintained, or in maintenance mode?**
   - Active dev → bump aggressively, you'll catch issues during normal work
   - Maintenance mode → only bump for security (Django EOL, etc.) or critical bug fixes
2. **Do I have automated tests covering the upgrade surface?**
   - Yes → upgrade is much safer; tests catch regressions
   - No → write tests for your critical paths first, OR limit upgrades to patch versions
3. **Is this a Friday at 4pm?**
   - Yes → no.
4. **Can I roll back easily?**
   - Yes (good Git hygiene, immutable Docker images, blue-green deploys) → bump
   - No → fix your deploy pipeline first

## Recommended bump order for mature projects

If you decide to upgrade, do them ONE AT A TIME with a deploy + soak between each:

1. **First:** `.dockerignore` + log rotation + cache mounts (Tier 1 above) — pure infra wins, zero code risk
2. **Second:** Backend patch bumps (Django, DRF, psycopg, etc.) — verify with your test suite
3. **Third:** Python 3.12 → 3.13 — verify all C extensions still build
4. **Fourth:** Frontend patch bumps (Radix, framer-motion, lucide patch versions)
5. **Fifth:** React 18 → 19 — bigger blast radius, do alone with deploy + soak
6. **Sixth:** Tailwind 3 → 4 — biggest blast radius, do completely alone with thorough QA
7. **Skip for now:** Vite 7 → 8 (revisit Q3 2026), Postgres major bumps (only when needed)

Don't try to do all of these in one PR. Each gets its own commit, its own deploy, and its own soak period.

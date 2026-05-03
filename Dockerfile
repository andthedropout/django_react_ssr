# syntax=docker/dockerfile:1.7
# ============================================================================
# Multi-target Dockerfile — three lean images, one source.
#   docker build --target web   -t myapp-web   .
#   docker build --target ssr   -t myapp-ssr   .
#   docker build --target nginx -t myapp-nginx .
# Compose picks the right target per service (see compose.yaml).
#
# Optimizations baked in:
#   - uv (Astral) instead of pip — ~10× faster install, smaller image
#   - BuildKit cache mounts on apt/uv/bun caches — fast rebuilds
#   - UV_COMPILE_BYTECODE=1 — .pyc precompiled at build, no first-request stutter
#   - COPY --link on cross-stage copies — better cache survivability
#   - bun build --minify — 30–50% smaller SSR bundle
#   - nginxinc/nginx-unprivileged — non-root nginx, ~22 MB image
# ============================================================================

# ----------------------------------------------------------------------------
# Stage: frontend-build  (shared by ssr + nginx, never shipped)
# ----------------------------------------------------------------------------
FROM oven/bun:1-slim AS frontend-build
WORKDIR /app

# Cache deps independently of source.
COPY frontend/package.json frontend/bun.lockb* ./frontend/
WORKDIR /app/frontend
# Persistent cache mount for bun's package cache — survives layer invalidations.
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

# Now copy what the build actually needs.
WORKDIR /app
COPY frontend ./frontend
COPY public ./public
COPY design-system ./design-system
COPY bin/download-theme-fonts.js ./bin/download-theme-fonts.js

ARG VITE_FRONTEND_THEME=vercel
ENV VITE_FRONTEND_THEME=${VITE_FRONTEND_THEME}

# Pre-download Google Fonts for the configured theme (offline at runtime).
RUN bun /app/bin/download-theme-fonts.js || echo "(no fonts in this theme)"

WORKDIR /app/frontend
# TanStack Start + Nitro own the build. Output: .output/public/ (client assets,
# served by nginx) + .output/server/index.mjs (real SSR server, run by Bun).
RUN NODE_ENV=production bun run build \
 && test -f .output/server/index.mjs \
 && test -d .output/public \
 && echo "✅ frontend SSR build OK"

# ----------------------------------------------------------------------------
# Stage: py-build  (builds /opt/venv in a throwaway image with build tools)
# uv is grabbed via --mount so the binary doesn't live in any final image.
# ----------------------------------------------------------------------------
FROM python:3.13-slim-bookworm AS py-build
ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

# Keep apt's downloaded .deb cache so cache mounts work.
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
 && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update \
 && apt-get install -y --no-install-recommends build-essential libpq-dev

COPY requirements.txt /tmp/requirements.txt
RUN --mount=from=ghcr.io/astral-sh/uv:0.11,source=/uv,target=/usr/local/bin/uv \
    --mount=type=cache,target=/root/.cache/uv,sharing=locked \
    uv venv /opt/venv \
 && uv pip install --python /opt/venv/bin/python -r /tmp/requirements.txt

# ----------------------------------------------------------------------------
# Target: web  (Django + gunicorn — no node, no nginx, no supervisor)
# uv is NOT in this image — we just copy the pre-built venv from py-build.
# ----------------------------------------------------------------------------
FROM python:3.13-slim-bookworm AS web
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend \
    PATH="/opt/venv/bin:$PATH"

# Curl + libpq runtime only — no compilers, no dev headers.
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
 && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update \
 && apt-get install -y --no-install-recommends curl libpq5

ARG UID=1000
ARG GID=1000
RUN groupadd -g "${GID}" python \
 && useradd -m -u "${UID}" -g "${GID}" python

WORKDIR /app
COPY --link --from=py-build /opt/venv /opt/venv

COPY --chown=python:python backend ./backend
COPY --chown=python:python public ./public
# design-system is consumed by collectstatic so themes/backgrounds end up in /static/.
COPY --chown=python:python design-system ./design-system
COPY --chown=python:python bin/docker-entrypoint-web ./bin/docker-entrypoint-web
RUN chmod +x ./bin/docker-entrypoint-web

WORKDIR /app/backend
RUN SECRET_KEY=dummy DEBUG=false python manage.py collectstatic --no-input

USER python
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -fsS http://localhost:8000/up/ || exit 1
ENTRYPOINT ["/app/bin/docker-entrypoint-web"]
CMD ["gunicorn", "-c", "python:config.gunicorn", "config.wsgi", "--bind", "0.0.0.0:8000"]

# ----------------------------------------------------------------------------
# Target: ssr  (Bun runtime serving the pre-built SSR bundle)
# ----------------------------------------------------------------------------
FROM oven/bun:1-slim AS ssr
# Real SSR via TanStack Start + Nitro (preset: bun). The .output/server/ bundle
# is self-contained — Nitro inlines all deps into .output/server/node_modules/.
COPY --link --from=frontend-build /app/frontend/.output /app/.output
WORKDIR /app
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["bun", "run", ".output/server/index.mjs"]

# ----------------------------------------------------------------------------
# Target: nginx  (reverse proxy + static-asset host, runs as non-root UID 101)
# ----------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.28-alpine-slim AS nginx
USER root
COPY nginx.conf /etc/nginx/nginx.conf
# Two sources, no overlap, both end up at /static/* on nginx:
#   1. TanStack Start client bundle (assets, favicon, manifest, robots.txt, ...)
#   2. Django collectstatic output (admin CSS/JS, themes, backgrounds, fonts, images)
#      — produced by the web stage, includes hashed filenames for the manifest
#      storage backend (admin templates reference these hashed names).
COPY --link --from=frontend-build /app/frontend/.output/public /usr/share/nginx/html/static
COPY --link --from=web            /app/public_collected        /usr/share/nginx/html/static
USER nginx
EXPOSE 8080

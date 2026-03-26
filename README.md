# TruBuilder Landing

Coming soon page for [truebuilder.ai](https://truebuilder.ai) with email lead capture.

## Tech Stack

### Backend
- **Django 5.1.3** - Python web framework
- **Django REST Framework** - API toolkit
- **PostgreSQL** - Database
- **Gunicorn** - WSGI server

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool with HMR
- **Bun** - Fast JavaScript runtime and package manager
- **TanStack Router 1.95.2** - File-based routing with SSR support
- **TailwindCSS 3.4** - Utility-first CSS
- **shadcn/ui** - Component library
- **Framer Motion** - Animation library

### Infrastructure
- **Docker & Docker Compose** - Containerization

## Quick Start

### Prerequisites
- Docker and Docker Compose v2.20.2+

### Setup

```bash
docker compose up --build
```

In a new terminal:
```bash
docker compose exec web python manage.py migrate
```

Visit [http://localhost:8002](http://localhost:8002)

**Default admin credentials:**
- Username: `admin`
- Password: `changeme`
- Admin panel: [http://localhost:8002/admin](http://localhost:8002/admin)

## Ports

| Service | Port |
|---------|------|
| Django (web) | 8002 |
| Vite (frontend dev) | 5175 |

## Project Structure

```
├── backend/              # Django backend
│   ├── config/          # Django settings, URLs, API views
│   ├── users/           # User authentication app
│   └── themes/          # Theming system app
├── frontend/            # React frontend
│   ├── src/
│   │   ├── routes/      # TanStack Router routes (file-based)
│   │   ├── components/  # React components (UI, layout, etc.)
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks (useTheme, useAuth, etc.)
│   │   ├── lib/         # Utilities
│   │   ├── api/         # API client functions
│   │   ├── client.tsx   # Client entry point
│   │   ├── router.tsx   # Router configuration
│   │   └── ssr.tsx      # SSR entry point
│   └── package.json
├── public/              # Static assets (served at /static/)
├── design-system/       # Themes and design assets
├── compose.yaml         # Docker Compose config
├── Dockerfile.django    # Django container
└── .env.example         # Environment template
```

## Common Commands

```bash
# Start development environment
docker compose up

# Start in detached mode (background)
docker compose up -d

# Stop development environment
docker compose down

# View logs
docker compose logs -f

# Run Django management commands
docker compose exec web python manage.py <command>

# Run migrations
docker compose exec web python manage.py migrate

# Rebuild after dependency changes
docker compose up --build
```

## Adding UI Components

```bash
# CRITICAL: Must run inside Docker container (not on your host machine)
docker compose exec js bunx shadcn@latest add button
docker compose exec js bunx shadcn@latest add card

# Or add npm packages
docker compose exec js bun add <package-name>
```

## Environment Variables

Key variables in `.env`:

- `COMPOSE_PROJECT_NAME` - Docker project name (`trubuilder_landing`)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (true/false)
- `DOCKER_WEB_PORT_FORWARD` - Django port (default: 8002)
- `VITE_PORT` - Vite dev server port (default: 5175)
- `VITE_USE_BACKEND_THEMES` - Theme source (true = API, false = JSON files)
- `VITE_FRONTEND_THEME` - Theme name (e.g., vercel, cyberpunk)

See `.env.example` for all available variables.

## Routing

Create a new file in `frontend/src/routes/`:

```tsx
// frontend/src/routes/my-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import MyPage from '@/pages/MyPage'

export const Route = createFileRoute('/my-page')({
  ssr: true,
  component: MyPage,
})
```

## Static Files

Always use `/static/` prefix for files in the `public/` directory:

```tsx
// Correct
<img src="/static/images/logo.png" />

// Wrong
<img src="/images/logo.png" />
```

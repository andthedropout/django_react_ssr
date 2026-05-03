import { createFileRoute } from '@tanstack/react-router';
import Home from '@/pages/static/Home';

export const Route = createFileRoute('/')({
  // The loader runs on the SERVER during SSR. Whatever it returns is baked
  // into the HTML response and re-used (not re-run) on the client during
  // hydration. The timestamp here is the server's clock at render time —
  // refresh the page and it changes; that's the proof SSR is doing real work.
  loader: () => ({ renderedAt: new Date().toISOString() }),
  component: Home,
  head: () => ({
    meta: [
      {
        name: 'description',
        content: 'A lean Django + React starter with TanStack Start SSR, Tailwind 4, and shadcn/ui.',
      },
      { property: 'og:title', content: 'Django + React Starter' },
      {
        property: 'og:description',
        content: 'Server-side rendered React on a Django REST backend. Themable. Production-ready.',
      },
      { property: 'og:type', content: 'website' },
    ],
  }),
});

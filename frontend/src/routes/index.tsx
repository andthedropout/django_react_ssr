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

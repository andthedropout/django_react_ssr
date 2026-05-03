import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Route } from '@/routes/index';

const STACK = [
  { name: 'Django 5 + DRF', why: 'Battle-tested backend, ORM, admin, auth.' },
  { name: 'React 19 + TanStack Start', why: 'File-based routing with real server rendering.' },
  { name: 'Vite 7 + Bun', why: 'Fast HMR in dev, real SSR via Bun in prod.' },
  { name: 'Tailwind 4 + shadcn/ui', why: 'CSS-first config with composable primitives.' },
  { name: 'Postgres 17 + Redis 7', why: 'Production database + cache/broker out of the box.' },
  { name: 'Celery (optional)', why: 'Background tasks ready when you need them.' },
];

export default function Home() {
  // `renderedAt` comes from the route loader, which runs on the server during
  // SSR. The value is baked into the HTML response and stays the same on the
  // client (no hydration mismatch). Refresh the page → the timestamp advances,
  // proving each request was rendered server-side at that moment.
  const { renderedAt } = Route.useLoaderData();

  return (
    <PageWrapper>
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Starter template
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Django + React, with SSR baked in.
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            A lean, opinionated scaffold for shipping SaaS. Server-side rendered React via
            TanStack Start, a Django REST API behind it, and a themable shadcn/ui design system.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="/admin/" rel="noreferrer">Open Django admin</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/up" rel="noreferrer">Health check</a>
            </Button>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Rendered on the server at</span>
            <code className="rounded bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-700 dark:text-emerald-400">
              {renderedAt}
            </code>
            <span className="text-muted-foreground">— refresh to see it tick</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">What's in the box</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <Card key={item.name}>
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.why}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}

import { createFileRoute } from '@tanstack/react-router';

/** Liveness endpoint for the container HEALTHCHECK and the reverse proxy. */
export const Route = createFileRoute('/healthz')({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          { status: 'ok', build: __NDS_BUILD__ },
          { headers: { 'cache-control': 'no-store' } },
        ),
    },
  },
});

import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocPageLayout } from '../../docs/DocPageLayout.tsx';
import { findDoc } from '../../docs/registry.tsx';

export const Route = createFileRoute('/components/$slug')({
  loader: ({ params }) => {
    const doc = findDoc(params.slug);
    if (!doc) throw notFound();
    return { slug: doc.slug, title: doc.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? ''} · دیزاین سیستم نگرش` }],
  }),
  component: ComponentPage,
});

function ComponentPage() {
  const { slug } = Route.useLoaderData();
  const doc = findDoc(slug);
  if (!doc) return null;
  return <DocPageLayout doc={doc} galleryId={doc.slug} />;
}

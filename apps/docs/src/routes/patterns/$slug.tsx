import { createFileRoute, notFound } from '@tanstack/react-router';
import { DocPageLayout } from '../../docs/DocPageLayout.tsx';
import patternUi from '../../docs/patterns/patterns.module.css';
import { findPatternDoc } from '../../docs/patterns/registry.tsx';

export const Route = createFileRoute('/patterns/$slug')({
  loader: ({ params }) => {
    const doc = findPatternDoc(params.slug);
    if (!doc) throw notFound();
    return { slug: doc.slug, title: doc.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? ''} · دیزاین سیستم نگرش` }],
  }),
  component: PatternPage,
});

function PatternPage() {
  const { slug } = Route.useLoaderData();
  const doc = findPatternDoc(slug);
  if (!doc) return null;
  return (
    <DocPageLayout
      doc={doc}
      galleryId={`pattern-${doc.slug}`}
      galleryClassName={patternUi.patternGallery}
    />
  );
}

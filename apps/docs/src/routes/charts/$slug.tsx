import { createFileRoute, notFound } from '@tanstack/react-router';
import chartsUi from '../../docs/charts/charts.module.css';
import { findChartDoc } from '../../docs/charts/registry.tsx';
import { DocPageLayout } from '../../docs/DocPageLayout.tsx';

export const Route = createFileRoute('/charts/$slug')({
  loader: ({ params }) => {
    const doc = findChartDoc(params.slug);
    if (!doc) throw notFound();
    return { slug: doc.slug, title: doc.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? ''} · دیزاین سیستم نگرش` }],
  }),
  component: ChartPage,
});

function ChartPage() {
  const { slug } = Route.useLoaderData();
  const doc = findChartDoc(slug);
  if (!doc) return null;
  return (
    <DocPageLayout
      doc={doc}
      galleryId={`chart-${doc.slug}`}
      galleryClassName={chartsUi.chartGallery}
    />
  );
}

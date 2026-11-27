import { createFileRoute, notFound } from '@tanstack/react-router';
import assessmentUi from '../../docs/assessment/assessment.module.css';
import { findAssessmentDoc } from '../../docs/assessment/registry.tsx';
import { DocPageLayout } from '../../docs/DocPageLayout.tsx';

export const Route = createFileRoute('/assessment/$slug')({
  loader: ({ params }) => {
    const doc = findAssessmentDoc(params.slug);
    if (!doc) throw notFound();
    return { slug: doc.slug, title: doc.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? ''} · دیزاین سیستم نگرش` }],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const { slug } = Route.useLoaderData();
  const doc = findAssessmentDoc(slug);
  if (!doc) return null;
  return (
    <DocPageLayout
      doc={doc}
      galleryId={`assessment-${doc.slug}`}
      galleryClassName={assessmentUi.assessmentGallery}
    />
  );
}

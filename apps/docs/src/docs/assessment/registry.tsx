import type { ComponentDoc } from '../types.ts';
import { answerFlowDoc } from './answer-flow.tsx';
import { interpretationBlockDoc } from './interpretation-block.tsx';
import { printLayoutDoc } from './print-layout.tsx';
import { questionItemDoc } from './question-item.tsx';
import { reportStatusDoc } from './report-status.tsx';
import { resultOverviewDoc } from './result-overview.tsx';
import { startResumeDoc } from './start-resume.tsx';

/** Registered `@negaresh/assessment` documentation pages (rendered at `/assessment/$slug`). */
export const ASSESSMENT_DOCS: readonly ComponentDoc[] = [
  questionItemDoc,
  answerFlowDoc,
  startResumeDoc,
  resultOverviewDoc,
  interpretationBlockDoc,
  reportStatusDoc,
  printLayoutDoc,
];

export function findAssessmentDoc(slug: string): ComponentDoc | undefined {
  return ASSESSMENT_DOCS.find((d) => d.slug === slug);
}

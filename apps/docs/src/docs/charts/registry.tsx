import type { ComponentDoc } from '../types.ts';
import { barDoc } from './bar.tsx';
import { chartFrameDoc } from './chart-frame.tsx';
import { gaugeDoc } from './gauge.tsx';
import { intervalBarDoc } from './interval-bar.tsx';
import { profileLineDoc } from './profile-line.tsx';
import { radarDoc } from './radar.tsx';
import { sparklineDoc } from './sparkline.tsx';

/** Registered `@negaresh/charts` documentation pages (rendered at `/charts/$slug`). */
export const CHART_DOCS: readonly ComponentDoc[] = [
  chartFrameDoc,
  intervalBarDoc,
  profileLineDoc,
  barDoc,
  radarDoc,
  gaugeDoc,
  sparklineDoc,
];

export function findChartDoc(slug: string): ComponentDoc | undefined {
  return CHART_DOCS.find((d) => d.slug === slug);
}

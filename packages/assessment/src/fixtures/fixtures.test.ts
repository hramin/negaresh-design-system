import { describe, expect, it } from 'vitest';
import {
  mmpiTeen13Fixture,
  sampleQuestions,
  startFormSchema,
  unfinishedAttempt,
  wellbeing8Fixture,
} from './index.ts';

describe('@negaresh/assessment fixtures', () => {
  it('provides a complete 13-scale MMPI-Teen-13 fixture with dual professional and calm copy', () => {
    expect(mmpiTeen13Fixture.scores).toHaveLength(13);
    expect(mmpiTeen13Fixture.scores.filter((s) => s.section === 'مقیاس‌های روایی')).toHaveLength(3);
    expect(mmpiTeen13Fixture.scores.filter((s) => s.section === 'مقیاس‌های بالینی')).toHaveLength(
      10,
    );
    expect(mmpiTeen13Fixture.validity?.scaleCodes).toEqual(['L', 'F', 'K']);
    expect(mmpiTeen13Fixture.calmHeadline).not.toBe(mmpiTeen13Fixture.headline);
    expect(mmpiTeen13Fixture.charts.map((c) => c.type)).toEqual(['profile-line', 'interval-bar']);
    for (const sec of mmpiTeen13Fixture.interpretations) {
      expect(sec.calmTitle).toBeTruthy();
      expect(sec.calmBody).toBeTruthy();
    }
  });

  it('provides a complete 8-dimension Wellbeing-8 fixture with Gauge, IntervalBar, and Radar specs', () => {
    expect(wellbeing8Fixture.kind).toBe('index');
    expect(wellbeing8Fixture.indexScore).toBe(72);
    expect(wellbeing8Fixture.scores).toHaveLength(8);
    expect(wellbeing8Fixture.charts.map((c) => c.type)).toEqual([
      'gauge',
      'interval-bar',
      'radar',
    ]);
  });

  it('provides answering questions covering standard, Likert 5/7, forced-choice, and image variants', () => {
    const variants = new Set(sampleQuestions.map((q) => q.variant));
    expect(variants).toEqual(new Set(['standard', 'likert', 'forced-choice', 'image']));
    const fieldTypes = new Set(startFormSchema.map((f) => f.type));
    expect(fieldTypes).toEqual(new Set(['text', 'choice', 'number', 'jalali-date']));
    expect(unfinishedAttempt.answeredCount).toBeLessThan(unfinishedAttempt.totalQuestions);
  });
});

import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { VerifiedBadge } from './VerifiedBadge.tsx';

describe('VerifiedBadge', () => {
  it('composes Badge with localized default label, Persian-digit licence number, tones/sizes, and passes axe', async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = renderNds(
      <>
        <VerifiedBadge ref={ref} />
        <VerifiedBadge licenceNumber="12485" size="sm" />
        <VerifiedBadge tone="accent" label="متخصص تأییدشده" licenceNumber={9032} />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Badge');
    expect(screen.getAllByText('پروانهٔ تأییدشده')).toHaveLength(2);
    expect(screen.getByText('۱۲۴۸۵')).toBeTruthy();
    expect(screen.getByText('متخصص تأییدشده')).toBeTruthy();
    expect(screen.getByText('۹۰۳۲')).toBeTruthy();

    await expectNoAxeViolations(container);
  });
});

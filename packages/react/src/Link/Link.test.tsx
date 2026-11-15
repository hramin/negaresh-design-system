import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Link } from './Link.tsx';

describe('Link', () => {
  it('renders inline and standalone links', () => {
    renderNds(
      <p>
        <Link href="/help">راهنما</Link> و{' '}
        <Link href="/support" variant="standalone">
          پشتیبانی
        </Link>
      </p>,
    );
    expect(screen.getByRole('link', { name: 'راهنما' }).dataset.variant).toBe('inline');
    expect(screen.getByRole('link', { name: 'پشتیبانی' }).dataset.variant).toBe('standalone');
  });

  it('announces external links and opens them safely', async () => {
    const { container } = renderNds(
      <Link href="https://negaresh.ir" external>
        سایت نگارش
      </Link>,
    );
    const link = screen.getByRole('link', { name: /سایت نگارش.*زبانهٔ تازه/ });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('keeps a custom rel and marks disabled links', () => {
    renderNds(
      <Link href="/x" rel="nofollow" isDisabled>
        غیرفعال
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'غیرفعال' });
    expect(link.getAttribute('rel')).toBe('nofollow');
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });
});

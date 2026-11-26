import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { LogoSlot } from '../LogoSlot/LogoSlot.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Footer } from './Footer.tsx';

describe('Footer', () => {
  it('renders semantic footer landmark with link groups, external links, legal row, and passes axe', async () => {
    const ref = createRef<HTMLElement>();
    const { container } = renderNds(
      <Footer
        ref={ref}
        brand={<LogoSlot name="نگارش برتر" product="روان‌سنجی" />}
        description="سامانهٔ آزمون‌ها، دوره‌ها و نرم‌افزارهای تخصصی روان‌شناسی."
        groups={[
          {
            id: 'products',
            title: 'محصولات',
            links: [
              { id: 'tests', label: 'پلتفرم آزمون', href: '/tests' },
              { id: 'registry', label: 'رجیستری نرم‌افزار', href: '/registry' },
            ],
          },
          {
            id: 'support',
            title: 'پشتیبانی',
            links: [
              { id: 'help', label: 'مرکز راهنما', href: '/help' },
              { id: 'docs', label: 'مستندات بیرونی', href: 'https://negaresh.ir', external: true },
            ],
          },
        ]}
        copyright="© ۱۴۰۵ نگارش برتر. همهٔ حقوق محفوظ است."
        legalLinks={[
          { id: 'privacy', label: 'حریم خصوصی', href: '/privacy' },
          { id: 'terms', label: 'قوانین استفاده', href: '/terms' },
        ]}
      />,
    );

    expect(ref.current?.tagName).toBe('FOOTER');
    expect(ref.current?.dataset.nds).toBe('Footer');
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'پلتفرم آزمون' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /مستندات بیرونی/ })).toBeTruthy();
    expect(screen.getByText('© ۱۴۰۵ نگارش برتر. همهٔ حقوق محفوظ است.')).toBeTruthy();

    await expectNoAxeViolations(container);
  });
});

import { fireEvent, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Image } from './Image.tsx';

const SAMPLE_SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="%23dcecea"/></svg>';

describe('Image', () => {
  it('renders ratio, lazy loading, sizes, caption figure, error fallback, and passes axe', async () => {
    const ref = createRef<HTMLImageElement>();
    const { container } = renderNds(
      <>
        <Image
          ref={ref}
          src={SAMPLE_SRC}
          alt="نمودار ارزیابی روان‌سنجی"
          ratio="16/9"
          sizes="(max-width: 900px) 100vw, 600px"
          radius="md"
          caption="نمای کلی گزارش آزمودنی"
        />
        <Image src="https://example.invalid/missing.png" alt="تصویر در دسترس نیست" ratio="4/3" />
        <Image src={SAMPLE_SRC} alt="" ratio="1/1" loading="eager" />
      </>,
    );

    expect(ref.current?.getAttribute('loading')).toBe('lazy');
    expect(ref.current?.getAttribute('sizes')).toBe('(max-width: 900px) 100vw, 600px');
    expect(screen.getByText('نمای کلی گزارش آزمودنی').tagName).toBe('FIGCAPTION');

    const brokenImg = screen.getByRole('img', { name: 'تصویر در دسترس نیست' });
    fireEvent.error(brokenImg);
    expect(screen.getByRole('img', { name: 'تصویر در دسترس نیست' }).dataset.nds).toBe(
      'ImageFallback',
    );

    await expectNoAxeViolations(container);
  });
});

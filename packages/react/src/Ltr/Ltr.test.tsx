import { describe, expect, it } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { Code, Ltr } from './Ltr.tsx';

describe('Ltr and Code', () => {
  it('isolates LTR text', () => {
    const { container } = renderNds(
      <p>
        نشانی <Ltr lang="en">negaresh.ir</Ltr> است
      </p>,
    );
    const ltr = container.querySelector('[data-nds="Ltr"]') as HTMLElement;
    expect([ltr.dir, ltr.lang]).toEqual(['ltr', 'en']);
  });

  it('shows codes in Latin digits, LTR, untranslated', () => {
    const { container } = renderNds(
      <>
        <Code>N25AG-۱۲۳۴۵</Code>
        <Code size="display">{441790826153}</Code>
      </>,
    );
    const [a, b] = container.querySelectorAll('code');
    expect(a?.textContent).toBe('N25AG-12345');
    expect(a?.getAttribute('dir')).toBe('ltr');
    expect(a?.getAttribute('translate')).toBe('no');
    expect(b?.getAttribute('data-size')).toBe('display');
  });
});

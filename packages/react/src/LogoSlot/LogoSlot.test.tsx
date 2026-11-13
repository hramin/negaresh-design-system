import { describe, expect, it } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { LogoSlot } from './LogoSlot.tsx';

describe('LogoSlot', () => {
  it('shows a placeholder mark until a logo is passed', () => {
    const { container, rerender } = renderNds(
      <LogoSlot name="نگارش برتر" product="رجیستری" size="lg" />,
    );
    const mark = container.querySelector('[data-placeholder]') as HTMLElement;
    expect(mark.textContent).toBe('لوگو');
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    expect(container.textContent).toContain('رجیستری');
    rerender(<LogoSlot logo={<svg aria-hidden="true" />} />);
    expect(container.querySelector('[data-placeholder]')).toBeNull();
  });
});

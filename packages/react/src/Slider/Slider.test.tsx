import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { RangeSlider, Slider } from './Slider.tsx';

describe('Slider and RangeSlider', () => {
  it('renders single slider with Persian ticks and live output, steps with keyboard, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <Slider
        ref={ref}
        label="شدت اضطراب"
        description="از ۰ تا ۱۰۰ بر اساس هفتهٔ گذشته"
        defaultValue={50}
        minValue={0}
        maxValue={100}
        step={10}
        ticks={[0, 25, 50, 75, 100]}
        onChange={onChange}
        className="custom-slider"
      />,
    );

    expect(ref.current?.getAttribute('data-nds')).toBe('Slider');
    expect(ref.current?.classList.contains('custom-slider')).toBe(true);
    expect(container.textContent).toContain('۲۵');
    expect(container.textContent).toContain('۱۰۰');

    const thumb = screen.getByRole('slider', { name: 'شدت اضطراب' }) as HTMLInputElement;
    expect(thumb.value).toBe('50');

    thumb.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith(60);
    expect(thumb.value).toBe('60');

    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith(100);
    await expectNoAxeViolations(container);
  });

  it('renders RangeSlider with Persian range output, localized thumb labels, and passes axe', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderNds(
      <RangeSlider
        label="بازهٔ سنی مراجعان"
        defaultValue={[12, 18]}
        minValue={6}
        maxValue={60}
        step={1}
        ticks={[6, 18, 36, 60]}
        onChange={onChange}
      />,
    );

    const low = screen.getByRole('slider', { name: /حد پایین/ }) as HTMLInputElement;
    const high = screen.getByRole('slider', { name: /حد بالا/ }) as HTMLInputElement;
    expect(low.value).toBe('12');
    expect(high.value).toBe('18');
    expect(container.querySelector('output')?.textContent).toContain('۱۲ تا ۱۸');

    low.focus();
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenCalledWith([13, 18]);
    await expectNoAxeViolations(container);
  });
});

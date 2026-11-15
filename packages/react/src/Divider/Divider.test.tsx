import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { Divider } from './Divider.tsx';

describe('Divider', () => {
  it('is a separator; vertical exposes its orientation', () => {
    renderNds(
      <>
        <Divider />
        <div>
          <Divider orientation="vertical" tone="strong" />
        </div>
      </>,
    );
    const [h, v] = screen.getAllByRole('separator');
    expect(h?.getAttribute('aria-orientation')).not.toBe('vertical');
    expect(v?.getAttribute('aria-orientation')).toBe('vertical');
    expect(v?.getAttribute('data-tone')).toBe('strong');
  });
});

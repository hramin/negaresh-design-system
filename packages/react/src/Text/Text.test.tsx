import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { Heading, Text } from './Text.tsx';

describe('Text and Heading', () => {
  it('maps level to element and default size/weight', () => {
    renderNds(
      <>
        <Heading level={1}>فعال‌سازی نرم‌افزار</Heading>
        <Heading level={2}>سریال</Heading>
        <Heading level={3} size="md" weight="semibold">
          کوچک
        </Heading>
      </>,
    );
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.dataset.size).toBe('3xl');
    expect(h1.dataset.weight).toBe('heavy');
    expect(screen.getByRole('heading', { level: 2 }).dataset.size).toBe('xl');
    const h3 = screen.getByRole('heading', { level: 3 });
    expect([h3.dataset.size, h3.dataset.weight]).toEqual(['md', 'semibold']);
  });

  it('renders token attributes', () => {
    renderNds(
      <Text as="p" size="sm" tone="muted" leading="text" tabular measure id="x">
        متن
      </Text>,
    );
    const p = document.getElementById('x') as HTMLElement;
    expect(p.tagName).toBe('P');
    expect([
      p.dataset.size,
      p.dataset.tone,
      p.dataset.leading,
      p.dataset.tabular,
      p.dataset.measure,
    ]).toEqual(['sm', 'muted', 'text', 'true', 'true']);
  });
});

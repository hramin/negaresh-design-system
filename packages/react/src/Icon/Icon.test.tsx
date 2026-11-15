import { iconChevronEnd, iconCopy } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { Icon } from './Icon.tsx';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = renderNds(<Icon icon={iconCopy} size="sm" />);
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.dataset.size).toBe('sm');
    expect(svg.innerHTML).toContain('<rect');
  });

  it('can carry a label and flags mirrored icons', () => {
    renderNds(<Icon icon={iconChevronEnd} label="بعدی" />);
    const img = screen.getByRole('img', { name: 'بعدی' });
    expect(img.dataset.mirrored).toBe('true');
  });
});

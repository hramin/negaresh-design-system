import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderNds } from '../test/render.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import { SkipLink } from './SkipLink.tsx';

describe('SkipLink and VisuallyHidden', () => {
  it('links to the main content with the catalogue text', () => {
    renderNds(<SkipLink target="content" />);
    expect(screen.getByRole('link', { name: 'پرش به محتوا' }).getAttribute('href')).toBe(
      '#content',
    );
  });

  it('keeps hidden text in the accessibility tree', () => {
    renderNds(
      <button type="button">
        <VisuallyHidden>بستن</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'بستن' })).toBeTruthy();
  });
});

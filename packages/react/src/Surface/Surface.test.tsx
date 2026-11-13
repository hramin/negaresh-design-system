import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from '../Text/Text.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Section, Surface } from './Surface.tsx';

describe('Surface', () => {
  it('renders a labelled section with sections and a sunken footer', async () => {
    const { container } = renderNds(
      <Surface aria-labelledby="t">
        <Section>
          <Heading level={2} id="t">
            سریال را وارد کنید
          </Heading>
        </Section>
        <Section tone="sunken">پانویس</Section>
      </Surface>,
    );
    expect(screen.getByRole('region', { name: 'سریال را وارد کنید' })).toBeTruthy();
    expect(container.querySelector('[data-tone="sunken"]')?.textContent).toBe('پانویس');
    await expectNoAxeViolations(container);
  });

  it('supports the plain variant and other elements', () => {
    const { container } = renderNds(
      <Surface variant="plain" as="div">
        <Section as="footer">x</Section>
      </Surface>,
    );
    expect(container.querySelector('div[data-variant="plain"] > footer')).toBeTruthy();
  });
});

import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Container, Grid, Inline, Stack } from './Layout.tsx';

describe('layout primitives', () => {
  it('apply token gaps and alignment', () => {
    const { container } = renderNds(
      <Container size="narrow">
        <Stack gap="6" as="section">
          <Inline gap="3" justify="between" align="baseline" wrap={false}>
            <span>الف</span>
            <span>ب</span>
          </Inline>
          <Grid columns={3}>
            <span>۱</span>
          </Grid>
          <Grid minItemSize="var(--nds-content-narrow)">
            <span>۲</span>
          </Grid>
        </Stack>
      </Container>,
    );
    const stack = container.querySelector('[data-nds="Stack"]') as HTMLElement;
    expect(stack.tagName).toBe('SECTION');
    expect(stack.style.gap).toBe('var(--nds-space-6)');
    const inline = container.querySelector('[data-nds="Inline"]') as HTMLElement;
    expect(inline.dataset.justify).toBe('between');
    expect(inline.dataset.wrap).toBeUndefined();
    const [fixed, auto] = container.querySelectorAll<HTMLElement>('[data-nds="Grid"]');
    expect(fixed?.style.gridTemplateColumns).toMatch(/^repeat\(3, minmax\(0(px)?, 1fr\)\)$/);
    expect(auto?.style.gridTemplateColumns).toContain('var(--nds-content-narrow)');
    expect(container.querySelector('[data-nds="Container"]')?.getAttribute('data-size')).toBe(
      'narrow',
    );
  });

  it('has no axe violations', async () => {
    const { container } = renderNds(
      <Stack>
        <Inline>
          <span>متن</span>
        </Inline>
      </Stack>,
    );
    await expectNoAxeViolations(container);
  });
});

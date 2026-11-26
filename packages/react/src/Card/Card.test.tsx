import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.tsx';
import { Heading, Text } from '../Text/Text.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Card, CardBody, CardFooter, CardMedia } from './Card.tsx';

describe('Card', () => {
  it('renders static card with media, body, and sunken footer with zero axe violations', async () => {
    const ref = createRef<HTMLElement>();
    const { container } = renderNds(
      <Card ref={ref} variant="default">
        <CardMedia>
          <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>" alt="تصویر دوره" />
        </CardMedia>
        <CardBody>
          <Heading level={3}>آزمون شخصیت نئو</Heading>
          <Text as="p" size="sm" tone="muted">
            تفسیر کامل نیمرخ پنج‌عاملی برای ارزیابی بالینی.
          </Text>
        </CardBody>
        <CardFooter tone="sunken">
          <Button size="sm" variant="primary">
            مشاهده
          </Button>
        </CardFooter>
      </Card>,
    );

    expect(ref.current?.tagName).toBe('ARTICLE');
    expect(ref.current?.dataset.nds).toBe('Card');
    expect(screen.getByRole('heading', { name: 'آزمون شخصیت نئو' })).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('renders interactive link card variant on React Aria Link and passes axe', async () => {
    const onPress = vi.fn();
    const { container } = renderNds(
      <Card href="#neo-test" onPress={onPress} orientation="horizontal">
        <CardBody>
          <Text weight="semibold">راهنمای تفسیر گزارش</Text>
          <Text size="sm" tone="muted">
            نکات کلیدی خوانش نیمرخ‌ها.
          </Text>
        </CardBody>
      </Card>,
    );

    const link = screen.getByRole('link', { name: /راهنمای تفسیر گزارش/ });
    expect(link.dataset.nds).toBe('Card');
    expect(link.dataset.interactive).toBe('true');
    expect(link.dataset.orientation).toBe('horizontal');

    await userEvent.click(link);
    expect(onPress).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});

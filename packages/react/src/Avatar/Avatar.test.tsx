import { fireEvent, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Avatar, AvatarGroup, getInitials } from './Avatar.tsx';

describe('Avatar and AvatarGroup', () => {
  it('extracts Persian and Latin initials cleanly without cursive joining', () => {
    expect(getInitials('دکتر سارا رضایی')).toBe('س ر');
    expect(getInitials('مریم کاظمی')).toBe('م ک');
    expect(getInitials('نگار')).toBe('ن');
    expect(getInitials('Sara Rezaei')).toBe('SR');
    expect(getInitials('   ')).toBeUndefined();
  });

  it('renders image, falls back to Persian initials on error, supports icon fallback and decorative alt=""', async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = renderNds(
      <>
        <Avatar ref={ref} src="https://example.invalid/portrait.jpg" name="دکتر سارا رضایی" />
        <Avatar name="آرش نادری" tone="accent" size="lg" />
        <Avatar size="sm" alt="کاربر ناشناس" />
        <Avatar name="تزئینی" alt="" />
      </>,
    );

    expect(ref.current?.dataset.nds).toBe('Avatar');
    const img = screen.getByRole('img', { name: 'دکتر سارا رضایی' });
    expect(img.tagName).toBe('IMG');

    // Simulate broken image -> falls back to Persian initials while preserving accessible name
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'دکتر سارا رضایی' }).textContent).toBe('س ر');
    expect(screen.getByRole('img', { name: 'آرش نادری' }).textContent).toBe('آ ن');
    expect(screen.getByRole('img', { name: 'کاربر ناشناس' })).toBeTruthy();

    await expectNoAxeViolations(container);
  });

  it('renders AvatarGroup with max overflow count in Persian digits and passes axe', async () => {
    const groupRef = createRef<HTMLDivElement>();
    const { container } = renderNds(
      <AvatarGroup ref={groupRef} max={3} size="sm" aria-label="اعضای تیم پژوهش">
        <Avatar name="سارا رضایی" />
        <Avatar name="مریم کاظمی" />
        <Avatar name="آرش نادری" />
        <Avatar name="نیلوفر امینی" />
        <Avatar name="کاوه شریفی" />
      </AvatarGroup>,
    );

    expect(groupRef.current?.dataset.nds).toBe('AvatarGroup');
    const overflow = screen.getByRole('img', { name: '۲ نفر دیگر' });
    expect(overflow.textContent).toBe('+۲');

    await expectNoAxeViolations(container);
  });
});

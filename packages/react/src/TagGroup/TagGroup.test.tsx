import { iconTag } from '@negaresh/icons';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { Tag, TagField, TagGroup } from './TagGroup.tsx';

function RemovableTagsHarness() {
  const [items, setItems] = useState([
    { id: 'cbt', label: 'درمان شناختی' },
    { id: 'child', label: 'کودک و نوجوان' },
  ]);
  return (
    <TagGroup
      label="برچسب‌های انتخاب‌شده"
      description="برای حذف می‌توانید کلید Delete را بزنید."
      emptyMessage="برچسبی باقی نمانده است."
      items={items}
      onRemove={(keys) => setItems((prev) => prev.filter((item) => !keys.has(item.id)))}
    >
      {(item) => (
        <Tag id={item.id} icon={iconTag}>
          {item.label}
        </Tag>
      )}
    </TagGroup>
  );
}

describe('TagGroup and TagField', () => {
  it('removes tags with localized Persian remove buttons, renders empty state, and passes axe', async () => {
    const user = userEvent.setup();
    const { container } = renderNds(<RemovableTagsHarness />);

    expect(screen.getByText('درمان شناختی')).toBeTruthy();
    const removeFirst = screen.getByRole('button', { name: 'حذف درمان شناختی' });
    const removeSecond = screen.getByRole('button', { name: 'حذف کودک و نوجوان' });
    expect(removeFirst).toBeTruthy();
    expect(removeSecond).toBeTruthy();

    await user.click(removeFirst);
    expect(screen.queryByText('درمان شناختی')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'حذف کودک و نوجوان' }));
    expect(container.textContent).toContain('برچسبی باقی نمانده است.');
    await expectNoAxeViolations(container);
  });

  it('adds tags via Enter and Persian comma, rejects duplicates/overflow, removes on Backspace, and passes axe', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = renderNds(
      <TagField
        ref={ref}
        label="کلیدواژه‌های مقاله"
        description="با Enter یا ویرگول برچسب تازه اضافه کنید."
        name="tags"
        defaultValue={['روان‌سنجی']}
        maxTags={3}
        onChange={onChange}
        className="custom-tag-field"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'کلیدواژه‌های مقاله' }) as HTMLInputElement;
    expect(ref.current).toBe(input);
    expect(
      container.querySelector('[data-nds="TagField"]')?.classList.contains('custom-tag-field'),
    ).toBe(true);

    // Duplicate tag rejected with Persian alert
    await user.type(input, 'روان‌سنجی{Enter}');
    expect(screen.getByRole('alert').textContent).toContain('قبلاً افزوده شده');

    // Clear input and add via Enter
    await user.clear(input);
    await user.type(input, 'مشاوره{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['روان‌سنجی', 'مشاوره']);

    // Add via Persian comma
    await user.type(input, 'کودک،');
    expect(onChange).toHaveBeenLastCalledWith(['روان‌سنجی', 'مشاوره', 'کودک']);

    // Max tags limit enforced
    await user.type(input, 'اضافی{Enter}');
    expect(screen.getByRole('alert').textContent).toContain('حداکثر ۳ برچسب مجاز است.');

    // Hidden inputs emitted for native form submission
    expect(container.querySelectorAll('input[type="hidden"][name="tags"]').length).toBe(3);

    // Backspace on empty input removes last tag
    await user.clear(input);
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith(['روان‌سنجی', 'مشاوره']);
    await expectNoAxeViolations(container);
  });
});

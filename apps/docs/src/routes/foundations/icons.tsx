import { allIcons } from '@negaresh/icons/all';
import {
  Badge,
  EmptyState,
  Heading,
  Icon,
  Inline,
  SearchField,
  Stack,
  Text,
  ToggleButton,
} from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import styles from '../../components/Page.module.css';
import fStyles from './foundations.module.css';
import icons from './icons.module.css';

export const Route = createFileRoute('/foundations/icons')({
  head: () => ({ meta: [{ title: 'آیکون‌ها · دیزاین سیستم نگرش' }] }),
  component: IconsPage,
});

const pascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function IconsPage() {
  const [query, setQuery] = useState('');
  const [mirroredOnly, setMirroredOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allIcons.filter((icon) => {
      if (mirroredOnly && !icon.mirrored) return false;
      if (!q) return true;
      const exportName = `icon${pascal(icon.name)}`.toLowerCase();
      return icon.name.toLowerCase().includes(q) || exportName.includes(q);
    });
  }, [query, mirroredOnly]);

  return (
    <article className={styles.page}>
      <Stack gap="3">
        <Heading level={1}>آیکون‌ها</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          {formatNumber(allIcons.length)} آیکون خطی روی شبکهٔ ۲۴ با ضخامت خط توکنی. دوازده آیکون از
          صفحهٔ مرجع رسم شده‌اند و بقیه از Lucide (مجوز ISC) آمده‌اند. آیکون‌های نشان‌دار با ↔ در
          راست‌به‌چپ قرینه می‌شوند.
        </Text>
      </Stack>

      <div className={fStyles.filterRow}>
        <div className={fStyles.filterGrow}>
          <SearchField
            label="جست‌وجوی آیکون"
            placeholder="نام آیکون، مثلاً chevron یا lock…"
            value={query}
            onChange={setQuery}
          />
        </div>
        <Inline gap="2" align="center">
          <ToggleButton isSelected={mirroredOnly} onChange={setMirroredOnly}>
            فقط قرینه‌شونده در RTL (↔)
          </ToggleButton>
          <Badge tone="neutral" size="sm">
            {formatNumber(filtered.length)} از {formatNumber(allIcons.length)}
          </Badge>
        </Inline>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="آیکونی با این نام پیدا نشد"
          description="عبارت جست‌وجو یا فیلتر آیکون‌های قرینه‌شونده را تغییر دهید."
        />
      ) : (
        <ul className={icons.grid} data-gallery="icons">
          {filtered.map((icon) => (
            <li key={icon.name} className={icons.cell}>
              <Icon icon={icon} size="lg" />
              <code className={icons.name} dir="ltr">
                {`icon${pascal(icon.name)}`}
              </code>
              {icon.mirrored && (
                <span className={icons.mirrored} title="قرینه در راست‌به‌چپ">
                  ↔ قرینه
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

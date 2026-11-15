import { allIcons } from '@negaresh/icons/all';
import { Heading, Icon, Stack, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { formatNumber } from '@negaresh/utils';
import icons from './icons.module.css';

export const Route = createFileRoute('/foundations/icons')({
  head: () => ({ meta: [{ title: 'آیکون‌ها · دیزاین سیستم نگرش' }] }),
  component: IconsPage,
});

const pascal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function IconsPage() {
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
      <ul className={icons.grid} data-gallery="icons">
        {allIcons.map((icon) => (
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
    </article>
  );
}

import {
  Badge,
  Button,
  Heading,
  Inline,
  SegmentedControl,
  SegmentedControlItem,
  Text,
} from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { cssTokens } from '../../lib/tokens.ts';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/motion')({
  head: () => ({ meta: [{ title: 'حرکت · دیزاین سیستم نگرش' }] }),
  component: MotionFoundationPage,
});

const DURATION_USES: Record<string, string> = {
  '--nds-dur-instant': 'بازخورد فوری فشردن دکمه',
  '--nds-dur-fast': 'هاور و تغییر رنگ پس‌زمینه',
  '--nds-dur-base': 'پاپ‌اور، اعلان توست و بازشوها (Disclosure)',
  '--nds-dur-slow': 'کشوها (Sheet) و گذارهای سطح صفحه',
};

const EASING_USES: Record<string, string> = {
  '--nds-ease': 'اکثر جابه‌جایی‌های رابط کاربری',
  '--nds-ease-enter': 'ظاهر شدن لایه‌های شناور',
  '--nds-ease-exit': 'بسته شدن و خروج لایه‌ها',
};

function MotionFoundationPage() {
  const [selectedDur, setSelectedDur] = useState<string>('--nds-dur-base');
  const [active, setActive] = useState(false);

  const durationTokens = cssTokens.filter((t) => t.path.startsWith('duration.'));
  const easingTokens = cssTokens.filter((t) => t.path.startsWith('easing.'));

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            prefers-reduced-motion
          </Badge>
        </Inline>
        <Heading level={1}>حرکت (Motion)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          حرکت تغییر وضعیت را توضیح می‌دهد و هرگز جنبهٔ تزئینی ندارد. در حالت کاهش حرکت سیستم‌عامل (
          <code className={styles.code}>prefers-reduced-motion: reduce</code>)، همهٔ گذارها به‌طور
          خودکار فوری می‌شوند اما تغییر وضعیت همچنان رخ می‌دهد.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="motion-demo">
        <Heading level={2} id="motion-demo">
          آزمون زندهٔ مدت و منحنی حرکت
        </Heading>
        <SegmentedControl
          label="انتخاب توکن زمان"
          size="sm"
          value={selectedDur}
          onChange={(k) => setSelectedDur(String(k))}
        >
          {durationTokens.map((t) => (
            <SegmentedControlItem key={t.cssVar} id={t.cssVar ?? t.path}>
              {t.value.light}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <div className={fStyles.motionStage}>
          <Button variant="secondary" onPress={() => setActive((v) => !v)}>
            {active ? 'بازگشت به حالت عادی' : 'اجرای گذار ۸ پیکسلی'}
          </Button>
          <div
            className={fStyles.motionCard}
            data-active={active ? 'true' : 'false'}
            style={{
              transitionDuration: `var(${selectedDur})`,
              transitionTimingFunction: 'var(--nds-ease)',
            }}
          >
            <Text weight="semibold">کارت نمونهٔ گذار</Text>
            <Text size="xs" tone="subtle">
              <code className={styles.code}>{selectedDur}</code> · <code className={styles.code}>--nds-ease</code>
            </Text>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="motion-tokens">
        <Heading level={2} id="motion-tokens">
          توکن‌های زمان و منحنی
        </Heading>
        <TableWrap label="جدول توکن‌های حرکت">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">توکن</th>
                <th scope="col">مقدار</th>
                <th scope="col">کاربرد</th>
              </tr>
            </thead>
            <tbody>
              {[...durationTokens, ...easingTokens].map((t) => (
                <tr key={t.path}>
                  <th scope="row">
                    <code className={styles.code}>{t.cssVar}</code>
                  </th>
                  <td>
                    <code className={styles.code}>{t.value.light}</code>
                  </td>
                  <td className={styles.muted}>
                    {(t.cssVar && (DURATION_USES[t.cssVar] ?? EASING_USES[t.cssVar])) ??
                      t.description ??
                      '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </section>

      <section className={styles.section} aria-labelledby="motion-rules">
        <Heading level={2} id="motion-rules">
          قواعد حرکت در NDS
        </Heading>
        <ul className={fStyles.bullets}>
          <li>فقط ویژگی‌های <code className={styles.code}>opacity</code> و <code className={styles.code}>transform</code> پویانمایی شوند.</li>
          <li>فاصلهٔ جابه‌جایی اجزای رابط حداکثر ۸ پیکسل باشد (<code className={styles.code}>--nds-space-2</code>).</li>
          <li>هیچ انیمیشن تکرارشونده‌ای جز نشانگرهای پیشرفت و بارگذاری (<code className={styles.code}>Spinner</code>، <code className={styles.code}>Skeleton</code>) مجاز نیست.</li>
          <li>گذرهای صفحه‌ای با View Transitions API فقط به‌عنوان ارتقای تدریجی (progressive enhancement) به کار می‌روند.</li>
        </ul>
      </section>
    </article>
  );
}

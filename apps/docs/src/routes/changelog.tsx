import { Badge, Heading, Inline, InlineAlert, Ltr, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../components/Page.module.css';
import {
  loadPackageChangelogs,
  loadPendingChangesets,
  MILESTONE_RELEASES,
} from '../lib/changelog.ts';
import fStyles from './foundations/foundations.module.css';

export const Route = createFileRoute('/changelog')({
  head: () => ({ meta: [{ title: 'تاریخچهٔ تغییرات · دیزاین سیستم نگرش' }] }),
  component: ChangelogPage,
});

function ChangelogPage() {
  const pending = loadPendingChangesets();
  const packageLogs = loadPackageChangelogs();

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            Changesets · nds-development
          </Badge>
          <Badge tone="info" size="sm">
            پیش از قفل نسخهٔ ۱ (فاز P9)
          </Badge>
        </Inline>
        <Heading level={1}>تاریخچهٔ تغییرات (Changelog)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          یادداشت‌های تغییرات بسته‌های <Ltr>@negaresh/*</Ltr> از پوشهٔ{' '}
          <code className={styles.code}>.changeset/</code> و تاریخچهٔ فازهای تأییدشدهٔ NDS. قفل
          نسخهٔ <Ltr>1.0.0</Ltr> و انتشار در رجیستری در محدودهٔ فاز P9 انجام می‌شود.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="changesets-queue">
        <Heading level={2} id="changesets-queue">
          صف Changesets ({formatNumber(pending.length)})
        </Heading>
        {pending.length === 0 ? (
          <InlineAlert tone="info" title="صف Changesets آماده است">
            پیکربندی <code className={styles.code}>.changeset/config.json</code> روی شاخهٔ{' '}
            <code className={styles.code}>nds-development</code> فعال است. با اجرای{' '}
            <code className={styles.code}>pnpm changeset</code>، هر یادداشت تغییر به‌صورت خودکار در
            این بخش ظاهر می‌شود.
          </InlineAlert>
        ) : (
          <ul className={fStyles.milestoneList}>
            {pending.map((entry) => (
              <li key={entry.id} className={fStyles.milestoneCard}>
                <div className={fStyles.milestoneHead}>
                  <code className={styles.code}>{entry.id}</code>
                  <Inline gap="2">
                    {entry.packages.map((p) => (
                      <Badge key={`${entry.id}-${p.name}`} tone="accent" size="sm">
                        <Ltr>
                          {p.name} ({p.bump})
                        </Ltr>
                      </Badge>
                    ))}
                  </Inline>
                </div>
                <Text as="p" size="sm" tone="muted" leading="text">
                  {entry.summary}
                </Text>
              </li>
            ))}
          </ul>
        )}
      </section>

      {packageLogs.length > 0 && (
        <section className={styles.section} aria-labelledby="pkg-changelogs">
          <Heading level={2} id="pkg-changelogs">
            گزارش نسخه‌های منتشرشدهٔ بسته‌ها
          </Heading>
          <ul className={fStyles.milestoneList}>
            {packageLogs.map((log) => (
              <li key={log.packageName} className={fStyles.milestoneCard}>
                <Heading level={3}>
                  <Ltr>{log.packageName}</Ltr>
                </Heading>
                <pre className={styles.codeWrap}>{log.content}</pre>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section} aria-labelledby="milestones">
        <Heading level={2} id="milestones">
          تاریخچهٔ فازهای تأییدشده (P1 تا P6)
        </Heading>
        <ol className={fStyles.milestoneList}>
          {MILESTONE_RELEASES.map((m) => (
            <li key={m.phase} className={fStyles.milestoneCard}>
              <div className={fStyles.milestoneHead}>
                <Inline gap="2" align="center">
                  <Badge tone="accent">{m.phase}</Badge>
                  <Heading level={3}>{m.title}</Heading>
                </Inline>
                <Inline gap="2" align="center">
                  <Badge tone="success" size="sm">
                    تأییدشده
                  </Badge>
                  <Text size="xs" tone="subtle">
                    {m.dateJalali} (<Ltr>{m.dateGregorian}</Ltr>)
                  </Text>
                </Inline>
              </div>
              <Inline gap="2">
                {m.packages.map((pkg) => (
                  <Badge key={pkg} tone="neutral" size="sm">
                    <Ltr>{pkg}</Ltr>
                  </Badge>
                ))}
              </Inline>
              <ul className={fStyles.bullets}>
                {m.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

import { Badge, CopyButton, Heading, Inline, Ltr, Text } from '@negaresh/react';
import type { ReactNode } from 'react';
import { TableWrap } from '../components/TableWrap.tsx';
import type { AutoPropRow } from './props.ts';
import styles from './ui.module.css';

/** A labelled group of states in the gallery. */
export function GalleryRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.row}>
      <Text as="p" size="xs" weight="semibold" tone="subtle">
        {title}
      </Text>
      <div className={styles.rowItems}>{children}</div>
    </div>
  );
}

/** One state with a caption under it. */
export function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className={styles.state}>
      <div className={styles.stateBody}>{children}</div>
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}

/** Copyable LTR code block built with NDS CopyButton and semantic tokens. */
export function CodeBlock({
  code,
  label = 'کد نمونه',
  copyLabel = 'کپی کد',
}: {
  code: string;
  label?: string;
  copyLabel?: string;
}) {
  return (
    <section className={styles.codeBlock} aria-label={label}>
      <div className={styles.codeBlockBar}>
        <Text size="xs" weight="medium" tone="subtle">
          {label}
        </Text>
        <CopyButton value={code} size="sm" variant="ghost" aria-label={copyLabel}>
          {copyLabel}
        </CopyButton>
      </div>
      <pre className={styles.codePre} dir="ltr" lang="en">
        <code>{code}</code>
      </pre>
    </section>
  );
}

/** Auto-generated TypeScript props table with desktop table + mobile stacked cards. */
export function PropsTable({
  name,
  packageName,
  kind = 'component',
  description,
  rows,
}: {
  name: string;
  packageName?: string;
  kind?: 'component' | 'function';
  description?: string;
  rows: readonly AutoPropRow[];
}) {
  const headingText = kind === 'component' ? `<${name}>` : `${name}()`;
  const hasLatinDoc = (value: string) => /[A-Za-z]/.test(value) && !/[\u0600-\u06FF]/.test(value);

  return (
    <div className={styles.block} data-props-table={name}>
      <div className={styles.propsHeader}>
        <Heading level={3}>
          <code className={styles.code}>{headingText}</code>
        </Heading>
        <Inline gap="2" align="center">
          {packageName && (
            <Badge tone="neutral" size="sm">
              <Ltr>{packageName}</Ltr>
            </Badge>
          )}
          {kind === 'function' && (
            <Badge tone="info" size="sm">
              تابع
            </Badge>
          )}
        </Inline>
      </div>
      {description && (
        <Text
          as="p"
          size="sm"
          tone="muted"
          className={hasLatinDoc(description) ? styles.latinDesc : undefined}
        >
          {hasLatinDoc(description) ? (
            <span dir="ltr" lang="en">
              {description}
            </span>
          ) : (
            description
          )}
        </Text>
      )}
      {rows.length === 0 ? (
        <Text as="p" size="sm" tone="subtle">
          این کامپوننت ویژگی ورودی ندارد.
        </Text>
      ) : (
        <>
          <TableWrap label={`ویژگی‌های ${name}`} desktopOnly>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{kind === 'function' ? 'پارامتر' : 'ویژگی'}</th>
                  <th scope="col">نوع (TypeScript)</th>
                  <th scope="col">پیش‌فرض</th>
                  <th scope="col">توضیح</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <th scope="row">
                      <span className={styles.propNameCell}>
                        <code className={styles.code}>{r.name}</code>
                        {r.required && (
                          <Badge tone="accent" size="sm">
                            الزامی
                          </Badge>
                        )}
                      </span>
                    </th>
                    <td>
                      <code className={styles.codeWrap}>{r.type}</code>
                    </td>
                    <td>{r.default ? <code className={styles.codeWrap}>{r.default}</code> : '—'}</td>
                    <td className={styles.descCell}>
                      {hasLatinDoc(r.description) ? (
                        <span dir="ltr" lang="en" className={styles.latinInline}>
                          {r.description}
                        </span>
                      ) : (
                        r.description
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>

          <ul className={styles.mobilePropCards} aria-label={`ویژگی‌های ${name}`}>
            {rows.map((r) => (
              <li key={r.name} className={styles.mobilePropCard}>
                <div className={styles.mobilePropHead}>
                  <code className={styles.code}>{r.name}</code>
                  {r.required && (
                    <Badge tone="accent" size="sm">
                      الزامی
                    </Badge>
                  )}
                </div>
                <div className={styles.mobilePropMeta}>
                  <span className={styles.mobilePropLabel}>نوع:</span>
                  <code className={styles.codeWrap}>{r.type}</code>
                </div>
                {r.default && (
                  <div className={styles.mobilePropMeta}>
                    <span className={styles.mobilePropLabel}>پیش‌فرض:</span>
                    <code className={styles.codeWrap}>{r.default}</code>
                  </div>
                )}
                {r.description && r.description !== '—' && (
                  <p className={styles.mobilePropDesc}>
                    {hasLatinDoc(r.description) ? (
                      <span dir="ltr" lang="en" className={styles.latinInline}>
                        {r.description}
                      </span>
                    ) : (
                      r.description
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

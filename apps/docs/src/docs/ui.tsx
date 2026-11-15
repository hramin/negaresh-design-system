import { Heading, Text } from '@negaresh/react';
import type { ReactNode } from 'react';
import { TableWrap } from '../components/TableWrap.tsx';
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

export function PropsTable({
  name,
  rows,
}: {
  name: string;
  rows: { name: string; type: string; default?: string; description: string }[];
}) {
  return (
    <div className={styles.block}>
      <Heading level={3}>
        <code className={styles.code}>{`<${name}>`}</code>
      </Heading>
      <TableWrap label={`ویژگی‌های ${name}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">ویژگی</th>
              <th scope="col">نوع</th>
              <th scope="col">پیش‌فرض</th>
              <th scope="col">توضیح</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <th scope="row">
                  <code className={styles.code}>{r.name}</code>
                </th>
                <td>
                  <code className={styles.code}>{r.type}</code>
                </td>
                <td>{r.default ? <code className={styles.code}>{r.default}</code> : '—'}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
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

import type { ReactNode } from 'react';
import styles from './Page.module.css';

/**
 * Scrollable table container. Focusable and labelled so keyboard users can scroll it
 * on narrow screens (WCAG 2.1.1, axe `scrollable-region-focusable`).
 */
export function TableWrap({
  label,
  desktopOnly = false,
  children,
}: {
  label: string;
  /** Hide below 900 px, where the page renders a card list instead. */
  desktopOnly?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={desktopOnly ? `${styles.tableWrap} ${styles.desktopOnly}` : styles.tableWrap}
      aria-label={label}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable regions must be keyboard-reachable
      tabIndex={0}
    >
      {children}
    </section>
  );
}

import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { cx } from '../internal/cx.ts';
import styles from './SkipLink.module.css';

export interface SkipLinkProps {
  /** Id of the main content element. Default `main`. */
  target?: string | undefined;
}

/** First focusable element on the page: jumps past the header to the main content. */
export function SkipLink({ target = 'main' }: SkipLinkProps) {
  const m = useNdsMessages();
  return (
    <a href={`#${target}`} data-nds="SkipLink" className={cx(styles.skip)}>
      {m.skipToContent}
    </a>
  );
}

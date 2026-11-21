import { type ReactNode, type Ref, useId } from 'react';
import { cx } from '../internal/cx.ts';
import { Link } from '../Link/Link.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './FormErrorSummary.module.css';

export interface FormError {
  /** ID of the actual input to focus, rather than its wrapper or field name. */
  id: string;
  /** Specific, caller-supplied error text. */
  message: ReactNode;
}

export interface FormErrorSummaryProps {
  /** Errors in form order; render the summary before the fields. */
  errors: readonly FormError[];
  /** Defaults to the ThemeProvider message catalogue's errorSummaryTitle. */
  title?: ReactNode;
  id?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** An announced list of links to invalid fields. No errors means no summary. */
export function FormErrorSummary({ errors, title, id, className, ref }: FormErrorSummaryProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const messages = useNdsMessages();
  if (!errors.length) return null;
  return (
    <div
      ref={ref}
      id={id}
      role="alert"
      aria-labelledby={titleId}
      data-nds="FormErrorSummary"
      className={cx(styles.summary, className)}
    >
      <h2 id={titleId} className={styles.title}>
        {title ?? messages.errorSummaryTitle}
      </h2>
      <ul className={styles.list}>
        {errors.map((error) => (
          <li key={error.id}>
            <Link
              href={`#${encodeURIComponent(error.id)}`}
              variant="standalone"
              className={styles.link}
              onPress={(event) => {
                event.target.ownerDocument.getElementById(error.id)?.focus();
              }}
            >
              {error.message}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

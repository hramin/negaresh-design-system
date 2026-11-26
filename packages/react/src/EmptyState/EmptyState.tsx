import type { IconDefinition } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './EmptyState.module.css';

export type EmptyStateSize = 'sm' | 'md';

export interface EmptyStateProps {
  /** Optional calm illustrative icon (`24 px`). */
  icon?: IconDefinition | undefined;
  /** Short headline stating what will appear here. */
  title: ReactNode;
  /** Supporting guidance in plain Persian. */
  description?: ReactNode;
  /** Primary next action (typically `<Button variant="primary">` or `<LinkButton>`). */
  action?: ReactNode;
  /** Optional secondary action alongside `action`. */
  secondaryAction?: ReactNode;
  /** Heading level for document outline alignment. Default `2`. */
  headingLevel?: 2 | 3 | 4 | undefined;
  /** `sm` for inline panels/tables, `md` for page-level empty views. Default `'md'`. */
  size?: EmptyStateSize | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Calm zero-data state explaining what belongs in a list or section and offering
 * the clear next action (docs/foundations/content.md). No resting shadow (D-77).
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  headingLevel = 2,
  size = 'md',
  className,
  ref,
}: EmptyStateProps) {
  const renderTitle = () => {
    if (headingLevel === 3) return <h3 className={cx(styles.title)}>{title}</h3>;
    if (headingLevel === 4) return <h4 className={cx(styles.title)}>{title}</h4>;
    return <h2 className={cx(styles.title)}>{title}</h2>;
  };

  return (
    <div
      ref={ref}
      data-nds="EmptyState"
      data-size={size}
      className={cx(styles.empty, className)}
    >
      {icon && (
        <span className={cx(styles.iconWrap)} aria-hidden="true">
          <Icon icon={icon} size={size === 'sm' ? 'md' : 'lg'} />
        </span>
      )}
      <div className={cx(styles.copy)}>
        {renderTitle()}
        {description !== undefined && description !== null && (
          <p className={cx(styles.description)}>{description}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className={cx(styles.actions)}>
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

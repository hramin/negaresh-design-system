import {
  iconClose,
  iconError,
  iconInfo,
  iconSuccess,
  iconWarning,
  type IconDefinition,
} from '@negaresh/icons';
import { type ReactNode, type Ref, useState } from 'react';
import { IconButton } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './InlineAlert.module.css';

export type InlineAlertTone = 'info' | 'success' | 'warning' | 'danger';

const TONE_ICONS: Record<InlineAlertTone, IconDefinition> = {
  info: iconInfo,
  success: iconSuccess,
  warning: iconWarning,
  danger: iconError,
};

export interface InlineAlertProps {
  /** Semantic severity tone (paired with an icon and text; never colour alone). Default `'info'`. */
  tone?: InlineAlertTone | undefined;
  /** Optional concise heading for the alert. */
  title?: ReactNode;
  /** Supporting message body. */
  children?: ReactNode;
  /** Override the default tone icon, or pass `false` to omit the icon. */
  icon?: IconDefinition | false | undefined;
  /** Optional inline actions (buttons or links) rendered below the body. */
  actions?: ReactNode;
  /** Shows a ≥ 44 × 44 px dismiss button at inline-end. */
  isDismissible?: boolean | undefined;
  /** Controlled dismissed state. */
  isDismissed?: boolean | undefined;
  /** Initial dismissed state for uncontrolled usage. */
  defaultDismissed?: boolean | undefined;
  /** Called when the user presses the dismiss button. */
  onDismiss?: (() => void) | undefined;
  /** Accessible label for the dismiss button. Defaults to `messages.dismissAlert`. */
  dismissLabel?: string | undefined;
  /** Semantic heading level when `title` should participate in the document outline. */
  headingLevel?: 2 | 3 | 4 | undefined;
  /** ARIA role override. Defaults to `'alert'` for `danger`, `'status'` for `success`/`warning`, `'note'` for `info`. */
  role?: 'alert' | 'status' | 'note' | 'region' | undefined;
  id?: string | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * In-flow status feedback block (`info`, `success`, `warning`, `danger`) with icon,
 * optional title, actions, and dismissal. No resting shadow (D-77).
 */
export function InlineAlert({
  tone = 'info',
  title,
  children,
  icon,
  actions,
  isDismissible = false,
  isDismissed,
  defaultDismissed = false,
  onDismiss,
  dismissLabel,
  headingLevel,
  role,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
  ref,
}: InlineAlertProps) {
  const messages = useNdsMessages();
  const [uncontrolledDismissed, setUncontrolledDismissed] = useState(defaultDismissed);
  const dismissed = isDismissed ?? uncontrolledDismissed;

  if (dismissed) return null;

  const resolvedIcon = icon === false ? null : (icon ?? TONE_ICONS[tone]);
  const resolvedRole =
    role ?? (tone === 'danger' ? 'alert' : tone === 'info' ? 'note' : 'status');

  const handleDismiss = () => {
    if (isDismissed === undefined) setUncontrolledDismissed(true);
    onDismiss?.();
  };

  const renderTitle = () => {
    if (!title) return null;
    if (headingLevel === 2) return <h2 className={cx(styles.title)}>{title}</h2>;
    if (headingLevel === 3) return <h3 className={cx(styles.title)}>{title}</h3>;
    if (headingLevel === 4) return <h4 className={cx(styles.title)}>{title}</h4>;
    return <p className={cx(styles.title)}>{title}</p>;
  };

  const containerAria = {
    role: resolvedRole,
    ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {}),
    ...(ariaLabelledby !== undefined ? { 'aria-labelledby': ariaLabelledby } : {}),
  };

  return (
    <div
      ref={ref}
      id={id}
      {...containerAria}
      data-nds="InlineAlert"
      data-tone={tone}
      className={cx(styles.alert, className)}
    >
      {resolvedIcon && (
        <span className={cx(styles.icon)} aria-hidden="true">
          <Icon icon={resolvedIcon} size="md" />
        </span>
      )}
      <div className={cx(styles.body)}>
        {renderTitle()}
        {children !== undefined && children !== null && (
          <div className={cx(styles.content)}>{children}</div>
        )}
        {actions && <div className={cx(styles.actions)}>{actions}</div>}
      </div>
      {isDismissible && (
        <IconButton
          icon={iconClose}
          variant="ghost"
          aria-label={dismissLabel ?? messages.dismissAlert}
          onPress={handleDismiss}
          className={cx(styles.dismiss)}
        />
      )}
    </div>
  );
}

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
import styles from './Banner.module.css';

export type BannerTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const TONE_ICONS: Record<BannerTone, IconDefinition> = {
  neutral: iconInfo,
  info: iconInfo,
  success: iconSuccess,
  warning: iconWarning,
  danger: iconError,
};

export interface BannerProps {
  /** Page-level severity tone. Default `'info'`. */
  tone?: BannerTone | undefined;
  /** Optional short lead-in title rendered inline before the message. */
  title?: ReactNode;
  /** Banner message text. */
  children: ReactNode;
  /** Override the default tone icon, or pass `false` to omit the icon. */
  icon?: IconDefinition | false | undefined;
  /** Optional action control aligned to inline-end. */
  action?: ReactNode;
  /** Container width alignment for the banner content. Default `'default'`. */
  size?: 'default' | 'wide' | 'full' | undefined;
  /** Shows a ≥ 44 × 44 px dismiss button. */
  isDismissible?: boolean | undefined;
  /** Controlled dismissed state. */
  isDismissed?: boolean | undefined;
  /** Uncontrolled initial dismissed state. */
  defaultDismissed?: boolean | undefined;
  /** Called when dismissed. */
  onDismiss?: (() => void) | undefined;
  /** Accessible name for the dismiss button. Defaults to `messages.dismissBanner`. */
  dismissLabel?: string | undefined;
  /** ARIA role override. Defaults to `'alert'` for `danger`, `'status'` for `warning`/`success`, `'region'` otherwise. */
  role?: 'region' | 'status' | 'alert' | undefined;
  /** Accessible landmark label when `role="region"`. Defaults to `messages.toneInfo` or `title` context. */
  'aria-label'?: string | undefined;
  id?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Page-level horizontal announcement strip with optional action and dismissal.
 * Hairline-separated with zero resting shadow (D-77).
 */
export function Banner({
  tone = 'info',
  title,
  children,
  icon,
  action,
  size = 'default',
  isDismissible = false,
  isDismissed,
  defaultDismissed = false,
  onDismiss,
  dismissLabel,
  role,
  'aria-label': ariaLabel,
  id,
  className,
  ref,
}: BannerProps) {
  const messages = useNdsMessages();
  const [uncontrolledDismissed, setUncontrolledDismissed] = useState(defaultDismissed);
  const dismissed = isDismissed ?? uncontrolledDismissed;

  if (dismissed) return null;

  const resolvedIcon = icon === false ? null : (icon ?? TONE_ICONS[tone]);
  const resolvedRole =
    role ?? (tone === 'danger' ? 'alert' : tone === 'warning' || tone === 'success' ? 'status' : 'region');
  const resolvedAriaLabel =
    ariaLabel ?? (resolvedRole === 'region' ? messages.toneInfo : undefined);

  const handleDismiss = () => {
    if (isDismissed === undefined) setUncontrolledDismissed(true);
    onDismiss?.();
  };

  const containerAria = {
    role: resolvedRole,
    ...(resolvedAriaLabel !== undefined ? { 'aria-label': resolvedAriaLabel } : {}),
  };

  return (
    <div
      ref={ref}
      id={id}
      {...containerAria}
      data-nds="Banner"
      data-tone={tone}
      data-size={size}
      className={cx(styles.banner, className)}
    >
      <div className={cx(styles.inner)}>
        <div className={cx(styles.lead)}>
          {resolvedIcon && (
            <span className={cx(styles.icon)} aria-hidden="true">
              <Icon icon={resolvedIcon} size="md" />
            </span>
          )}
          <div className={cx(styles.copy)}>
            {title && <strong className={cx(styles.title)}>{title}</strong>}
            <span className={cx(styles.content)}>{children}</span>
          </div>
        </div>
        {(action || isDismissible) && (
          <div className={cx(styles.end)}>
            {action}
            {isDismissible && (
              <IconButton
                icon={iconClose}
                variant="ghost"
                aria-label={dismissLabel ?? messages.dismissBanner}
                onPress={handleDismiss}
                className={cx(styles.dismiss)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

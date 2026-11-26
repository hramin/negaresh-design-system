import {
  iconClock,
  iconError,
  iconLock,
  iconSearch,
  iconSettings,
  type IconDefinition,
} from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Badge, type BadgeTone } from '../Badge/Badge.tsx';
import { Button, LinkButton } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { Section, Surface } from '../Surface/Surface.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './ErrorPage.module.css';

export type ErrorStatus = 403 | 404 | 410 | 500 | 'maintenance';

const STATUS_META: Record<
  ErrorStatus,
  { tone: 'danger' | 'warning' | 'info' | 'neutral'; badgeTone: BadgeTone; icon: IconDefinition }
> = {
  403: { tone: 'warning', badgeTone: 'warning', icon: iconLock },
  404: { tone: 'neutral', badgeTone: 'neutral', icon: iconSearch },
  410: { tone: 'neutral', badgeTone: 'neutral', icon: iconClock },
  500: { tone: 'danger', badgeTone: 'danger', icon: iconError },
  maintenance: { tone: 'info', badgeTone: 'info', icon: iconSettings },
};

export interface ErrorStateProps {
  /** Standard HTTP/availability preset (`403`, `404`, `410`, `500`, `'maintenance'`). Default `500`. */
  status?: ErrorStatus | undefined;
  /** Override the preset code pill (e.g. `۴۰۴`). Pass `false` to hide the pill. */
  code?: ReactNode | false | undefined;
  /** Override the localized Persian heading. */
  title?: ReactNode;
  /** Override the localized Persian explanation. */
  description?: ReactNode;
  /** Override the preset icon, or pass `false` to omit. */
  icon?: IconDefinition | false | undefined;
  /** Custom primary action node. When omitted, `actionHref` or `onAction` renders a primary button. */
  action?: ReactNode;
  /** Convenience URL for a primary `<LinkButton>` when `action` is not supplied. */
  actionHref?: string | undefined;
  /** Convenience handler for a primary `<Button>` when `action` is not supplied. */
  onAction?: (() => void) | undefined;
  /** Override the convenience primary action label. Defaults to the preset's localized actionLabel. */
  actionLabel?: ReactNode;
  /** Optional secondary action beside the primary action. */
  secondaryAction?: ReactNode;
  /** Optional diagnostic detail (e.g. LTR request/trace code). */
  details?: ReactNode;
  /** Heading level. Default `2` for embedded `ErrorState`. */
  headingLevel?: 1 | 2 | 3 | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Calm, actionable error block for inline sections, failed data loads, or route errors.
 * Ships localized Persian presets for `403`, `404`, `410`, `500`, and `maintenance`.
 */
export function ErrorState({
  status = 500,
  code,
  title,
  description,
  icon,
  action,
  actionHref,
  onAction,
  actionLabel,
  secondaryAction,
  details,
  headingLevel = 2,
  className,
  ref,
}: ErrorStateProps) {
  const messages = useNdsMessages();
  const preset = messages.errorPresets[status];
  const meta = STATUS_META[status];

  const resolvedIcon = icon === false ? null : (icon ?? meta.icon);
  const resolvedCode = code === false ? null : (code ?? preset.code);
  const resolvedTitle = title ?? preset.title;
  const resolvedDescription = description ?? preset.description;
  const resolvedActionLabel = actionLabel ?? preset.actionLabel;

  const resolvedAction =
    action ??
    (actionHref ? (
      <LinkButton href={actionHref} variant="primary">
        {resolvedActionLabel}
      </LinkButton>
    ) : onAction ? (
      <Button variant="primary" onPress={onAction}>
        {resolvedActionLabel}
      </Button>
    ) : null);

  const renderHeading = () => {
    if (headingLevel === 1) return <h1 className={cx(styles.title)}>{resolvedTitle}</h1>;
    if (headingLevel === 3) return <h3 className={cx(styles.title)}>{resolvedTitle}</h3>;
    return <h2 className={cx(styles.title)}>{resolvedTitle}</h2>;
  };

  return (
    <div
      ref={ref}
      role={status === 500 ? 'alert' : 'status'}
      data-nds="ErrorState"
      data-status={String(status)}
      data-tone={meta.tone}
      data-level={String(headingLevel)}
      className={cx(styles.state, className)}
    >
      {(resolvedIcon || resolvedCode) && (
        <div className={cx(styles.header)}>
          {resolvedIcon && (
            <span className={cx(styles.iconWrap)} aria-hidden="true">
              <Icon icon={resolvedIcon} size="lg" />
            </span>
          )}
          {resolvedCode && (
            <Badge tone={meta.badgeTone} size="sm">
              {resolvedCode}
            </Badge>
          )}
        </div>
      )}
      <div className={cx(styles.copy)}>
        {renderHeading()}
        {resolvedDescription !== undefined && resolvedDescription !== null && (
          <p className={cx(styles.description)}>{resolvedDescription}</p>
        )}
        {details && <div className={cx(styles.details)}>{details}</div>}
      </div>
      {(resolvedAction || secondaryAction) && (
        <div className={cx(styles.actions)}>
          {resolvedAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export interface ErrorPageProps extends ErrorStateProps {
  /** Optional header slot (e.g. minimal `<TopBar>`). */
  header?: ReactNode;
  /** Optional footer slot. */
  footer?: ReactNode;
  /** Render inside a bounded preview container instead of `100dvh` (useful in docs/galleries). Default `false`. */
  embedded?: boolean | undefined;
}

/**
 * Full-page error shell wrapping `<ErrorState>` (`headingLevel={1}`) in a calm narrow
 * hairline surface for 403, 404, 410, 500, and maintenance routes.
 */
export function ErrorPage({
  header,
  footer,
  embedded = false,
  headingLevel = 1,
  className,
  ref,
  ...stateProps
}: ErrorPageProps) {
  return (
    <div
      ref={ref}
      data-nds="ErrorPage"
      data-embedded={embedded ? 'true' : undefined}
      className={cx(styles.page, className)}
    >
      <div>{header}</div>
      <div className={cx(styles.pageMain)}>
        <Surface className={cx(styles.pageSurface)}>
          <Section>
            <ErrorState {...stateProps} headingLevel={headingLevel} />
          </Section>
        </Surface>
      </div>
      <div>{footer}</div>
    </div>
  );
}

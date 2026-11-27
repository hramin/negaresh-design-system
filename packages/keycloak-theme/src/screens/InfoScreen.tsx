import { iconArrowStart, iconInfo, iconSuccess } from '@negaresh/icons';
import { Badge, Button, InlineAlert, LinkButton, Stack, Text } from '@negaresh/react';
import type { ReactNode } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export interface InfoScreenProps {
  /** Heading for the informational screen. */
  title?: ReactNode;
  /** Primary informational or confirmation message (`kcContext.message.summary`). */
  message?: ReactNode;
  /** Semantic tone (`'info'` or `'success'`). Default `'success'`. */
  tone?: 'info' | 'success' | undefined;
  /** Optional list of remaining required actions (`kcContext.requiredActions`). */
  requiredActions?: readonly string[] | undefined;
  /** Primary destination URL (`pageRedirectUri`, `actionUri`, or `client.baseUrl`). */
  actionHref?: string | undefined;
  /** Label for the primary action (defaults to `messages.common.continueToApp`). */
  actionLabel?: string | undefined;
  /** Optional client callback when no URL is supplied. */
  onContinue?: (() => void) | undefined;
  /** Optional secondary link back to sign-in. */
  backToSignInHref?: string | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Informational and completion screen for Keycloak `info.ftl` (e.g. mobile verified,
 * password updated, or pending required-actions confirmation).
 */
export function InfoScreen({
  title,
  message,
  tone = 'success',
  requiredActions,
  actionHref,
  actionLabel,
  onContinue,
  backToSignInHref,
  shellProps,
}: InfoScreenProps) {
  const m = useAuthMessages();
  const isSuccess = tone === 'success';

  return (
    <AuthShell
      {...shellProps}
      eyebrow={
        <span className={styles.statusBadgeRow}>
          <Badge tone={isSuccess ? 'success' : 'info'} icon={isSuccess ? iconSuccess : iconInfo}>
            {isSuccess ? m.common.statusSuccessLabel : m.common.statusInfoLabel}
          </Badge>
        </span>
      }
      title={title ?? m.infoScreen.defaultTitle}
    >
      <div data-nds="InfoScreen" className={styles.statusHero}>
        <InlineAlert tone={isSuccess ? 'success' : 'info'}>
          {message ?? m.infoScreen.defaultDescription}
        </InlineAlert>

        {requiredActions && requiredActions.length > 0 && (
          <Stack gap="2">
            <Text size="sm" weight="semibold">
              {m.infoScreen.requiredActionsHeading}
            </Text>
            <ul className={styles.actionBulletList}>
              {requiredActions.map((item) => (
                <li key={item}>
                  <Text size="sm" tone="muted" leading="text">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </Stack>
        )}

        <div className={styles.actionsStack}>
          {actionHref ? (
            <LinkButton href={actionHref} variant="primary" iconStart={iconArrowStart} fullWidth>
              {actionLabel ?? m.common.continueToApp}
            </LinkButton>
          ) : onContinue ? (
            <Button type="button" variant="primary" iconStart={iconArrowStart} fullWidth onPress={onContinue}>
              {actionLabel ?? m.common.continueToApp}
            </Button>
          ) : null}

          {backToSignInHref && (
            <LinkButton href={backToSignInHref} variant="secondary" fullWidth>
              {m.common.backToSignIn}
            </LinkButton>
          )}
        </div>
      </div>
    </AuthShell>
  );
}

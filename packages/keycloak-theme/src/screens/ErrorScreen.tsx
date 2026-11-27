import { iconArrowStart, iconError, iconHelp, iconRefresh } from '@negaresh/icons';
import {
  Badge,
  Button,
  Code,
  CopyButton,
  InlineAlert,
  Link,
  LinkButton,
  Ltr,
  Stack,
  Text,
} from '@negaresh/react';
import type { ReactNode } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export interface ErrorScreenProps {
  /** Custom error heading (defaults to `messages.errorScreen.defaultTitle`). */
  title?: ReactNode;
  /** Honest, plain-Persian explanation of what happened (`kcContext.message.summary`). */
  message?: ReactNode;
  /** Optional LTR technical reference code for support (`<Ltr><Code>`). */
  referenceCode?: string | undefined;
  /** Primary return URL (`kcContext.client.baseUrl` or `kcContext.url.loginUrl`). */
  backHref?: string | undefined;
  /** Optional custom label for the primary action. */
  backLabel?: string | undefined;
  /** Optional callback for retry/back button when no URL is supplied. */
  onRetry?: (() => void) | undefined;
  /** Optional support link URL. */
  supportHref?: string | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

/**
 * Calm Persian Keycloak error page (`error.ftl`). Never conveys status by color alone:
 * pairs semantic `Badge` + `iconError` + plain-language explanation + copyable LTR code.
 */
export function ErrorScreen({
  title,
  message,
  referenceCode,
  backHref,
  backLabel,
  onRetry,
  supportHref,
  shellProps,
}: ErrorScreenProps) {
  const m = useAuthMessages();

  const footer = supportHref ? (
    <div className={styles.linkRow}>
      <Link href={supportHref} variant="standalone" className={styles.touchLink}>
        {m.common.supportLink}
      </Link>
    </div>
  ) : undefined;

  return (
    <AuthShell
      {...shellProps}
      eyebrow={
        <span className={styles.statusBadgeRow}>
          <Badge tone="danger" icon={iconError}>
            {m.common.statusErrorLabel}
          </Badge>
        </span>
      }
      title={title ?? m.errorScreen.defaultTitle}
      cardFooter={footer}
    >
      <div data-nds="ErrorScreen" className={styles.statusHero}>
        <InlineAlert tone="danger">
          {message ?? m.errorScreen.defaultDescription}
        </InlineAlert>

        {referenceCode && (
          <Stack gap="2">
            <Text size="sm" tone="muted">
              {m.errorScreen.referenceCodeLabel}
            </Text>
            <div className={styles.codeRow}>
              <Ltr>
                <Code>{referenceCode}</Code>
              </Ltr>
              <CopyButton
                value={referenceCode}
                aria-label={m.errorScreen.copyReferenceCode}
              >
                {m.errorScreen.copyReferenceCode}
              </CopyButton>
            </div>
            <Text size="xs" tone="subtle" leading="text">
              {m.errorScreen.nextStepNote}
            </Text>
          </Stack>
        )}

        <div className={styles.actionsStack}>
          {backHref ? (
            <LinkButton href={backHref} variant="primary" iconStart={iconArrowStart} fullWidth>
              {backLabel ?? m.common.backToApp}
            </LinkButton>
          ) : onRetry ? (
            <Button type="button" variant="primary" iconStart={iconRefresh} fullWidth onPress={onRetry}>
              {backLabel ?? m.common.retryAction}
            </Button>
          ) : null}

          {!supportHref && onRetry && backHref && (
            <Button type="button" variant="secondary" iconStart={iconHelp} fullWidth onPress={onRetry}>
              {m.common.retryAction}
            </Button>
          )}
        </div>
      </div>
    </AuthShell>
  );
}

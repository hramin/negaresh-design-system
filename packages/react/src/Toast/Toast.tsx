import {
  iconClose,
  iconError,
  iconInfo,
  iconSuccess,
  iconWarning,
  type IconDefinition,
} from '@negaresh/icons';
import {
  createContext,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  Button as RacButton,
  type QueuedToast,
  Text as RacText,
  UNSTABLE_Toast as RacToast,
  UNSTABLE_ToastContent as RacToastContent,
  UNSTABLE_ToastQueue as RacToastQueue,
  UNSTABLE_ToastRegion as RacToastRegion,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Toast.module.css';

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type ToastPlacement = 'bottom-end' | 'bottom-center' | 'top-end';

const TONE_ICONS: Record<Exclude<ToastTone, 'neutral'>, IconDefinition> = {
  info: iconInfo,
  success: iconSuccess,
  warning: iconWarning,
  danger: iconError,
};

export interface ToastContentData {
  /** Primary short notification message. */
  title: ReactNode;
  /** Optional supporting details. */
  description?: ReactNode;
  /** Visual and semantic tone. Default `'neutral'` (inverse surface). */
  tone?: ToastTone | undefined;
  /** Override the default semantic icon, or pass `false` to omit. */
  icon?: IconDefinition | false | undefined;
  /** Optional single inline action label (e.g. «بازگردانی» or «مشاهده»). */
  actionLabel?: string | undefined;
  /** Called when the toast action button is pressed. */
  onAction?: (() => void) | undefined;
}

export interface ToastAddOptions {
  /** Auto-dismiss timeout in milliseconds. Omit for persistent toasts. */
  timeout?: number | undefined;
  /** Optional priority for queue ordering. */
  priority?: number | undefined;
  /** Called when the toast closes. */
  onClose?: (() => void) | undefined;
}

/** Owned wrapper around React Aria's toast queue so internal `UNSTABLE_*` names stay private. */
export interface NdsToastQueue {
  /** Enqueues a toast and returns its unique key. */
  add: (content: ToastContentData, options?: ToastAddOptions) => string;
  /** Closes a toast by key. */
  close: (key: string) => void;
  /** Clears all queued and visible toasts. */
  clear: () => void;
  /** Pauses active toast timers. */
  pauseAll: () => void;
  /** Resumes paused toast timers. */
  resumeAll: () => void;
  /** @internal Underlying React Aria queue instance for `ToastRegion`. */
  readonly _internal: RacToastQueue<ToastContentData>;
}

/** Creates a standalone toast queue that can be passed to `<ToastRegion queue={queue} />`. */
export function createToastQueue(options?: { maxVisibleToasts?: number }): NdsToastQueue {
  const internal = new RacToastQueue<ToastContentData>({
    maxVisibleToasts: options?.maxVisibleToasts ?? 3,
  });
  return {
    add: (content, addOptions) => {
      if (!addOptions) return internal.add(content);
      const racOptions: { timeout?: number; priority?: number; onClose?: () => void } = {};
      if (addOptions.timeout !== undefined) racOptions.timeout = addOptions.timeout;
      if (addOptions.priority !== undefined) racOptions.priority = addOptions.priority;
      if (addOptions.onClose !== undefined) racOptions.onClose = addOptions.onClose;
      return internal.add(content, racOptions);
    },
    close: (key) => internal.close(key),
    clear: () => internal.clear(),
    pauseAll: () => internal.pauseAll(),
    resumeAll: () => internal.resumeAll(),
    _internal: internal,
  };
}

export interface ToastRegionProps {
  /** Toast queue created by `createToastQueue()`. */
  queue: NdsToastQueue;
  /** Logical corner placement on desktop. Default `'bottom-end'`. */
  placement?: ToastPlacement | undefined;
  /** Accessible name for the notifications landmark. Defaults to `messages.toastRegionLabel`. */
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Floating notifications region powered by React Aria Components.
 * Pauses auto-dismiss timers on hover/focus and supports F6 landmark navigation.
 * SSR-safe: renders cleanly without `window` or `document`.
 */
export function ToastRegion({
  queue,
  placement = 'bottom-end',
  'aria-label': ariaLabel,
  className,
  ref,
}: ToastRegionProps) {
  const messages = useNdsMessages();
  return (
    <RacToastRegion
      ref={ref}
      queue={queue._internal}
      aria-label={ariaLabel ?? messages.toastRegionLabel}
      data-nds="ToastRegion"
      data-placement={placement}
      className={cx(styles.region, className)}
    >
      {({ toast }) => <Toast toast={toast} queue={queue} />}
    </RacToastRegion>
  );
}

interface QueuedToastProps {
  /** Queued toast object from `ToastRegion`. */
  toast: QueuedToast<ToastContentData>;
  /** Optional queue reference so pressing the action button can close the toast. */
  queue?: NdsToastQueue | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

interface StaticToastProps extends ToastContentData {
  toast?: undefined;
  /** Shows a dismiss button in static/gallery mode. Default `true`. */
  isDismissible?: boolean | undefined;
  /** Called when the dismiss button is pressed in static mode. */
  onDismiss?: (() => void) | undefined;
  /** Accessible label for the close button. Defaults to `messages.dismiss`. */
  dismissLabel?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

export type ToastProps = QueuedToastProps | StaticToastProps;

function resolveToastIcon(tone: ToastTone, icon: IconDefinition | false | undefined) {
  if (icon === false) return null;
  if (icon) return icon;
  return tone === 'neutral' ? null : TONE_ICONS[tone];
}

/**
 * Floating notification card (`neutral` inverse or tinted semantic tones) with
 * `--nds-shadow-overlay`, optional action button, and ≥ 44 × 44 px close button.
 * Renders inside `<ToastRegion>` (queued) or standalone for SSR/static galleries.
 */
export function Toast(props: ToastProps) {
  const messages = useNdsMessages();

  if (props.toast) {
    const { toast, queue, className, ref } = props;
    const { title, description, tone = 'neutral', icon, actionLabel, onAction } = toast.content;
    const resolvedIcon = resolveToastIcon(tone, icon);

    return (
      <RacToast
        ref={ref}
        toast={toast}
        data-nds="Toast"
        data-tone={tone}
        className={cx(styles.toast, className)}
      >
        {resolvedIcon && (
          <span className={cx(styles.icon)} aria-hidden="true">
            <Icon icon={resolvedIcon} size="md" />
          </span>
        )}
        <RacToastContent className={cx(styles.content)}>
          <RacText slot="title" className={cx(styles.title)}>
            {title}
          </RacText>
          {description !== undefined && description !== null && (
            <RacText slot="description" className={cx(styles.description)}>
              {description}
            </RacText>
          )}
        </RacToastContent>
        <div className={cx(styles.controls)}>
          {actionLabel && (
            <RacButton
              className={cx(styles.action)}
              onPress={() => {
                onAction?.();
                queue?.close(toast.key);
              }}
            >
              {actionLabel}
            </RacButton>
          )}
          <RacButton
            slot="close"
            aria-label={messages.dismiss}
            className={cx(styles.close)}
          >
            <Icon icon={iconClose} size="sm" />
          </RacButton>
        </div>
      </RacToast>
    );
  }

  const {
    title,
    description,
    tone = 'neutral',
    icon,
    actionLabel,
    onAction,
    isDismissible = true,
    onDismiss,
    dismissLabel,
    className,
    ref,
  } = props;
  const resolvedIcon = resolveToastIcon(tone, icon);

  return (
    <div
      ref={ref}
      role={tone === 'danger' ? 'alert' : 'status'}
      data-nds="Toast"
      data-tone={tone}
      data-static="true"
      className={cx(styles.toast, className)}
    >
      {resolvedIcon && (
        <span className={cx(styles.icon)} aria-hidden="true">
          <Icon icon={resolvedIcon} size="md" />
        </span>
      )}
      <div className={cx(styles.content)}>
        <span className={cx(styles.title)}>{title}</span>
        {description !== undefined && description !== null && (
          <span className={cx(styles.description)}>{description}</span>
        )}
      </div>
      <div className={cx(styles.controls)}>
        {actionLabel && (
          <RacButton className={cx(styles.action)} onPress={() => onAction?.()}>
            {actionLabel}
          </RacButton>
        )}
        {isDismissible && (
          <RacButton
            aria-label={dismissLabel ?? messages.dismiss}
            className={cx(styles.close)}
            onPress={() => onDismiss?.()}
          >
            <Icon icon={iconClose} size="sm" />
          </RacButton>
        )}
      </div>
    </div>
  );
}

export interface ToastController {
  /** Enqueues a toast notification and returns its key. Default timeout: 5000 ms (omitted if `actionLabel` is set unless explicit). */
  add: (content: ToastContentData, options?: ToastAddOptions) => string;
  /** Dismisses an active toast by key. */
  close: (key: string) => void;
  /** Clears all queued and visible toasts. */
  clear: () => void;
}

const ToastContext = createContext<ToastController | null>(null);

export interface ToastProviderProps {
  /** Maximum simultaneously visible toasts. Default `3`. */
  maxVisibleToasts?: number | undefined;
  /** Logical placement of the floating toast region. Default `'bottom-end'`. */
  placement?: ToastPlacement | undefined;
  /** Accessible landmark label override. */
  'aria-label'?: string | undefined;
  children: ReactNode;
}

/**
 * Convenience provider that creates an application toast queue, exposes `useToast()`,
 * and mounts `<ToastRegion />` automatically.
 */
export function ToastProvider({
  maxVisibleToasts = 3,
  placement = 'bottom-end',
  'aria-label': ariaLabel,
  children,
}: ToastProviderProps) {
  const queue = useMemo(() => createToastQueue({ maxVisibleToasts }), [maxVisibleToasts]);

  const add = useCallback(
    (content: ToastContentData, options?: ToastAddOptions) => {
      const resolvedTimeout =
        options?.timeout !== undefined
          ? options.timeout
          : content.actionLabel
            ? undefined
            : 5000;
      const mergedOptions: ToastAddOptions = {
        ...options,
        ...(resolvedTimeout !== undefined ? { timeout: resolvedTimeout } : {}),
      };
      return queue.add(content, mergedOptions);
    },
    [queue],
  );

  const close = useCallback((key: string) => queue.close(key), [queue]);
  const clear = useCallback(() => queue.clear(), [queue]);

  const controller = useMemo(() => ({ add, close, clear }), [add, close, clear]);

  return (
    <ToastContext.Provider value={controller}>
      {children}
      <ToastRegion queue={queue} placement={placement} aria-label={ariaLabel} />
    </ToastContext.Provider>
  );
}

/** Returns `{ add, close, clear }` from the nearest `<ToastProvider>`. */
export function useToast(): ToastController {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast() must be used inside <ToastProvider>.');
  }
  return ctx;
}

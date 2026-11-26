import { iconUser } from '@negaresh/icons';
import {
  Children,
  createContext,
  type ReactNode,
  type Ref,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarTone = 'neutral' | 'accent' | 'info' | 'success';

const AvatarGroupSizeContext = createContext<AvatarSize | undefined>(undefined);

const PERSIAN_HONORIFICS = new Set(['دکتر', 'دكتر', 'مهندس', 'استاد', 'آقای', 'خانم']);

/**
 * Extracts up to two initials from a Persian or Latin full name.
 * Inserts a space between non-ASCII (Persian/Arabic) letters so cursive shaping
 * never joins initials into an unintended word (e.g. «سارا رضایی» → «س ر»).
 */
export function getInitials(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const rawWords = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (rawWords.length === 0) return undefined;

  const words =
    rawWords.length > 1 && PERSIAN_HONORIFICS.has(rawWords[0] as string)
      ? rawWords.slice(1)
      : rawWords;

  const firstChar = Array.from(words[0] ?? '')[0];
  if (!firstChar) return undefined;
  if (words.length === 1) return firstChar.toUpperCase();

  const lastChar = Array.from(words[words.length - 1] ?? '')[0];
  if (!lastChar) return firstChar.toUpperCase();

  const isAscii = /^[A-Za-z]$/.test(firstChar) && /^[A-Za-z]$/.test(lastChar);
  return isAscii
    ? `${firstChar.toUpperCase()}${lastChar.toUpperCase()}`
    : `${firstChar} ${lastChar}`;
}

export interface AvatarProps {
  /** Optional portrait image URL. Falls back to Persian initials or user icon if missing or broken. */
  src?: string | undefined;
  /** Person's full name; used to derive Persian initials and default accessible alt text. */
  name?: string | undefined;
  /** Explicit alt text. Pass `alt=""` to mark the avatar decorative (`aria-hidden="true"`). */
  alt?: string | undefined;
  /** Explicit initials override (skips automatic extraction from `name`). */
  initials?: string | undefined;
  /** Diameter token: `xs` (24), `sm` (32), `md` (40, default), `lg` (48), `xl` (64). */
  size?: AvatarSize | undefined;
  /** Semantic surface tone for initials/icon fallback. Default `'neutral'`. */
  tone?: AvatarTone | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
}

/** Displays a user or expert portrait with Persian initials and icon fallback. */
export function Avatar({
  src,
  name,
  alt,
  initials,
  size,
  tone = 'neutral',
  className,
  ref,
}: AvatarProps) {
  const groupSize = useContext(AvatarGroupSizeContext);
  const resolvedSize = size ?? groupSize ?? 'md';
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (failedSrc && failedSrc !== src) {
      setFailedSrc(undefined);
    }
  }, [src, failedSrc]);

  const showImage = Boolean(src) && failedSrc !== src;
  const resolvedInitials = initials ?? getInitials(name);
  const isDecorative = alt === '';
  const accessibleName = isDecorative ? undefined : (alt ?? name);
  const iconSize = resolvedSize === 'xs' || resolvedSize === 'sm' ? 'sm' : 'md';

  return (
    <span
      ref={ref}
      data-nds="Avatar"
      data-size={resolvedSize}
      data-tone={tone}
      className={cx(styles.avatar, className)}
      {...(isDecorative
        ? { 'aria-hidden': true }
        : !showImage && accessibleName
          ? { role: 'img', 'aria-label': accessibleName }
          : {})}
    >
      {showImage ? (
        <img
          src={src}
          alt={isDecorative ? '' : (accessibleName ?? '')}
          className={cx(styles.image)}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      ) : resolvedInitials ? (
        <span className={cx(styles.initials)} aria-hidden="true">
          {resolvedInitials}
        </span>
      ) : (
        <Icon icon={iconUser} size={iconSize} />
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  /** Maximum number of visible avatars before collapsing remaining items into a Persian `+N` counter. */
  max?: number | undefined;
  /** Optional total member count when only a subset of avatars is passed as `children`. */
  total?: number | undefined;
  /** Shared size applied to child avatars and the overflow counter. Default `'md'`. */
  size?: AvatarSize | undefined;
  /** Accessible group label (e.g. «اعضای تیم»). */
  'aria-label'?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Stacked cluster of `Avatar` items with logical RTL overlap and Persian overflow count (`formatNumber`). */
export function AvatarGroup({
  max,
  total,
  size = 'md',
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: AvatarGroupProps) {
  const m = useNdsMessages();
  const items = Children.toArray(children);
  const visible = max !== undefined && max >= 0 ? items.slice(0, max) : items;
  const effectiveTotal = total !== undefined ? Math.max(total, items.length) : items.length;
  const overflow = Math.max(0, effectiveTotal - visible.length);

  return (
    <AvatarGroupSizeContext.Provider value={size}>
      {/* biome-ignore lint/a11y/useSemanticElements: AvatarGroup is a non-form display cluster, not a form fieldset */}
      <div
        ref={ref}
        role="group"
        {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
        data-nds="AvatarGroup"
        data-size={size}
        className={cx(styles.group, className)}
      >
        {visible}
        {overflow > 0 && (
          <span
            className={cx(styles.overflow)}
            data-nds="AvatarGroupOverflow"
            data-size={size}
            role="img"
            aria-label={m.avatarOverflowLabel(overflow)}
          >
            <span dir="ltr" className={cx(styles.overflowCount)} aria-hidden="true">
              {m.avatarOverflow(overflow)}
            </span>
          </span>
        )}
      </div>
    </AvatarGroupSizeContext.Provider>
  );
}

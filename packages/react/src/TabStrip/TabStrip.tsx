import type { IconDefinition } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import {
  Button as RacButton,
  type Key,
  Link as RacLink,
  type LinkProps as RacLinkProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './TabStrip.module.css';

export interface TabStripItemData {
  id: Key;
  label: ReactNode;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  icon?: IconDefinition | undefined;
  badge?: ReactNode | number | undefined;
  isCurrent?: boolean | undefined;
  isDisabled?: boolean | undefined;
}

export interface TabStripItemProps
  extends Pick<RacLinkProps, 'href' | 'target' | 'rel' | 'routerOptions' | 'id'> {
  /** Disables interaction on this item. */
  isDisabled?: boolean | undefined;
  /** Marks the item as the current section (`aria-current="page"`). */
  isCurrent?: boolean | undefined;
  /** Optional leading icon (`16 px`). */
  icon?: IconDefinition | undefined;
  /** Optional trailing count or pill (numbers formatted with `formatNumber`). */
  badge?: ReactNode | number | undefined;
  /** Press handler when rendered as an interactive button or link. */
  onPress?: (() => void) | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Single scrollable tab-strip item rendered as a React Aria `Link` (when `href` is set) or `Button`. */
export function TabStripItem({
  href,
  isCurrent = false,
  icon,
  badge,
  onPress,
  isDisabled,
  target,
  rel,
  routerOptions,
  id,
  children,
  className,
  ref,
}: TabStripItemProps) {
  const formattedBadge =
    typeof badge === 'number' ? formatNumber(badge, { maximumFractionDigits: 0 }) : badge;

  const content = (
    <>
      {icon && (
        <span className={cx(styles.icon)} aria-hidden="true">
          <Icon icon={icon} size="sm" />
        </span>
      )}
      <span>{children}</span>
      {formattedBadge !== undefined && formattedBadge !== null && (
        <span className={cx(styles.badge)}>{formattedBadge}</span>
      )}
    </>
  );

  if (href !== undefined) {
    return (
      <li className={cx(styles.entry)}>
        <RacLink
          ref={ref as Ref<HTMLAnchorElement> | undefined}
          href={href}
          {...(id !== undefined ? { id } : {})}
          {...(target !== undefined ? { target } : {})}
          {...(rel !== undefined ? { rel } : {})}
          {...(routerOptions !== undefined ? { routerOptions } : {})}
          {...(isDisabled !== undefined ? { isDisabled } : {})}
          {...(onPress !== undefined ? { onPress } : {})}
          {...(isCurrent ? { 'aria-current': 'page' as const } : {})}
          data-nds="TabStripItem"
          data-current={isCurrent ? 'true' : undefined}
          className={cx(styles.item, className)}
        >
          {content}
        </RacLink>
      </li>
    );
  }

  return (
    <li className={cx(styles.entry)}>
      <RacButton
        ref={ref as Ref<HTMLButtonElement> | undefined}
        type="button"
        {...(id !== undefined ? { id } : {})}
        {...(isDisabled !== undefined ? { isDisabled } : {})}
        {...(onPress !== undefined ? { onPress } : {})}
        {...(isCurrent ? { 'aria-current': 'page' as const } : {})}
        data-nds="TabStripItem"
        data-current={isCurrent ? 'true' : undefined}
        className={cx(styles.item, className)}
      >
        {content}
      </RacButton>
    </li>
  );
}

export interface TabStripProps {
  /** Accessible landmark name (defaults to `messages.tabStripLabel` when `as="nav"`). */
  'aria-label'?: string | undefined;
  /** Render as `<nav>` (default) or `<div>` (when embedded inside `SideNav`'s `<nav>` landmark). */
  as?: 'nav' | 'div' | undefined;
  /** Optional declarative list of items. */
  items?: readonly TabStripItemData[] | undefined;
  /** Selected item key when using declarative `items`. */
  selectedKey?: Key | undefined;
  /** Callback invoked when a declarative item is activated. */
  onSelect?: ((key: Key) => void) | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Scrollable horizontal mobile navigation strip with logical RTL overflow, snap points,
 * and ≥ 44 px touch targets. Used standalone or as the `< 900 px` mobile adaptation of `SideNav`.
 */
export function TabStrip({
  'aria-label': ariaLabel,
  as = 'nav',
  items,
  selectedKey,
  onSelect,
  children,
  className,
  ref,
}: TabStripProps) {
  const m = useNdsMessages();
  const list = (
    <ul className={cx(styles.list)}>
      {items?.map((item) => (
        <TabStripItem
          key={String(item.id)}
          {...(item.href !== undefined ? { href: item.href } : {})}
          icon={item.icon}
          badge={item.badge}
          isDisabled={item.isDisabled}
          isCurrent={selectedKey !== undefined ? item.id === selectedKey : item.isCurrent}
          onPress={() => {
            item.onPress?.();
            onSelect?.(item.id);
          }}
        >
          {item.label}
        </TabStripItem>
      ))}
      {children}
    </ul>
  );

  if (as === 'div') {
    return (
      <div
        ref={ref as Ref<HTMLDivElement> | undefined}
        data-nds="TabStrip"
        className={cx(styles.strip, className)}
      >
        {list}
      </div>
    );
  }

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? m.tabStripLabel}
      data-nds="TabStrip"
      className={cx(styles.strip, className)}
    >
      {list}
    </nav>
  );
}

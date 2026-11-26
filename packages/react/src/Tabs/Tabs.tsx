import type { IconDefinition } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import {
  type Key,
  Tab as RacTab,
  TabList as RacTabList,
  type TabListProps as RacTabListProps,
  TabPanel as RacTabPanel,
  type TabPanelProps as RacTabPanelProps,
  type TabProps as RacTabProps,
  Tabs as RacTabs,
  type TabsProps as RacTabsProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './Tabs.module.css';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'underline' | 'pill';

export interface TabsProps
  extends Pick<
    RacTabsProps,
    | 'selectedKey'
    | 'defaultSelectedKey'
    | 'onSelectionChange'
    | 'disabledKeys'
    | 'isDisabled'
    | 'keyboardActivation'
    | 'id'
  > {
  /** `horizontal` (default) or `vertical` (e.g. Ravanma leaf 3 settings/content). */
  orientation?: TabsOrientation | undefined;
  /** Visual style: hairline `underline` (default) or `pill` bar. */
  variant?: TabsVariant | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Accessible horizontal and vertical tabs built on React Aria `Tabs`.
 * Supports RTL arrow-key navigation, automatic/manual activation, and zero resting shadows (D-77).
 */
export function Tabs({
  orientation = 'horizontal',
  variant = 'underline',
  className,
  children,
  ref,
  ...rest
}: TabsProps) {
  return (
    <RacTabs
      {...rest}
      ref={ref}
      orientation={orientation}
      data-nds="Tabs"
      data-variant={variant}
      className={cx(styles.tabs, className)}
    >
      {children}
    </RacTabs>
  );
}

export interface TabListProps<T extends object>
  extends Pick<RacTabListProps<T>, 'items' | 'aria-label' | 'aria-labelledby'> {
  children: RacTabListProps<T>['children'];
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Container for `<Tab>` triggers inside `<Tabs>`. */
export function TabList<T extends object>({
  className,
  children,
  ref,
  ...rest
}: TabListProps<T>) {
  return (
    <RacTabList {...rest} ref={ref} data-nds="TabList" className={cx(styles.list, className)}>
      {children}
    </RacTabList>
  );
}

export interface TabProps
  extends Pick<
    RacTabProps,
    'id' | 'isDisabled' | 'href' | 'target' | 'rel' | 'routerOptions' | 'aria-label'
  > {
  /** Optional leading icon (`16 px`). */
  icon?: IconDefinition | undefined;
  /** Optional trailing count or metadata badge (numbers formatted to Persian digits). */
  badge?: ReactNode | number | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Individual tab button/link inside `<TabList>` with a ≥ 44 px touch target. */
export function Tab({ icon, badge, children, className, ref, ...rest }: TabProps) {
  const formattedBadge =
    typeof badge === 'number' ? formatNumber(badge, { maximumFractionDigits: 0 }) : badge;

  return (
    <RacTab {...rest} ref={ref} data-nds="Tab" className={cx(styles.tab, className)}>
      {icon && (
        <span className={cx(styles.tabIcon)} aria-hidden="true">
          <Icon icon={icon} size="sm" />
        </span>
      )}
      <span>{children}</span>
      {formattedBadge !== undefined && formattedBadge !== null && (
        <span className={cx(styles.tabBadge)}>{formattedBadge}</span>
      )}
    </RacTab>
  );
}

export interface TabPanelProps
  extends Pick<RacTabPanelProps, 'id' | 'shouldForceMount' | 'aria-label' | 'aria-labelledby'> {
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Content panel associated with a `<Tab>` of matching `id`. */
export function TabPanel({ children, className, ref, ...rest }: TabPanelProps) {
  return (
    <RacTabPanel {...rest} ref={ref} data-nds="TabPanel" className={cx(styles.panel, className)}>
      {children}
    </RacTabPanel>
  );
}

export type { Key as TabKey };

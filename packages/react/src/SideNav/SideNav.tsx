import { iconChevronDown, type IconDefinition } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import { createContext, type ReactNode, type Ref, useContext, useId } from 'react';
import {
  Button as RacButton,
  Disclosure as RacDisclosure,
  DisclosurePanel as RacDisclosurePanel,
  Link as RacLink,
  type LinkProps as RacLinkProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { TabStrip, type TabStripItemData } from '../TabStrip/TabStrip.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './SideNav.module.css';

export interface SideNavItemData {
  id: string;
  label: ReactNode;
  href?: string | undefined;
  onPress?: (() => void) | undefined;
  icon?: IconDefinition | undefined;
  badge?: ReactNode | number | undefined;
  isCurrent?: boolean | undefined;
  isDisabled?: boolean | undefined;
  /** Roles allowed to see this item. Visible to everyone when omitted. */
  roles?: readonly string[] | undefined;
}

export interface SideNavGroupData {
  id: string;
  title?: ReactNode | undefined;
  /** Roles allowed to see this group. Visible to everyone when omitted. */
  roles?: readonly string[] | undefined;
  /** Allow collapsing/expanding the group on desktop. Default `false`. */
  isCollapsible?: boolean | undefined;
  /** Initial expanded state when `isCollapsible` is true. Default `true`. */
  defaultExpanded?: boolean | undefined;
  items: readonly SideNavItemData[];
}

const SideNavRolesContext = createContext<readonly string[] | undefined>(undefined);

function isRoleAllowed(
  requiredRoles: readonly string[] | undefined,
  userRoles: readonly string[] | undefined,
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (!userRoles) return true;
  return requiredRoles.some((role) => userRoles.includes(role));
}

export interface SideNavItemProps
  extends Pick<RacLinkProps, 'href' | 'target' | 'rel' | 'routerOptions' | 'id'> {
  /** Disables interaction on this navigation item. */
  isDisabled?: boolean | undefined;
  /** Marks this navigation link as the active page (`aria-current="page"`). */
  isCurrent?: boolean | undefined;
  /** Optional leading icon (`16 px`). */
  icon?: IconDefinition | undefined;
  /** Optional trailing count or badge (numbers formatted to Persian digits). */
  badge?: ReactNode | number | undefined;
  /** Roles allowed to see this item (filtered against `SideNav.userRoles`). */
  roles?: readonly string[] | undefined;
  onPress?: (() => void) | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Individual link or action row inside `<SideNav>` / `<SideNavGroup>`. */
export function SideNavItem({
  href,
  isCurrent = false,
  icon,
  badge,
  roles,
  onPress,
  isDisabled,
  target,
  rel,
  routerOptions,
  id,
  children,
  className,
  ref,
}: SideNavItemProps) {
  const userRoles = useContext(SideNavRolesContext);
  if (!isRoleAllowed(roles, userRoles)) return null;

  const formattedBadge =
    typeof badge === 'number' ? formatNumber(badge, { maximumFractionDigits: 0 }) : badge;

  const inner = (
    <>
      {icon && (
        <span className={cx(styles.itemIcon)} aria-hidden="true">
          <Icon icon={icon} size="sm" />
        </span>
      )}
      <span className={cx(styles.itemLabel)}>{children}</span>
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
          data-nds="SideNavItem"
          data-current={isCurrent ? 'true' : undefined}
          className={cx(styles.item, className)}
        >
          {inner}
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
        data-nds="SideNavItem"
        data-current={isCurrent ? 'true' : undefined}
        className={cx(styles.item, className)}
      >
        {inner}
      </RacButton>
    </li>
  );
}

export interface SideNavGroupProps {
  /** Group heading shown on desktop. */
  title?: ReactNode | undefined;
  /** Roles allowed to see this group (filtered against `SideNav.userRoles`). */
  roles?: readonly string[] | undefined;
  /** Allow collapsing the group on desktop using React Aria `Disclosure`. Default `false`. */
  isCollapsible?: boolean | undefined;
  /** Initial expanded state when `isCollapsible` is true. Default `true`. */
  defaultExpanded?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
}

/** Logical group of `<SideNavItem>` links with optional heading and desktop collapse toggle. */
export function SideNavGroup({
  title,
  roles,
  isCollapsible = false,
  defaultExpanded = true,
  children,
  className,
}: SideNavGroupProps) {
  const userRoles = useContext(SideNavRolesContext);
  const headingId = useId();
  if (!isRoleAllowed(roles, userRoles)) return null;

  if (isCollapsible && title) {
    return (
      <RacDisclosure
        defaultExpanded={defaultExpanded}
        data-nds="SideNavGroup"
        className={cx(styles.group, styles.disclosure, className)}
      >
        <RacButton slot="trigger" className={cx(styles.groupTrigger)}>
          <span>{title}</span>
          <span className={cx(styles.groupChevron)} aria-hidden="true">
            <Icon icon={iconChevronDown} size="sm" />
          </span>
        </RacButton>
        <RacDisclosurePanel>
          <ul className={cx(styles.list)}>{children}</ul>
        </RacDisclosurePanel>
      </RacDisclosure>
    );
  }

  return (
    <div data-nds="SideNavGroup" className={cx(styles.group, className)}>
      {title && (
        <p id={headingId} className={cx(styles.groupTitle)}>
          {title}
        </p>
      )}
      <ul className={cx(styles.list)} aria-labelledby={title ? headingId : undefined}>
        {children}
      </ul>
    </div>
  );
}

export interface SideNavProps {
  /** Accessible navigation landmark label (defaults to `messages.sideNavLabel`). */
  'aria-label'?: string | undefined;
  /** Declarative grouped items; automatically filtered by `userRoles` and mirrored into mobile `TabStrip`. */
  groups?: readonly SideNavGroupData[] | undefined;
  /** Active user roles for role-based filtering of groups and items. */
  userRoles?: readonly string[] | undefined;
  /** Adapt to a horizontal scrollable `TabStrip` below 900 px (D-90). Default `true`. */
  adaptToTabStrip?: boolean | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Grouped workspace sidebar navigation (`248 px` desktop) with badges and role-based filtering.
 * Adapts to a scrollable horizontal `TabStrip` below `900 px` inside the same `<nav>` landmark
 * for SSR parity and clean accessibility.
 */
export function SideNav({
  'aria-label': ariaLabel,
  groups,
  userRoles,
  adaptToTabStrip = true,
  children,
  className,
  ref,
}: SideNavProps) {
  const m = useNdsMessages();
  const hasGroups = groups !== undefined;

  const visibleGroups = groups
    ?.filter((group) => isRoleAllowed(group.roles, userRoles))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isRoleAllowed(item.roles, userRoles)),
    }))
    .filter((group) => group.items.length > 0);

  const mobileStripItems: TabStripItemData[] = visibleGroups
    ? visibleGroups.flatMap((group) =>
        group.items.map((item) => ({
          id: item.id,
          label: item.label,
          href: item.href,
          onPress: item.onPress,
          icon: item.icon,
          badge: item.badge,
          isCurrent: item.isCurrent,
          isDisabled: item.isDisabled,
        })),
      )
    : [];

  return (
    <SideNavRolesContext.Provider value={userRoles}>
      <nav
        ref={ref}
        aria-label={ariaLabel ?? m.sideNavLabel}
        data-nds="SideNav"
        data-adapt={adaptToTabStrip ? 'true' : 'false'}
        data-has-groups={hasGroups ? 'true' : 'false'}
        className={cx(styles.nav, className)}
      >
        <div className={cx(styles.desktop)}>
          {visibleGroups?.map((group) => (
            <SideNavGroup
              key={group.id}
              title={group.title}
              isCollapsible={group.isCollapsible}
              defaultExpanded={group.defaultExpanded}
            >
              {group.items.map((item) => (
                <SideNavItem
                  key={item.id}
                  {...(item.href !== undefined ? { href: item.href } : {})}
                  onPress={item.onPress}
                  icon={item.icon}
                  badge={item.badge}
                  isCurrent={item.isCurrent}
                  isDisabled={item.isDisabled}
                >
                  {item.label}
                </SideNavItem>
              ))}
            </SideNavGroup>
          ))}
          {children}
        </div>
        {adaptToTabStrip && hasGroups && mobileStripItems.length > 0 && (
          <div className={cx(styles.mobileStrip)}>
            <TabStrip as="div" items={mobileStripItems} />
          </div>
        )}
      </nav>
    </SideNavRolesContext.Provider>
  );
}

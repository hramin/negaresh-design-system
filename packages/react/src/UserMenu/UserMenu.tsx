import {
  iconMonitor,
  iconMoon,
  iconSignOut,
  iconSun,
  type IconDefinition,
} from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import type { Key, Selection } from 'react-aria-components';
import { AccountPill } from '../AccountPill/AccountPill.tsx';
import { Avatar, type AvatarTone } from '../Avatar/Avatar.tsx';
import { cx } from '../internal/cx.ts';
import { Ltr } from '../Ltr/Ltr.tsx';
import {
  Menu,
  MenuItem,
  type MenuProps,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from '../Menu/Menu.tsx';
import {
  type ThemeChoice,
  useNdsMessages,
  useTheme,
} from '../ThemeProvider/ThemeProvider.tsx';
import styles from './UserMenu.module.css';

export interface UserMenuRole {
  id: string;
  label: string;
  description?: string | undefined;
}

export interface UserMenuItemData {
  id: Key;
  label: ReactNode;
  href?: string | undefined;
  icon?: IconDefinition | undefined;
  description?: ReactNode | undefined;
  tone?: 'default' | 'danger' | undefined;
  isDisabled?: boolean | undefined;
  /** Roles allowed to see this item when `activeRole` is set. */
  roles?: readonly string[] | undefined;
  onAction?: (() => void) | undefined;
}

export interface UserMenuProps {
  /** Visible trigger label on desktop (e.g. masked phone or display name); hidden below 900 px. */
  label: ReactNode;
  /** Required accessible name for the `AccountPill` trigger (label is visually hidden on mobile). */
  'aria-label': string;
  /** Wrap trigger `label` in `<Ltr>` (use for masked phones or emails, D-86). Default `false`. */
  ltr?: boolean | undefined;
  /** Optional display name shown in the menu header and used for `Avatar` initials. */
  name?: string | undefined;
  /** Optional secondary line in the menu header (e.g. masked phone or email). */
  subtitle?: ReactNode | undefined;
  /** Wrap `subtitle` in `<Ltr>`. Default `false`. */
  ltrSubtitle?: boolean | undefined;
  /** Portrait image URL rendered with NDS `Avatar` on both the trigger pill and menu header. */
  avatarSrc?: string | undefined;
  /** Semantic tone for the `Avatar` fallback in the menu header. Default `'accent'`. */
  avatarTone?: AvatarTone | undefined;
  /** Custom avatar node passed directly to `AccountPill`. */
  avatar?: ReactNode | undefined;
  /** Account navigation items rendered inside the menu. */
  items?: readonly UserMenuItemData[] | undefined;
  /** Optional selectable roles section (e.g. customer / writer / admin). */
  roles?: readonly UserMenuRole[] | undefined;
  /** Currently active role id. */
  activeRole?: string | undefined;
  /** Called when the user switches roles. */
  onRoleChange?: ((roleId: string) => void) | undefined;
  /** Include a live light / dark / system theme switcher powered by `useTheme()`. Default `false`. */
  showThemeToggle?: boolean | undefined;
  /** Optional sign-out action rendered at the bottom in `danger` tone. */
  onSignOut?: (() => void) | undefined;
  /** Override label for the sign-out item (defaults to `messages.signOut`). */
  signOutLabel?: string | undefined;
  /** Popover placement relative to the trigger. Default `'bottom end'`. */
  placement?: MenuProps<object>['placement'] | undefined;
  /** Accessible name for the menu list (defaults to `messages.userMenuLabel`). */
  menuLabel?: string | undefined;
  isOpen?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  isDisabled?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLButtonElement> | undefined;
}

function firstSelectedKey(selection: Selection): string | undefined {
  if (selection === 'all') return undefined;
  for (const key of selection) return String(key);
  return undefined;
}

/**
 * Account menu composing approved `AccountPill` + `Menu` + Wave 2 `Avatar`,
 * with optional role switching, live theme toggle (`useTheme()`), and sign-out action.
 */
export function UserMenu({
  label,
  'aria-label': ariaLabel,
  ltr = false,
  name,
  subtitle,
  ltrSubtitle = false,
  avatarSrc,
  avatarTone = 'accent',
  avatar,
  items = [],
  roles,
  activeRole,
  onRoleChange,
  showThemeToggle = false,
  onSignOut,
  signOutLabel,
  placement = 'bottom end',
  menuLabel,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDisabled,
  className,
  ref,
}: UserMenuProps) {
  const m = useNdsMessages();
  const { theme, setTheme } = useTheme();

  const resolvedTriggerAvatar =
    avatar ??
    (avatarSrc ? (
      <Avatar
        src={avatarSrc}
        name={name}
        alt=""
        size="sm"
        tone={avatarTone}
        className={cx(styles.triggerAvatar)}
      />
    ) : undefined);

  const visibleItems = items.filter(
    (item) => !item.roles || !activeRole || item.roles.includes(activeRole),
  );

  const hasAccountHeader = Boolean(name || subtitle);
  const hasRoles = Boolean(roles && roles.length > 0);

  const headerTitle = hasAccountHeader ? (
    <span className={cx(styles.header)}>
      <Avatar src={avatarSrc} name={name} alt="" size="sm" tone={avatarTone} />
      <span className={cx(styles.headerText)}>
        {name && <span className={cx(styles.headerName)}>{name}</span>}
        {subtitle && (
          <span className={cx(styles.headerSubtitle)}>
            {ltrSubtitle ? <Ltr>{subtitle}</Ltr> : subtitle}
          </span>
        )}
      </span>
    </span>
  ) : undefined;

  const handleRoleSelect = (selection: Selection) => {
    const next = firstSelectedKey(selection);
    if (next && next !== activeRole) onRoleChange?.(next);
  };

  const handleThemeSelect = (selection: Selection) => {
    const next = firstSelectedKey(selection);
    if (next === 'light' || next === 'dark' || next === 'system') {
      setTheme(next as ThemeChoice);
    }
  };

  return (
    <MenuTrigger
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
    >
      <AccountPill
        ref={ref}
        label={label}
        ltr={ltr}
        aria-label={ariaLabel}
        avatar={resolvedTriggerAvatar}
        {...(isDisabled !== undefined ? { isDisabled } : {})}
        className={className}
      />
      <Menu
        placement={placement}
        aria-label={menuLabel ?? m.userMenuLabel}
        className={cx(styles.menu)}
      >
        {visibleItems.length > 0 && (
          <MenuSection title={headerTitle} aria-label={name ?? m.userMenuLabel}>
            {visibleItems.map((item) => (
              <MenuItem
                key={String(item.id)}
                id={item.id}
                {...(item.href !== undefined ? { href: item.href } : {})}
                {...(item.icon !== undefined ? { icon: item.icon } : {})}
                {...(item.description !== undefined ? { description: item.description } : {})}
                {...(item.tone !== undefined ? { tone: item.tone } : {})}
                {...(item.isDisabled !== undefined ? { isDisabled: item.isDisabled } : {})}
                {...(item.onAction !== undefined ? { onAction: item.onAction } : {})}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuSection>
        )}

        {hasRoles && roles && (
          <>
            {visibleItems.length > 0 && <MenuSeparator />}
            <MenuSection
              title={m.userMenuRolesTitle}
              selectionMode="single"
              selectedKeys={activeRole ? new Set([activeRole]) : new Set()}
              onSelectionChange={handleRoleSelect}
            >
              {roles.map((role) => (
                <MenuItem
                  key={role.id}
                  id={role.id}
                  {...(role.description !== undefined ? { description: role.description } : {})}
                >
                  {role.label}
                </MenuItem>
              ))}
            </MenuSection>
          </>
        )}

        {showThemeToggle && (
          <>
            {(visibleItems.length > 0 || hasRoles) && <MenuSeparator />}
            <MenuSection
              title={m.userMenuThemeTitle}
              selectionMode="single"
              selectedKeys={new Set([theme])}
              onSelectionChange={handleThemeSelect}
            >
              <MenuItem id="light" icon={iconSun}>
                {m.themeLight}
              </MenuItem>
              <MenuItem id="dark" icon={iconMoon}>
                {m.themeDark}
              </MenuItem>
              <MenuItem id="system" icon={iconMonitor}>
                {m.themeSystem}
              </MenuItem>
            </MenuSection>
          </>
        )}

        {onSignOut && (
          <>
            {(visibleItems.length > 0 || hasRoles || showThemeToggle) && <MenuSeparator />}
            <MenuSection aria-label={signOutLabel ?? m.signOut}>
              <MenuItem id="__nds_signout__" icon={iconSignOut} tone="danger" onAction={onSignOut}>
                {signOutLabel ?? m.signOut}
              </MenuItem>
            </MenuSection>
          </>
        )}
      </Menu>
    </MenuTrigger>
  );
}

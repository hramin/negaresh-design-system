import { iconCheck, iconChevronEnd, type IconDefinition } from '@negaresh/icons';
import type { ReactElement, ReactNode } from 'react';
import {
  Header,
  type Key,
  Keyboard,
  Menu as RacMenu,
  MenuItem as RacMenuItem,
  type MenuItemProps as RacMenuItemProps,
  type MenuProps as RacMenuProps,
  MenuSection as RacMenuSection,
  type MenuSectionProps as RacMenuSectionProps,
  MenuTrigger as RacMenuTrigger,
  type MenuTriggerProps as RacMenuTriggerProps,
  Popover,
  Separator,
  SubmenuTrigger as RacSubmenuTrigger,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './Menu.module.css';

export interface MenuTriggerProps
  extends Pick<RacMenuTriggerProps, 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'trigger'> {
  /** A Button or IconButton, then a Menu. */
  children: [ReactElement, ReactElement];
}

/** Opens a Menu from a button (Enter, Space, ArrowDown, long press on touch). */
export function MenuTrigger(props: MenuTriggerProps) {
  return <RacMenuTrigger {...props} />;
}

export interface MenuProps<T extends object>
  extends Pick<
    RacMenuProps<T>,
    | 'items'
    | 'onAction'
    | 'selectionMode'
    | 'selectedKeys'
    | 'defaultSelectedKeys'
    | 'onSelectionChange'
    | 'disabledKeys'
    | 'aria-label'
    | 'aria-labelledby'
    | 'autoFocus'
  > {
  children: RacMenuProps<T>['children'];
  /**
   * Popover placement relative to the trigger (logical). Leave unset: React Aria uses
   * `bottom start` under MenuTrigger and `end top` for submenus.
   */
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end' | 'start top' | 'end top';
  className?: string | undefined;
}

/** The menu popover (floating layer: shadow allowed). Use inside MenuTrigger or SubmenuTrigger. */
export function Menu<T extends object>({ placement, className, ...rest }: MenuProps<T>) {
  return (
    <Popover
      {...(placement ? { placement } : {})}
      className={cx(styles.popover)}
      data-nds="MenuPopover"
    >
      <RacMenu {...rest} data-nds="Menu" className={cx(styles.menu, className)} />
    </Popover>
  );
}

export interface MenuItemProps
  extends Pick<
    RacMenuItemProps,
    'onAction' | 'isDisabled' | 'href' | 'target' | 'rel' | 'routerOptions'
  > {
  /** Key for selection and onAction. */
  id?: Key;
  /** Plain-text label for type-ahead when `children` is not a string. */
  textValue?: string | undefined;
  icon?: IconDefinition | undefined;
  /** Secondary line under the label. */
  description?: ReactNode | undefined;
  /** Keyboard shortcut shown at the end, e.g. `Ctrl+C` (Latin, LTR). */
  shortcut?: string | undefined;
  /** `danger` for destructive actions (word + icon, not colour alone). */
  tone?: 'default' | 'danger';
  children: ReactNode;
}

export function MenuItem({
  icon,
  description,
  shortcut,
  tone = 'default',
  children,
  textValue,
  ...rest
}: MenuItemProps) {
  return (
    <RacMenuItem
      {...rest}
      {...(textValue || typeof children === 'string'
        ? { textValue: textValue ?? (children as string) }
        : {})}
      data-nds="MenuItem"
      data-tone={tone}
      className={cx(styles.item)}
    >
      {({ isSelected, selectionMode, hasSubmenu }) => (
        <>
          {selectionMode !== 'none' && (
            <span className={cx(styles.check)} aria-hidden="true">
              {isSelected && <Icon icon={iconCheck} size="sm" />}
            </span>
          )}
          {icon && <Icon icon={icon} className={cx(styles.itemIcon)} />}
          <span className={cx(styles.itemText)}>
            <Text slot="label" className={cx(styles.label)}>
              {children}
            </Text>
            {description && (
              <Text slot="description" className={cx(styles.description)}>
                {description}
              </Text>
            )}
          </span>
          {shortcut && (
            <Keyboard className={cx(styles.shortcut)} dir="ltr">
              {shortcut}
            </Keyboard>
          )}
          {hasSubmenu && (
            <Icon icon={iconChevronEnd} size="sm" className={cx(styles.submenuIcon)} />
          )}
        </>
      )}
    </RacMenuItem>
  );
}

export interface MenuSectionProps<T extends object>
  extends Pick<
    RacMenuSectionProps<T>,
    'selectionMode' | 'selectedKeys' | 'defaultSelectedKeys' | 'onSelectionChange'
  > {
  /** Visible section heading. */
  title?: ReactNode | undefined;
  'aria-label'?: string;
  children: ReactNode;
}

export function MenuSection<T extends object>({ title, children, ...rest }: MenuSectionProps<T>) {
  return (
    <RacMenuSection {...rest} className={cx(styles.section)}>
      {title && <Header className={cx(styles.sectionTitle)}>{title}</Header>}
      {children}
    </RacMenuSection>
  );
}

export function MenuSeparator() {
  return <Separator className={cx(styles.separator)} />;
}

export interface SubmenuTriggerProps {
  /** A MenuItem, then a Menu. */
  children: [ReactElement, ReactElement];
  /** Delay before opening on hover, ms. */
  delay?: number;
}

/** Nests a Menu under an item; opens with ArrowLeft in RTL (inline end) or Enter. */
export function SubmenuTrigger(props: SubmenuTriggerProps) {
  return <RacSubmenuTrigger {...props} />;
}

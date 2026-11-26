import { iconChevronEnd, iconMore } from '@negaresh/icons';
import { createContext, type ReactNode, type Ref, useContext } from 'react';
import {
  Breadcrumb as RacBreadcrumb,
  Breadcrumbs as RacBreadcrumbs,
  Button as RacButton,
  type Key,
  Link as RacLink,
  type LinkProps as RacLinkProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { Menu, MenuItem, MenuTrigger } from '../Menu/Menu.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbsSeparator = 'chevron' | 'slash';

const BreadcrumbSeparatorContext = createContext<BreadcrumbsSeparator>('chevron');

export interface BreadcrumbItemData {
  id: Key;
  label: ReactNode;
  href?: string | undefined;
  isDisabled?: boolean | undefined;
  onPress?: (() => void) | undefined;
}

export interface BreadcrumbItemProps
  extends Pick<RacLinkProps, 'href' | 'target' | 'rel' | 'routerOptions'> {
  id?: Key | undefined;
  isDisabled?: boolean | undefined;
  /** Optional click/press handler. */
  onPress?: (() => void) | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLLIElement> | undefined;
}

function SeparatorGlyph({ variant }: { variant: BreadcrumbsSeparator }) {
  return (
    <span className={cx(styles.separator)} aria-hidden="true">
      {variant === 'slash' ? '/' : <Icon icon={iconChevronEnd} size="sm" />}
    </span>
  );
}

/** Individual breadcrumb entry inside `<Breadcrumbs>` built on React Aria `Breadcrumb` + `Link`. */
export function BreadcrumbItem({
  id,
  href,
  target,
  rel,
  routerOptions,
  isDisabled,
  onPress,
  children,
  className,
  ref,
}: BreadcrumbItemProps) {
  const separator = useContext(BreadcrumbSeparatorContext);

  return (
    <RacBreadcrumb
      ref={ref}
      {...(id !== undefined ? { id } : {})}
      data-nds="BreadcrumbItem"
      className={cx(styles.item, className)}
    >
      {({ isCurrent }) => (
        <>
          <RacLink
            {...(href !== undefined && !isCurrent ? { href } : {})}
            {...(target !== undefined ? { target } : {})}
            {...(rel !== undefined ? { rel } : {})}
            {...(routerOptions !== undefined ? { routerOptions } : {})}
            {...(isDisabled !== undefined ? { isDisabled } : {})}
            {...(onPress !== undefined ? { onPress } : {})}
            className={cx(styles.link)}
          >
            {children}
          </RacLink>
          {!isCurrent && <SeparatorGlyph variant={separator} />}
        </>
      )}
    </RacBreadcrumb>
  );
}

export interface BreadcrumbsProps {
  /** Declarative trail items; enables automatic middle-item collapse when `maxItems` is set. */
  items?: readonly BreadcrumbItemData[] | undefined;
  /** Maximum visible items before collapsing middle ancestors into a menu. */
  maxItems?: number | undefined;
  /** Number of leading items kept visible when collapsed. Default `1`. */
  itemsBeforeCollapse?: number | undefined;
  /** Number of trailing items kept visible when collapsed. Default `2`. */
  itemsAfterCollapse?: number | undefined;
  /** Logical separator between items (`chevron` mirrors automatically in RTL). Default `'chevron'`. */
  separator?: BreadcrumbsSeparator | undefined;
  /** Disable all breadcrumb links. */
  isDisabled?: boolean | undefined;
  /** Called when a breadcrumb item is activated. */
  onAction?: ((key: Key) => void) | undefined;
  /** Accessible landmark label (defaults to `messages.breadcrumbsLabel`). */
  'aria-label'?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Accessible breadcrumb navigation built on React Aria `Breadcrumbs`.
 * Supports automatic middle-item collapse into an NDS `Menu`, logical RTL separators,
 * and `aria-current="page"` on the current page item.
 */
export function Breadcrumbs({
  items,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 2,
  separator = 'chevron',
  isDisabled,
  onAction,
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: BreadcrumbsProps) {
  const m = useNdsMessages();
  const label = ariaLabel ?? m.breadcrumbsLabel;

  const shouldCollapse =
    items !== undefined &&
    maxItems !== undefined &&
    items.length > maxItems &&
    itemsBeforeCollapse + itemsAfterCollapse < items.length;

  const leading = shouldCollapse ? items.slice(0, itemsBeforeCollapse) : (items ?? []);
  const collapsed = shouldCollapse
    ? items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse)
    : [];
  const trailing = shouldCollapse ? items.slice(items.length - itemsAfterCollapse) : [];

  return (
    <BreadcrumbSeparatorContext.Provider value={separator}>
      <nav ref={ref} aria-label={label} data-nds="Breadcrumbs" className={cx(styles.nav, className)}>
        <RacBreadcrumbs
          {...(isDisabled !== undefined ? { isDisabled } : {})}
          {...(onAction !== undefined ? { onAction } : {})}
          className={cx(styles.list)}
        >
          {items !== undefined ? (
            <>
              {leading.map((item) => (
                <BreadcrumbItem
                  key={String(item.id)}
                  id={item.id}
                  {...(item.href !== undefined ? { href: item.href } : {})}
                  isDisabled={item.isDisabled}
                  onPress={item.onPress}
                >
                  {item.label}
                </BreadcrumbItem>
              ))}
              {shouldCollapse && (
                <RacBreadcrumb id="__nds_breadcrumbs_collapsed__" className={cx(styles.item)}>
                  <MenuTrigger>
                    <RacButton
                      type="button"
                      aria-label={m.breadcrumbsExpand}
                      data-nds="BreadcrumbsCollapseButton"
                      className={cx(styles.ellipsisButton)}
                    >
                      <Icon icon={iconMore} size="sm" />
                    </RacButton>
                    <Menu
                      aria-label={m.breadcrumbsExpand}
                      onAction={(key) => {
                        const match = collapsed.find((c) => String(c.id) === String(key));
                        match?.onPress?.();
                        onAction?.(key);
                      }}
                    >
                      {collapsed.map((item) => (
                        <MenuItem
                          key={String(item.id)}
                          id={item.id}
                          {...(item.href !== undefined ? { href: item.href } : {})}
                          {...(item.isDisabled !== undefined ? { isDisabled: item.isDisabled } : {})}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </MenuTrigger>
                  <SeparatorGlyph variant={separator} />
                </RacBreadcrumb>
              )}
              {trailing.map((item) => (
                <BreadcrumbItem
                  key={String(item.id)}
                  id={item.id}
                  {...(item.href !== undefined ? { href: item.href } : {})}
                  isDisabled={item.isDisabled}
                  onPress={item.onPress}
                >
                  {item.label}
                </BreadcrumbItem>
              ))}
            </>
          ) : (
            children
          )}
        </RacBreadcrumbs>
      </nav>
    </BreadcrumbSeparatorContext.Provider>
  );
}

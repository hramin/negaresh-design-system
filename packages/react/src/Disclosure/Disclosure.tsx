import { iconChevronDown, type IconDefinition } from '@negaresh/icons';
import { createContext, type ReactNode, type Ref, useContext } from 'react';
import {
  Button as RacButton,
  Disclosure as RacDisclosure,
  DisclosureGroup as RacDisclosureGroup,
  type DisclosureGroupProps as RacDisclosureGroupProps,
  DisclosurePanel as RacDisclosurePanel,
  type DisclosureProps as RacDisclosureProps,
  type Key,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './Disclosure.module.css';

export type DisclosureVariant = 'default' | 'surface' | 'plain';
export type AccordionVariant = 'surface' | 'bordered' | 'plain';

const InsideAccordionContext = createContext(false);

export interface DisclosureProps
  extends Pick<
    RacDisclosureProps,
    'id' | 'isExpanded' | 'defaultExpanded' | 'onExpandedChange' | 'isDisabled'
  > {
  /** Visible toggle label. */
  title: ReactNode;
  /** Optional leading icon (`16 px`). */
  icon?: IconDefinition | undefined;
  /** Optional trailing metadata (e.g. lesson duration or item count). */
  meta?: ReactNode | undefined;
  /** Visual framing: hairline `default`, card `surface`, or minimal `plain` (e.g. Registry mobile help). */
  variant?: DisclosureVariant | undefined;
  /** Optional semantic heading level wrapping the trigger button. */
  headingLevel?: 2 | 3 | 4 | undefined;
  /**
   * When `'md'`, hides the trigger and keeps the panel open at `>= 900 px` (desktop),
   * collapsing behind the trigger below `900 px` (mobile) with zero SSR hydration mismatch.
   */
  alwaysExpandedAbove?: 'md' | undefined;
  /** Panel ARIA role. Default `'group'`. */
  panelRole?: 'group' | 'region' | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Collapsible content section built on React Aria `Disclosure`.
 * Supports standalone disclosures, FAQ/syllabus items inside `<Accordion>`,
 * and responsive desktop-expanded / mobile-collapsed blocks (Registry mobile help).
 */
export function Disclosure({
  title,
  icon,
  meta,
  variant = 'default',
  headingLevel,
  alwaysExpandedAbove,
  panelRole = 'group',
  children,
  className,
  ref,
  ...rest
}: DisclosureProps) {
  const insideAccordion = useContext(InsideAccordionContext);
  const resolvedVariant = insideAccordion ? 'plain' : variant;

  const triggerButton = (
    <RacButton slot="trigger" className={cx(styles.trigger)}>
      <span className={cx(styles.triggerStart)}>
        {icon && (
          <span className={cx(styles.triggerIcon)} aria-hidden="true">
            <Icon icon={icon} size="sm" />
          </span>
        )}
        <span>{title}</span>
      </span>
      <span className={cx(styles.triggerEnd)}>
        {meta && <span className={cx(styles.meta)}>{meta}</span>}
        <span className={cx(styles.chevron)} aria-hidden="true">
          <Icon icon={iconChevronDown} size="sm" />
        </span>
      </span>
    </RacButton>
  );

  const renderTrigger = () => {
    if (headingLevel === 2) {
      return <h2 className={cx(styles.heading, styles.triggerWrap)}>{triggerButton}</h2>;
    }
    if (headingLevel === 3) {
      return <h3 className={cx(styles.heading, styles.triggerWrap)}>{triggerButton}</h3>;
    }
    if (headingLevel === 4) {
      return <h4 className={cx(styles.heading, styles.triggerWrap)}>{triggerButton}</h4>;
    }
    return <div className={cx(styles.triggerWrap)}>{triggerButton}</div>;
  };

  return (
    <RacDisclosure
      {...rest}
      ref={ref}
      data-nds="Disclosure"
      data-variant={insideAccordion ? undefined : resolvedVariant}
      data-always-expanded={alwaysExpandedAbove}
      className={cx(styles.disclosure, className)}
    >
      {renderTrigger()}
      <RacDisclosurePanel role={panelRole} className={cx(styles.panel)}>
        <div className={cx(styles.panelInner)}>{children}</div>
      </RacDisclosurePanel>
    </RacDisclosure>
  );
}

export interface AccordionProps
  extends Pick<
    RacDisclosureGroupProps,
    'allowsMultipleExpanded' | 'expandedKeys' | 'defaultExpandedKeys' | 'onExpandedChange' | 'isDisabled'
  > {
  /** Visual container style: `surface` (hairline-divided card, default), `bordered` (separated items), or `plain`. */
  variant?: AccordionVariant | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Grouped collapsible sections built on React Aria `DisclosureGroup`.
 * Supports single-expand FAQ lists and multi-expand course syllabi.
 */
export function Accordion({
  variant = 'surface',
  children,
  className,
  ref,
  ...rest
}: AccordionProps) {
  return (
    <InsideAccordionContext.Provider value={true}>
      <RacDisclosureGroup
        {...rest}
        ref={ref}
        data-nds="Accordion"
        data-variant={variant}
        className={cx(styles.accordion, className)}
      >
        {children}
      </RacDisclosureGroup>
    </InsideAccordionContext.Provider>
  );
}

export interface AccordionItemProps
  extends Omit<DisclosureProps, 'variant' | 'alwaysExpandedAbove'> {
  /** Unique key matching `Accordion.expandedKeys` / `defaultExpandedKeys`. */
  id: Key;
}

/** Individual collapsible item inside `<Accordion>`. */
export function AccordionItem(props: AccordionItemProps) {
  return <Disclosure {...props} />;
}

export type { Key as DisclosureKey };

import { iconCheck, iconChevronDown, type IconDefinition } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  Button,
  FieldError,
  Header,
  type Key,
  Label,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  ListBoxSection,
  type ListBoxSectionProps,
  Popover,
  ProgressBar,
  Select as RacSelect,
  type SelectProps as RacSelectProps,
  SelectValue,
  Separator,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { type FieldSize, fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import listboxStyles from '../internal/listbox.module.css';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Select.module.css';

export type SelectSelectionMode = 'single' | 'multiple';

export interface SelectProps<
  T extends object = object,
  M extends SelectSelectionMode = 'single',
> extends Pick<
    RacSelectProps<T, M>,
    | 'id'
    | 'name'
    | 'selectionMode'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'isOpen'
    | 'defaultOpen'
    | 'onOpenChange'
    | 'disabledKeys'
    | 'shouldCloseOnSelect'
    | 'isDisabled'
    | 'isRequired'
    | 'isInvalid'
    | 'validationBehavior'
    | 'validate'
    | 'autoComplete'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Visible label associated with the select trigger. */
  label: ReactNode;
  /** Help text announced with the select. */
  description?: ReactNode;
  /** Error displayed when validation marks the field invalid. */
  errorMessage?: ReactNode;
  /** Placeholder shown when no option is selected. Defaults to localized Persian text. */
  placeholder?: string | undefined;
  /** Control height. Default `md`; small retains a 44 px target. */
  size?: FieldSize | undefined;
  /** Show an indeterminate loading indicator while options or submission are pending. */
  isPending?: boolean | undefined;
  /** Dynamic items rendered by the children render function. */
  items?: Iterable<T> | undefined;
  /** Static `SelectItem`/`SelectSection` nodes or a render function when `items` is provided. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Popover placement relative to the trigger (logical). */
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end' | undefined;
  /** Class applied only to the select root. */
  className?: string | undefined;
  /** Ref forwarded to the trigger button. */
  ref?: Ref<HTMLButtonElement> | undefined;
}

/**
 * Accessible dropdown select built on React Aria Components 1.22.1.
 * Supports single and multiple selection, sections, descriptions, icons, and RTL popovers.
 */
export function Select<T extends object = object, M extends SelectSelectionMode = 'single'>({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  isPending,
  items,
  children,
  placement,
  className,
  ref,
  selectionMode,
  isDisabled,
  ...rest
}: SelectProps<T, M>) {
  const messages = useNdsMessages();
  const resolvedPlaceholder = placeholder ?? messages.selectPlaceholder;
  const effectiveDisabled = isDisabled || isPending;

  return (
    <RacSelect<T, M>
      {...rest}
      {...(selectionMode !== undefined ? { selectionMode } : {})}
      {...(effectiveDisabled !== undefined ? { isDisabled: effectiveDisabled } : {})}
      placeholder={resolvedPlaceholder}
      data-nds="Select"
      data-size={size}
      data-pending={isPending ? 'true' : undefined}
      className={cx(styles.root, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <Button ref={ref} className={cx(styles.trigger)}>
        <SelectValue className={cx(styles.value)}>
          {({ isPlaceholder, state }) => {
            if (isPlaceholder) {
              return <span className={styles.placeholder}>{resolvedPlaceholder}</span>;
            }
            if (selectionMode === 'multiple') {
              const selected = state.selectedItems;
              if (selected.length > 2) return messages.selectSelectedCount(selected.length);
              return selected.map((item) => item.textValue).join('، ');
            }
            return state.selectedItems[0]?.textValue ?? '';
          }}
        </SelectValue>
        <span className={styles.end}>
          {isPending && (
            <ProgressBar
              isIndeterminate
              aria-label={messages.pending}
              className={cx(fieldStyles.pending)}
            >
              <span aria-hidden="true" />
            </ProgressBar>
          )}
          <Icon icon={iconChevronDown} size="sm" className={styles.chevron} />
        </span>
      </Button>
      {description != null && (
        <Text slot="description" className={cx(fieldStyles.description)}>
          {description}
        </Text>
      )}
      <div className={fieldStyles.errorSlot} data-field-error-slot>
        <FieldError className={cx(fieldStyles.error)}>
          {(result) => (
            <span role="alert">{errorMessage ?? fieldValidationMessage(result, messages)}</span>
          )}
        </FieldError>
      </div>
      <Popover
        {...(placement !== undefined ? { placement } : {})}
        className={cx(listboxStyles.popover)}
        data-nds="SelectPopover"
      >
        <ListBox
          {...(items !== undefined ? { items } : {})}
          className={cx(listboxStyles.listbox)}
          data-nds="SelectListBox"
        >
          {children}
        </ListBox>
      </Popover>
    </RacSelect>
  );
}

export interface SelectItemProps extends Pick<ListBoxItemProps, 'isDisabled' | 'aria-label'> {
  /** Unique key for the option. */
  id?: Key;
  /** Plain-text label for type-ahead and trigger display when `children` is not a string. */
  textValue?: string | undefined;
  /** Optional leading icon. */
  icon?: IconDefinition | undefined;
  /** Optional secondary line under the option label. */
  description?: ReactNode;
  children: ReactNode;
}

/** Option item inside a Select. Displays a checkmark in single mode or a checkbox box in multiple mode. */
export function SelectItem({
  icon,
  description,
  children,
  textValue,
  ...rest
}: SelectItemProps) {
  return (
    <ListBoxItem
      {...rest}
      {...(textValue !== undefined || typeof children === 'string'
        ? { textValue: textValue ?? (children as string) }
        : {})}
      data-nds="SelectItem"
      className={cx(listboxStyles.item)}
    >
      {({ isSelected, selectionMode }) => (
        <>
          {selectionMode === 'multiple' ? (
            <span className={listboxStyles.checkboxBox} aria-hidden="true">
              {isSelected && <Icon icon={iconCheck} size="sm" />}
            </span>
          ) : (
            <span className={listboxStyles.check} aria-hidden="true">
              {isSelected && <Icon icon={iconCheck} size="sm" />}
            </span>
          )}
          {icon != null && <Icon icon={icon} size="sm" className={listboxStyles.itemIcon} />}
          <span className={listboxStyles.itemText}>
            <Text slot="label" className={cx(listboxStyles.itemLabel)}>
              {children}
            </Text>
            {description != null && (
              <Text slot="description" className={cx(listboxStyles.itemDescription)}>
                {description}
              </Text>
            )}
          </span>
        </>
      )}
    </ListBoxItem>
  );
}

export interface SelectSectionProps<T extends object = object>
  extends Pick<ListBoxSectionProps<T>, 'id' | 'aria-label'> {
  /** Visible section heading. */
  title?: ReactNode;
  children: ReactNode;
}

/** Grouped section inside a Select listbox. */
export function SelectSection<T extends object = object>({
  title,
  children,
  ...rest
}: SelectSectionProps<T>) {
  return (
    <ListBoxSection {...rest} className={cx(listboxStyles.section)}>
      {title != null && <Header className={cx(listboxStyles.sectionTitle)}>{title}</Header>}
      {children}
    </ListBoxSection>
  );
}

/** Visual separator between Select sections. */
export function SelectSeparator() {
  return <Separator className={cx(listboxStyles.separator)} />;
}

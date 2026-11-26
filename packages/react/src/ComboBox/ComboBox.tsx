import { iconCheck, iconChevronDown, iconPlus, type IconDefinition } from '@negaresh/icons';
import { Children, isValidElement, type ReactNode, type Ref, useMemo, useState } from 'react';
import {
  Button,
  Collection,
  ComboBox as RacComboBox,
  type ComboBoxProps as RacComboBoxProps,
  FieldError,
  Header,
  Input,
  type Key,
  Label,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  ListBoxSection,
  type ListBoxSectionProps,
  Popover,
  ProgressBar,
  Separator,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { type FieldSize, fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import listboxStyles from '../internal/listbox.module.css';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './ComboBox.module.css';

const CREATE_OPTION_KEY = '__nds_combobox_create__';

function extractStaticTexts(node: ReactNode): string[] {
  const texts: string[] = [];
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as { textValue?: unknown; children?: ReactNode };
    if (typeof props.textValue === 'string') {
      texts.push(props.textValue);
    } else if (typeof props.children === 'string') {
      texts.push(props.children);
    } else if (props.children != null) {
      texts.push(...extractStaticTexts(props.children));
    }
  });
  return texts;
}

function extractItemTexts<T extends object>(items: Iterable<T> | undefined): string[] {
  if (!items) return [];
  const texts: string[] = [];
  for (const item of items) {
    const rec = item as Record<string, unknown>;
    for (const field of ['textValue', 'label', 'name', 'title']) {
      if (typeof rec[field] === 'string') {
        texts.push(rec[field]);
        break;
      }
    }
  }
  return texts;
}

export interface ComboBoxProps<T extends object = object>
  extends Pick<
    RacComboBoxProps<T, 'single'>,
    | 'id'
    | 'name'
    | 'inputValue'
    | 'defaultInputValue'
    | 'onInputChange'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'allowsCustomValue'
    | 'menuTrigger'
    | 'disabledKeys'
    | 'defaultFilter'
    | 'formValue'
    | 'isDisabled'
    | 'isReadOnly'
    | 'isRequired'
    | 'isInvalid'
    | 'validationBehavior'
    | 'validate'
    | 'onOpenChange'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Visible field label. */
  label: ReactNode;
  /** Help text announced with the input. */
  description?: ReactNode;
  /** Validation error displayed when invalid. */
  errorMessage?: ReactNode;
  /** Placeholder text for the text input. */
  placeholder?: string | undefined;
  /** Control height. Default `md`; small retains a 44 px target. */
  size?: FieldSize | undefined;
  /** Dynamic options for external/async filtering. */
  items?: Iterable<T> | undefined;
  /** Uncontrolled initial items for built-in client filtering. */
  defaultItems?: Iterable<T> | undefined;
  /** Show an async loading indicator inside the field and listbox. */
  isLoading?: boolean | undefined;
  /** Read-only pending state while a submission runs. */
  isPending?: boolean | undefined;
  /** Custom empty-state message when no options match. Defaults to localized Persian text. */
  emptyMessage?: ReactNode;
  /**
   * Enables create-new mode: when the typed query does not match an existing option,
   * displays a keyboard-selectable creation option and calls this handler when chosen.
   */
  onCreateOption?: ((query: string) => void) | undefined;
  /** Custom label for the create-new option. Defaults to `افزودن «{query}»`. */
  createOptionLabel?: ((query: string) => ReactNode) | undefined;
  /** Optional predicate overriding when the create-new option is shown. */
  canCreateOption?: ((query: string) => boolean) | undefined;
  /** Static `ComboBoxItem` children or a render function when `items`/`defaultItems` is provided. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Popover placement relative to the input (logical). */
  placement?: 'bottom start' | 'bottom end' | 'top start' | 'top end' | undefined;
  /** Class applied only to the combobox root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying text input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

export type AutocompleteProps<T extends object = object> = ComboBoxProps<T>;

/**
 * Filterable ComboBox / Autocomplete built on React Aria Components 1.22.1.
 * Supports client filtering, async remote loading, empty states, and create-new options.
 */
export function ComboBox<T extends object = object>({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  items,
  defaultItems,
  isLoading,
  isPending,
  emptyMessage,
  onCreateOption,
  createOptionLabel,
  canCreateOption,
  children,
  placement,
  className,
  ref,
  inputValue,
  defaultInputValue,
  onInputChange,
  onChange,
  isReadOnly,
  ...rest
}: ComboBoxProps<T>) {
  const messages = useNdsMessages();
  const [localInput, setLocalInput] = useState(defaultInputValue ?? '');
  const activeInput = inputValue ?? localInput;
  const trimmedQuery = activeInput.trim();

  const knownTexts = useMemo(() => {
    if (!onCreateOption || canCreateOption) return [];
    const fromItems = extractItemTexts(items ?? defaultItems);
    const fromStatic = typeof children === 'function' ? [] : extractStaticTexts(children);
    return [...fromItems, ...fromStatic].map((t) => t.trim().toLocaleLowerCase('fa-IR'));
  }, [onCreateOption, canCreateOption, items, defaultItems, children]);

  const showCreateOption = useMemo(() => {
    if (!onCreateOption || !trimmedQuery || isLoading) return false;
    if (canCreateOption) return canCreateOption(trimmedQuery);
    const normalized = trimmedQuery.toLocaleLowerCase('fa-IR');
    return !knownTexts.includes(normalized);
  }, [onCreateOption, trimmedQuery, isLoading, canCreateOption, knownTexts]);

  const handleInputChange = (next: string) => {
    if (inputValue === undefined) setLocalInput(next);
    onInputChange?.(next);
  };

  const handleChange = (key: Key | null) => {
    if (key === CREATE_OPTION_KEY && onCreateOption) {
      onCreateOption(trimmedQuery);
      return;
    }
    onChange?.(key);
  };

  const collectionItems = items ?? defaultItems;

  return (
    <RacComboBox<T, 'single'>
      {...rest}
      {...(items !== undefined ? { items } : {})}
      {...(defaultItems !== undefined ? { defaultItems } : {})}
      {...(inputValue !== undefined ? { inputValue } : {})}
      {...(defaultInputValue !== undefined ? { defaultInputValue } : {})}
      onInputChange={handleInputChange}
      onChange={handleChange}
      isReadOnly={Boolean(isReadOnly || isPending)}
      allowsEmptyCollection
      data-nds="ComboBox"
      data-size={size}
      data-pending={isPending ? 'true' : undefined}
      data-loading={isLoading ? 'true' : undefined}
      className={cx(fieldStyles.root, styles.root, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <div className={styles.control}>
        <Input
          ref={ref}
          {...(placeholder !== undefined ? { placeholder } : {})}
          className={cx(styles.input)}
        />
        {(isLoading || isPending) && (
          <ProgressBar
            isIndeterminate
            aria-label={isLoading ? messages.comboBoxLoading : messages.pending}
            className={cx(fieldStyles.pending)}
          >
            <span aria-hidden="true" />
          </ProgressBar>
        )}
        <Button aria-label={messages.comboBoxToggle} className={cx(styles.toggle)}>
          <Icon icon={iconChevronDown} size="sm" className={styles.chevron} />
        </Button>
      </div>
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
        data-nds="ComboBoxPopover"
      >
        <ListBox
          className={cx(listboxStyles.listbox)}
          data-nds="ComboBoxListBox"
          renderEmptyState={() => (
            <div className={listboxStyles.status} role="status">
              {isLoading ? messages.comboBoxLoading : (emptyMessage ?? messages.comboBoxNoResults)}
            </div>
          )}
        >
          {typeof children === 'function' ? (
            collectionItems !== undefined ? (
              <Collection items={collectionItems}>{children}</Collection>
            ) : null
          ) : (
            children
          )}
          {showCreateOption && (
            <ListBoxItem
              id={CREATE_OPTION_KEY}
              textValue={trimmedQuery}
              data-nds="ComboBoxCreateItem"
              className={cx(listboxStyles.item, listboxStyles.createItem)}
            >
              <Icon icon={iconPlus} size="sm" className={listboxStyles.itemIcon} />
              <span className={listboxStyles.itemText}>
                <Text slot="label" className={cx(listboxStyles.itemLabel)}>
                  {createOptionLabel
                    ? createOptionLabel(trimmedQuery)
                    : messages.comboBoxCreateOption(trimmedQuery)}
                </Text>
              </span>
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RacComboBox>
  );
}

/** Alias for `ComboBox` matching the NDS component inventory (`ComboBox / Autocomplete`). */
export const Autocomplete = ComboBox;

export interface ComboBoxItemProps extends Pick<ListBoxItemProps, 'isDisabled' | 'aria-label'> {
  /** Unique key for the option. */
  id?: Key;
  /** Plain-text label for filtering and input display when `children` is not a string. */
  textValue?: string | undefined;
  /** Optional leading icon. */
  icon?: IconDefinition | undefined;
  /** Optional secondary line beneath the label. */
  description?: ReactNode;
  children: ReactNode;
}

/** Option item inside a ComboBox or Autocomplete. */
export function ComboBoxItem({
  icon,
  description,
  children,
  textValue,
  ...rest
}: ComboBoxItemProps) {
  return (
    <ListBoxItem
      {...rest}
      {...(textValue !== undefined || typeof children === 'string'
        ? { textValue: textValue ?? (children as string) }
        : {})}
      data-nds="ComboBoxItem"
      className={cx(listboxStyles.item)}
    >
      {({ isSelected }) => (
        <>
          <span className={listboxStyles.check} aria-hidden="true">
            {isSelected && <Icon icon={iconCheck} size="sm" />}
          </span>
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

export interface ComboBoxSectionProps<T extends object = object>
  extends Pick<ListBoxSectionProps<T>, 'id' | 'aria-label'> {
  /** Visible section heading. */
  title?: ReactNode;
  children: ReactNode;
}

/** Grouped section inside a ComboBox listbox. */
export function ComboBoxSection<T extends object = object>({
  title,
  children,
  ...rest
}: ComboBoxSectionProps<T>) {
  return (
    <ListBoxSection {...rest} className={cx(listboxStyles.section)}>
      {title != null && <Header className={cx(listboxStyles.sectionTitle)}>{title}</Header>}
      {children}
    </ListBoxSection>
  );
}

/** Visual separator between ComboBox sections. */
export function ComboBoxSeparator() {
  return <Separator className={cx(listboxStyles.separator)} />;
}

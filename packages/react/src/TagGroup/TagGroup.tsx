import { iconClose, type IconDefinition } from '@negaresh/icons';
import { type KeyboardEvent, type ReactNode, type Ref, useId, useState } from 'react';
import {
  Button,
  type Key,
  Label,
  Tag as RacTag,
  TagGroup as RacTagGroup,
  type TagGroupProps as RacTagGroupProps,
  TagList as RacTagList,
  type TagProps as RacTagProps,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { type FieldSize, fieldStyles } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './TagGroup.module.css';

export interface TagGroupProps<T extends object = object>
  extends Pick<
    RacTagGroupProps,
    | 'id'
    | 'selectionMode'
    | 'selectedKeys'
    | 'defaultSelectedKeys'
    | 'onSelectionChange'
    | 'disabledKeys'
    | 'onRemove'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Optional visible label for the tag group. */
  label?: ReactNode;
  /** Optional help text beneath the tags. */
  description?: ReactNode;
  /** Validation or status error message associated with the tag group. */
  errorMessage?: ReactNode;
  /** Content rendered when the tag list is empty. */
  emptyMessage?: ReactNode;
  /** Dynamic tag items when using a children render function. */
  items?: Iterable<T> | undefined;
  /** Tag height density. Default `md`; `sm` keeps a 44 px touch target. */
  size?: 'sm' | 'md' | undefined;
  /** Static `Tag` elements or a render function when `items` is provided. */
  children: ReactNode | ((item: T) => ReactNode);
  /** Class applied only to the tag group root. */
  className?: string | undefined;
  /** Ref forwarded to the tag group container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Keyboard-navigable list of tags built on React Aria TagGroup + TagList.
 * Supports selection, removable tags (Delete/Backspace and remove button), and empty states.
 */
export function TagGroup<T extends object = object>({
  label,
  description,
  errorMessage,
  emptyMessage,
  items,
  size = 'md',
  children,
  className,
  ref,
  ...rest
}: TagGroupProps<T>) {
  return (
    <RacTagGroup
      {...rest}
      ref={ref}
      data-nds="TagGroup"
      data-size={size}
      className={cx(styles.group, className)}
    >
      {label != null && <Label className={cx(fieldStyles.label)}>{label}</Label>}
      <RacTagList
        {...(items !== undefined ? { items } : {})}
        {...(emptyMessage !== undefined ? { renderEmptyState: () => emptyMessage } : {})}
        className={cx(styles.list)}
      >
        {children}
      </RacTagList>
      {description != null && (
        <Text slot="description" className={cx(fieldStyles.description)}>
          {description}
        </Text>
      )}
      {errorMessage != null && (
        <Text slot="errorMessage" className={cx(fieldStyles.error)}>
          <span role="alert">{errorMessage}</span>
        </Text>
      )}
    </RacTagGroup>
  );
}

export interface TagProps extends Pick<RacTagProps, 'isDisabled' | 'onAction'> {
  /** Unique key within the TagGroup. */
  id?: Key;
  /** Plain-text label for accessibility when `children` is not a string. */
  textValue?: string | undefined;
  /** Optional leading icon. */
  icon?: IconDefinition | undefined;
  /** Visual emphasis. Default `neutral`. */
  tone?: 'neutral' | 'accent' | undefined;
  children: ReactNode;
  /** Class applied to the tag root. */
  className?: string | undefined;
}

/** Individual tag inside a TagGroup. Renders a localized remove button when `onRemove` is set on the group. */
export function Tag({
  icon,
  tone = 'neutral',
  children,
  textValue,
  className,
  ...rest
}: TagProps) {
  return (
    <RacTag
      {...rest}
      {...(textValue !== undefined || typeof children === 'string'
        ? { textValue: textValue ?? (children as string) }
        : {})}
      data-nds="Tag"
      data-tone={tone}
      className={cx(styles.tag, className)}
    >
      {({ allowsRemoving }) => (
        <>
          {icon != null && <Icon icon={icon} size="sm" className={styles.tagIcon} />}
          <span className={styles.tagLabel}>{children}</span>
          {allowsRemoving && (
            <Button slot="remove" className={cx(styles.remove)}>
              <Icon icon={iconClose} size="sm" />
            </Button>
          )}
        </>
      )}
    </RacTag>
  );
}

export interface TagFieldProps {
  /** Visible label for the tag entry input. */
  label: ReactNode;
  /** Help text beneath the field. */
  description?: ReactNode;
  /** External validation error message. */
  errorMessage?: ReactNode;
  /** Controlled list of tag strings. */
  value?: readonly string[] | undefined;
  /** Initial tag strings for uncontrolled usage. */
  defaultValue?: readonly string[] | undefined;
  /** Called whenever a tag is added or removed. */
  onChange?: ((tags: string[]) => void) | undefined;
  /** Placeholder text for the tag entry input. Defaults to localized Persian guidance. */
  placeholder?: string | undefined;
  /** Maximum number of tags permitted. */
  maxTags?: number | undefined;
  /** Allow adding duplicate tag values (case-insensitive). Default `false`. */
  allowDuplicates?: boolean | undefined;
  /** Optional custom validator returning a Persian error message if invalid. */
  validateTag?: ((tag: string) => string | null | undefined) | undefined;
  /** Input name for native HTML form submission (renders hidden inputs). */
  name?: string | undefined;
  /** HTML id for the underlying text input. */
  id?: string | undefined;
  isRequired?: boolean | undefined;
  isDisabled?: boolean | undefined;
  isReadOnly?: boolean | undefined;
  isInvalid?: boolean | undefined;
  /** Field density. Default `md`. */
  size?: FieldSize | undefined;
  /** Class applied only to the TagField root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying text input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

/**
 * Composite tag entry input paired with a removable React Aria TagGroup.
 * Adds tags on Enter or comma (`,` / `،`), removes the last tag on Backspace when empty,
 * and announces additions/removals cleanly for assistive technology.
 */
export function TagField({
  label,
  description,
  errorMessage,
  value,
  defaultValue,
  onChange,
  placeholder,
  maxTags,
  allowDuplicates = false,
  validateTag,
  name,
  id,
  isRequired,
  isDisabled,
  isReadOnly,
  isInvalid,
  size = 'md',
  className,
  ref,
}: TagFieldProps) {
  const messages = useNdsMessages();
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const labelId = `${generatedId}-label`;

  const [localTags, setLocalTags] = useState<string[]>(() => [...(defaultValue ?? [])]);
  const [draft, setDraft] = useState('');
  const [internalError, setInternalError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const tags = value !== undefined ? [...value] : localTags;
  const tagEntries = (() => {
    const seen = new Map<string, number>();
    return tags.map((label) => {
      const count = seen.get(label) ?? 0;
      seen.set(label, count + 1);
      return { key: count === 0 ? label : `${label}#${count}`, label };
    });
  })();
  const activeError = errorMessage ?? internalError;
  const invalid = Boolean(isInvalid || activeError);

  const commitTags = (next: string[], statusMessage: string) => {
    if (value === undefined) setLocalTags(next);
    setInternalError(null);
    setAnnouncement(statusMessage);
    onChange?.(next);
  };

  const addTag = (raw: string) => {
    if (isDisabled || isReadOnly) return;
    const candidate = raw.trim();
    if (!candidate) return;
    if (maxTags !== undefined && tags.length >= maxTags) {
      setInternalError(messages.tagLimitReached(maxTags));
      return;
    }
    if (
      !allowDuplicates &&
      tags.some(
        (existing) =>
          existing.toLocaleLowerCase('fa-IR') === candidate.toLocaleLowerCase('fa-IR'),
      )
    ) {
      setInternalError(messages.tagDuplicate);
      return;
    }
    const customError = validateTag?.(candidate);
    if (customError) {
      setInternalError(customError);
      return;
    }
    setDraft('');
    commitTags([...tags, candidate], messages.tagAdded(candidate));
  };

  const removeKeys = (keys: Set<Key>) => {
    if (isDisabled || isReadOnly) return;
    const removedLabels: string[] = [];
    const next: string[] = [];
    for (const entry of tagEntries) {
      if (keys.has(entry.key)) {
        removedLabels.push(entry.label);
      } else {
        next.push(entry.label);
      }
    }
    if (removedLabels.length === 0) return;
    commitTags(next, messages.tagRemoved(removedLabels.join('، ')));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === '،') {
      event.preventDefault();
      addTag(draft);
      return;
    }
    if (event.key === 'Backspace' && draft === '' && tags.length > 0 && !isDisabled && !isReadOnly) {
      event.preventDefault();
      const last = tags[tags.length - 1];
      if (last !== undefined) {
        commitTags(tags.slice(0, -1), messages.tagRemoved(last));
      }
    }
  };

  const describedBy =
    [description != null ? descriptionId : undefined, invalid && activeError ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div
      data-nds="TagField"
      data-size={size}
      data-disabled={isDisabled ? 'true' : undefined}
      data-readonly={isReadOnly ? 'true' : undefined}
      data-invalid={invalid ? 'true' : undefined}
      className={cx(fieldStyles.root, styles.fieldRoot, className)}
    >
      <label id={labelId} htmlFor={inputId} className={fieldStyles.label}>
        {label}
      </label>
      <div className={styles.fieldControl}>
        {tagEntries.length > 0 && (
          <TagGroup
            aria-labelledby={labelId}
            size="sm"
            {...(!isDisabled && !isReadOnly ? { onRemove: removeKeys } : {})}
          >
            {tagEntries.map((entry) => (
              <Tag key={entry.key} id={entry.key} isDisabled={Boolean(isDisabled)}>
                {entry.label}
              </Tag>
            ))}
          </TagGroup>
        )}
        <input
          ref={ref}
          id={inputId}
          type="text"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (internalError) setInternalError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? messages.tagFieldPlaceholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={Boolean(isRequired && tags.length === 0)}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={styles.fieldInput}
        />
        {name != null &&
          tagEntries.map((entry) => (
            <input key={entry.key} type="hidden" name={name} value={entry.label} />
          ))}
      </div>
      {description != null && (
        <span id={descriptionId} className={fieldStyles.description}>
          {description}
        </span>
      )}
      <div className={fieldStyles.errorSlot} data-field-error-slot>
        {invalid && activeError != null && (
          <span id={errorId} role="alert" className={fieldStyles.error}>
            {activeError}
          </span>
        )}
      </div>
      <span role="status" aria-live="polite" className={styles.srStatus}>
        {announcement}
      </span>
    </div>
  );
}

import { iconClose, iconSearch } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  Button,
  FieldError,
  Input,
  Label,
  SearchField as RacSearchField,
  type SearchFieldProps as RacSearchFieldProps,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { fieldValidationMessage } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './SearchField.module.css';

export interface SearchFieldProps
  extends Pick<
    RacSearchFieldProps,
    | 'id'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onSubmit'
    | 'onClear'
    | 'onFocus'
    | 'onBlur'
    | 'isDisabled'
    | 'isReadOnly'
    | 'isRequired'
    | 'isInvalid'
    | 'validate'
    | 'validationBehavior'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'autoComplete'
    | 'autoFocus'
    | 'aria-describedby'
  > {
  /** Visible label; placeholder text never replaces the label. */
  label: ReactNode;
  /** Help text associated with the search input. */
  description?: ReactNode;
  /** Displayed when invalid; server errors can also be supplied by Form. */
  errorMessage?: ReactNode;
  placeholder?: string | undefined;
  /** A displayed shortcut hint only; the application owns any global shortcut. */
  shortcutHint?: ReactNode;
  /** Announce pending search work without discarding the query. */
  isPending?: boolean;
  /** Visual control height; touch targets remain at least 44 px. Default md. */
  size?: 'sm' | 'md' | 'lg';
  /** Applied to the field root only. */
  className?: string | undefined;
  /** Focuses the actual search input. */
  ref?: Ref<HTMLInputElement>;
}

/** Search input on RAC SearchField, including its keyboard and clear-button behavior. */
export function SearchField({
  label,
  description,
  errorMessage,
  placeholder,
  shortcutHint,
  isPending,
  size = 'md',
  className,
  ref,
  ...rest
}: SearchFieldProps) {
  const m = useNdsMessages();
  return (
    <RacSearchField
      {...rest}
      data-nds="SearchField"
      data-size={size}
      data-pending={isPending || undefined}
      aria-busy={isPending || undefined}
      className={cx(styles.field, className)}
    >
      {({ isEmpty, isReadOnly }) => (
        <>
          <Label className={cx(styles.label)}>{label}</Label>
          <div className={cx(styles.control)}>
            <Icon icon={iconSearch} size="sm" className={cx(styles.icon)} />
            <Input
              ref={ref}
              {...(placeholder === undefined ? {} : { placeholder })}
              aria-busy={isPending || undefined}
              className={cx(styles.input)}
            />
            {!isEmpty && !isReadOnly && (
              <Button aria-label={m.searchClear} className={cx(styles.clear)}>
                <Icon icon={iconClose} size="sm" />
              </Button>
            )}
          </div>
          {(description || shortcutHint || isPending) && (
            <Text slot="description" className={cx(styles.description)}>
              {description}
              {shortcutHint && <kbd className={cx(styles.shortcut)}>{shortcutHint}</kbd>}
              {isPending && <span role="status">{m.pending}</span>}
            </Text>
          )}
          <div className={cx(styles.validation)} data-field-error-slot>
            <FieldError className={cx(styles.error)}>
              {(result) => (
                <span role="alert">{errorMessage ?? fieldValidationMessage(result, m)}</span>
              )}
            </FieldError>
          </div>
        </>
      )}
    </RacSearchField>
  );
}

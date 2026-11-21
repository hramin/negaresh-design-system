import { iconCheck, iconMinus, type IconDefinition } from '@negaresh/icons';
import { formatPrice } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import {
  CheckboxButton as RacCheckboxButton,
  CheckboxField as RacCheckboxField,
  type CheckboxFieldProps as RacCheckboxFieldProps,
  RadioButton as RacRadioButton,
  RadioField as RacRadioField,
  type RadioFieldProps as RacRadioFieldProps,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './ChoiceCard.module.css';

interface ChoiceCardBaseProps {
  /** Primary option title. */
  title: ReactNode;
  /** Optional supporting copy beneath the title. */
  description?: ReactNode;
  /** Optional leading icon from `@negaresh/icons`. */
  icon?: IconDefinition | undefined;
  /**
   * Optional price shown on the end side. Numbers are formatted in Toman via
   * `@negaresh/utils` `formatPrice` (`0` → «رایگان», D-26); pass a ReactNode for
   * custom sale pricing.
   */
  price?: number | ReactNode;
  /** Optional short label badge next to the title. */
  badge?: ReactNode;
  /** Class applied only to the card root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying native radio or checkbox input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

export interface RadioChoiceCardProps
  extends ChoiceCardBaseProps,
    Pick<
      RacRadioFieldProps,
      'id' | 'value' | 'isDisabled' | 'aria-label' | 'aria-labelledby' | 'aria-describedby'
    > {
  /** Use inside a RadioGroup. Default `'radio'`. */
  control?: 'radio';
}

export interface CheckboxChoiceCardProps
  extends ChoiceCardBaseProps,
    Pick<
      RacCheckboxFieldProps,
      | 'id'
      | 'name'
      | 'value'
      | 'isSelected'
      | 'defaultSelected'
      | 'onChange'
      | 'isIndeterminate'
      | 'isDisabled'
      | 'isReadOnly'
      | 'isRequired'
      | 'isInvalid'
      | 'validationBehavior'
      | 'validate'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-describedby'
    > {
  /** Use standalone or inside a CheckboxGroup. */
  control: 'checkbox';
}

export type ChoiceCardProps = RadioChoiceCardProps | CheckboxChoiceCardProps;

function CardBody({
  icon,
  title,
  badge,
  description,
  price,
}: Pick<ChoiceCardBaseProps, 'icon' | 'title' | 'badge' | 'description' | 'price'>) {
  const formattedPrice = typeof price === 'number' ? formatPrice(price) : price;
  return (
    <>
      {icon != null && (
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon icon={icon} size="md" />
        </span>
      )}
      <span className={styles.body}>
        <span className={styles.textGroup}>
          <span className={styles.titleRow}>
            <span className={styles.title}>{title}</span>
            {badge != null && <span className={styles.badge}>{badge}</span>}
          </span>
          {description != null && <span className={styles.description}>{description}</span>}
        </span>
        {formattedPrice != null && <span className={styles.price}>{formattedPrice}</span>}
      </span>
    </>
  );
}

/**
 * Rich selectable card built on React Aria Radio or Checkbox.
 * Compose inside RadioGroup (`control="radio"`, default) or CheckboxGroup / standalone (`control="checkbox"`).
 */
export function ChoiceCard(props: ChoiceCardProps) {
  if (props.control === 'checkbox') {
    const {
      control: _control,
      title,
      description,
      icon,
      price,
      badge,
      className,
      ref,
      ...rest
    } = props;
    return (
      <RacCheckboxField
        {...rest}
        inputRef={ref ?? null}
        data-nds="ChoiceCard"
        data-control="checkbox"
        className={cx(styles.field, className)}
      >
        <RacCheckboxButton className={cx(styles.card)}>
          {({ isSelected, isIndeterminate }) => (
            <>
              <span className={styles.indicator} data-control="checkbox" aria-hidden="true">
                {isIndeterminate ? (
                  <Icon icon={iconMinus} size="sm" />
                ) : isSelected ? (
                  <Icon icon={iconCheck} size="sm" />
                ) : null}
              </span>
              <CardBody
                icon={icon}
                title={title}
                badge={badge}
                description={description}
                price={price}
              />
            </>
          )}
        </RacCheckboxButton>
      </RacCheckboxField>
    );
  }

  const {
    control: _control,
    title,
    description,
    icon,
    price,
    badge,
    className,
    ref,
    ...rest
  } = props;
  return (
    <RacRadioField
      {...rest}
      inputRef={ref ?? null}
      data-nds="ChoiceCard"
      data-control="radio"
      className={cx(styles.field, className)}
    >
      <RacRadioButton className={cx(styles.card)}>
        <span className={styles.indicator} data-control="radio" aria-hidden="true">
          <span className={styles.radioDot} />
        </span>
        <CardBody
          icon={icon}
          title={title}
          badge={badge}
          description={description}
          price={price}
        />
      </RacRadioButton>
    </RacRadioField>
  );
}

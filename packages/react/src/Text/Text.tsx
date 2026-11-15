import type { ElementType, ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import styles from './Text.module.css';

export type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';
export type TextTone =
  | 'default'
  | 'muted'
  | 'subtle'
  | 'disabled'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'inverse';

export interface TextProps {
  /** Element. Default `span`. */
  as?: ElementType;
  /** Font size token. Default inherits. */
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  /** `tight` headings, `ui` controls, `text` running Persian text. */
  leading?: 'tight' | 'ui' | 'text';
  /** Tabular figures for tables and meters. */
  tabular?: boolean | undefined;
  /** Cap the line length at 66ch (reading text). */
  measure?: boolean | undefined;
  id?: string | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Text with token size, weight and tone. Never italic or letter-spaced (Persian rules). */
export function Text({
  as: As = 'span',
  size,
  weight,
  tone,
  leading,
  tabular,
  measure,
  id,
  className,
  children,
  ref,
}: TextProps) {
  return (
    <As
      ref={ref}
      id={id}
      data-nds="Text"
      data-size={size}
      data-weight={weight}
      data-tone={tone}
      data-leading={leading}
      data-tabular={tabular || undefined}
      data-measure={measure || undefined}
      className={cx(styles.text, className)}
    >
      {children}
    </As>
  );
}

export interface HeadingProps extends Omit<TextProps, 'as' | 'leading'> {
  /** Document outline level → `<h1>`…`<h6>`. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const HEADING_SIZE: Record<HeadingProps['level'], TextSize> = {
  1: '3xl',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'sm',
};

/**
 * Heading: level sets the element, size defaults by level (h1 32 → 25 px on mobile).
 * Page titles use weight `heavy` (800), other headings `bold` (700).
 */
export function Heading({ level, size, weight, ...rest }: HeadingProps) {
  return (
    <Text
      as={`h${level}`}
      size={size ?? HEADING_SIZE[level]}
      weight={weight ?? (level === 1 ? 'heavy' : 'bold')}
      leading="tight"
      {...rest}
      className={cx(styles.heading, rest.className)}
    />
  );
}

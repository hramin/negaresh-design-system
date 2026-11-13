import type { CSSProperties, ElementType, ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { type SpaceStep, space, type TokenRef } from '../internal/tokens.ts';
import styles from './Layout.module.css';

interface BaseProps {
  /** Element to render. Default `div`. */
  as?: ElementType;
  className?: string | undefined;
  children?: ReactNode | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

export interface StackProps extends BaseProps {
  /** Space between children. Default `4` (16 px). */
  gap?: SpaceStep;
  /** Cross-axis alignment. Default `stretch`. */
  align?: 'start' | 'center' | 'end' | 'stretch';
}

/** Vertical flow with a token gap. */
export function Stack({
  as: As = 'div',
  gap = '4',
  align = 'stretch',
  className,
  children,
  ref,
}: StackProps) {
  return (
    <As
      ref={ref}
      data-nds="Stack"
      className={cx(styles.stack, className)}
      data-align={align}
      style={{ gap: space(gap) }}
    >
      {children}
    </As>
  );
}

export interface InlineProps extends BaseProps {
  /** Space between children. Default `2` (8 px). */
  gap?: SpaceStep;
  /** Cross-axis alignment. Default `center`. */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  /** Main-axis distribution (logical: start is the right edge in RTL). Default `start`. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Wrap onto new lines. Default `true`. */
  wrap?: boolean | undefined;
}

/** Horizontal (inline-direction) flow with a token gap. */
export function Inline({
  as: As = 'div',
  gap = '2',
  align = 'center',
  justify = 'start',
  wrap = true,
  className,
  children,
  ref,
}: InlineProps) {
  return (
    <As
      ref={ref}
      data-nds="Inline"
      className={cx(styles.inline, className)}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      style={{ gap: space(gap) }}
    >
      {children}
    </As>
  );
}

export interface GridProps extends BaseProps {
  /** Space between cells. Default `4`. */
  gap?: SpaceStep;
  /** Fixed number of equal columns. */
  columns?: number;
  /** Auto-fill columns at least this wide (a token reference). Ignored when `columns` is set. */
  minItemSize?: TokenRef;
}

/** Equal columns, fixed or auto-fill. Collapses to one column below `minItemSize`. */
export function Grid({
  as: As = 'div',
  gap = '4',
  columns,
  minItemSize,
  className,
  children,
  ref,
}: GridProps) {
  const style: CSSProperties = { gap: space(gap) };
  if (columns) style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  else if (minItemSize)
    style.gridTemplateColumns = `repeat(auto-fill, minmax(min(${minItemSize}, 100%), 1fr))`;
  return (
    <As ref={ref} data-nds="Grid" className={cx(styles.grid, className)} style={style}>
      {children}
    </As>
  );
}

export interface ContainerProps extends BaseProps {
  /** Max width: `narrow` 640 (forms), `default` 1200, `wide` 1440 (admin). Default `default`. */
  size?: 'narrow' | 'default' | 'wide';
}

/** Centered page container with responsive gutters (24 desktop, 16 mobile). */
export function Container({
  as: As = 'div',
  size = 'default',
  className,
  children,
  ref,
}: ContainerProps) {
  return (
    <As ref={ref} data-nds="Container" data-size={size} className={cx(styles.container, className)}>
      {children}
    </As>
  );
}

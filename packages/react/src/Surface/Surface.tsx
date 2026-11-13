import type { ElementType, ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import styles from './Surface.module.css';

export interface SurfaceProps {
  /** `default`: surface tone, hairline, radius. `plain`: no background or border (layout only). */
  variant?: 'default' | 'plain';
  /** Element to render. Default `section`; pass `aria-labelledby` to name it. */
  as?: ElementType;
  'aria-labelledby'?: string;
  'aria-label'?: string;
  className?: string | undefined;
  children?: ReactNode | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * A surface: tone + spacing + one hairline (D-77). No resting shadow, no nesting —
 * a surface inside a surface becomes a Section.
 */
export function Surface({
  variant = 'default',
  as: As = 'section',
  className,
  children,
  ref,
  ...aria
}: SurfaceProps) {
  return (
    <As
      ref={ref}
      data-nds="Surface"
      data-variant={variant}
      className={cx(styles.surface, className)}
      {...aria}
    >
      {children}
    </As>
  );
}

export interface SectionProps {
  /** `sunken` for a footer with actions. Default `default`. */
  tone?: 'default' | 'sunken';
  as?: ElementType;
  className?: string | undefined;
  children?: ReactNode | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * A block inside a Surface. The first Section is the body (32 px, 20 px on mobile);
 * later Sections are separated by a hairline.
 */
export function Section({
  tone = 'default',
  as: As = 'div',
  className,
  children,
  ref,
}: SectionProps) {
  return (
    <As ref={ref} data-nds="Section" data-tone={tone} className={cx(styles.section, className)}>
      {children}
    </As>
  );
}

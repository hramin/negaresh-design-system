import { iconImage } from '@negaresh/icons';
import { type ReactNode, type Ref, useEffect, useState } from 'react';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './Image.module.css';

export type ImageRatio = '1/1' | '4/3' | '3/2' | '16/9' | '21/9' | '3/4' | 'auto';
export type ImageFit = 'cover' | 'contain';
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg';

export interface ImageProps {
  /** Image source URL. */
  src: string;
  /** Required accessible text (WCAG 2.2 AA). Pass an empty string `""` explicitly for decorative images. */
  alt: string;
  /** Aspect-ratio frame to reserve space and prevent CLS. Default `'auto'`. */
  ratio?: ImageRatio | undefined;
  /** Responsive `srcSet` candidates. */
  srcSet?: string | undefined;
  /** Responsive `sizes` attribute paired with `srcSet`. */
  sizes?: string | undefined;
  /** Intrinsic width hint in px. */
  width?: number | undefined;
  /** Intrinsic height hint in px. */
  height?: number | undefined;
  /** Native loading mode. Default `'lazy'`. */
  loading?: 'lazy' | 'eager' | undefined;
  /** Native decoding hint. Default `'async'`. */
  decoding?: 'async' | 'sync' | 'auto' | undefined;
  /** Native fetch priority hint (use `'high'` for hero LCP images). */
  fetchPriority?: 'high' | 'low' | 'auto' | undefined;
  /** Object fit inside the aspect-ratio frame. Default `'cover'`. */
  fit?: ImageFit | undefined;
  /** Corner radius token. Default `'none'`. */
  radius?: ImageRadius | undefined;
  /** Optional caption; renders a semantic `<figure>` + `<figcaption>` when provided. */
  caption?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLImageElement> | undefined;
}

/**
 * Responsive image primitive with aspect-ratio locking, lazy loading, required `alt`,
 * optional semantic caption, and calm error placeholder (no runtime image optimizer, docs/04-stack.md).
 */
export function Image({
  src,
  alt,
  ratio = 'auto',
  srcSet,
  sizes,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  fit = 'cover',
  radius = 'none',
  caption,
  className,
  ref,
}: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (failedSrc && failedSrc !== src) {
      setFailedSrc(undefined);
    }
  }, [src, failedSrc]);

  const failed = failedSrc === src;
  const isDecorative = alt === '';

  const frame = (
    <div
      data-nds={caption === undefined ? 'Image' : 'ImageFrame'}
      data-ratio={ratio}
      data-radius={radius}
      className={cx(styles.frame, caption === undefined ? className : undefined)}
    >
      {failed ? (
        <span
          className={cx(styles.fallback)}
          data-nds="ImageFallback"
          {...(isDecorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': alt })}
        >
          <Icon icon={iconImage} size="lg" />
        </span>
      ) : (
        <img
          ref={ref}
          src={src}
          alt={alt}
          {...(srcSet !== undefined ? { srcSet } : {})}
          {...(sizes !== undefined ? { sizes } : {})}
          {...(width !== undefined ? { width } : {})}
          {...(height !== undefined ? { height } : {})}
          loading={loading}
          decoding={decoding}
          {...(fetchPriority !== undefined ? { fetchPriority } : {})}
          data-fit={fit}
          className={cx(styles.img)}
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  );

  if (caption !== undefined) {
    return (
      <figure data-nds="Image" className={cx(styles.figure, className)}>
        {frame}
        <figcaption className={cx(styles.caption)}>{caption}</figcaption>
      </figure>
    );
  }

  return frame;
}

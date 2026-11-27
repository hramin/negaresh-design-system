import { iconMinus, iconPlus } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import { type ReactNode, type Ref, useState } from 'react';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { ToggleButton, ToggleButtonGroup } from '../ToggleButton/ToggleButton.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './DiffView.module.css';

export type DiffLineType = 'context' | 'added' | 'removed';
export type DiffMode = 'unified' | 'split';

export interface DiffSegment {
  /** Text fragment within a changed line. */
  text: string;
  /** Highlight this fragment as the specifically altered portion. */
  changed?: boolean | undefined;
}

export interface DiffLine {
  type: DiffLineType;
  content: string;
  oldLineNumber?: number | undefined;
  newLineNumber?: number | undefined;
  /** Optional intra-line highlight segments (used instead of raw `content` when present). */
  inlineSegments?: readonly DiffSegment[] | undefined;
  /** Explicit direction override for this line (e.g. `'ltr'` for serials or JSON snippets). */
  dir?: 'rtl' | 'ltr' | undefined;
}

/**
 * Pure-TypeScript LCS line diff helper for revision comparison (zero external dependencies).
 * Produces deterministic `context`, `removed`, and `added` lines with 1-based line numbers.
 */
export function computeLineDiff(before: string, after: string): DiffLine[] {
  const a = before.length === 0 ? [] : before.split('\n');
  const b = after.length === 0 ? [] : after.split('\n');
  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i -= 1) {
    const row = dp[i]!;
    const nextRow = dp[i + 1]!;
    for (let j = n - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        row[j] = (nextRow[j + 1] ?? 0) + 1;
      } else {
        row[j] = Math.max(nextRow[j] ?? 0, row[j + 1] ?? 0);
      }
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push({
        type: 'context',
        content: a[i]!,
        oldLineNumber: i + 1,
        newLineNumber: j + 1,
      });
      i += 1;
      j += 1;
    } else if ((dp[i + 1]?.[j] ?? 0) >= (dp[i]?.[j + 1] ?? 0)) {
      result.push({
        type: 'removed',
        content: a[i]!,
        oldLineNumber: i + 1,
      });
      i += 1;
    } else {
      result.push({
        type: 'added',
        content: b[j]!,
        newLineNumber: j + 1,
      });
      j += 1;
    }
  }

  while (i < m) {
    result.push({ type: 'removed', content: a[i]!, oldLineNumber: i + 1 });
    i += 1;
  }
  while (j < n) {
    result.push({ type: 'added', content: b[j]!, newLineNumber: j + 1 });
    j += 1;
  }

  return result;
}

interface SplitPair {
  key: string;
  left?: DiffLine | undefined;
  right?: DiffLine | undefined;
}

function buildSplitPairs(lines: readonly DiffLine[]): SplitPair[] {
  const pairs: SplitPair[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]!;
    if (line.type === 'context') {
      pairs.push({ key: `ctx-${index}`, left: line, right: line });
      index += 1;
      continue;
    }
    const removed: DiffLine[] = [];
    const added: DiffLine[] = [];
    while (index < lines.length && lines[index]!.type !== 'context') {
      const current = lines[index]!;
      if (current.type === 'removed') removed.push(current);
      else added.push(current);
      index += 1;
    }
    const maxLen = Math.max(removed.length, added.length);
    for (let k = 0; k < maxLen; k += 1) {
      pairs.push({
        key: `chg-${index}-${k}`,
        left: removed[k],
        right: added[k],
      });
    }
  }
  return pairs;
}

export interface DiffViewProps {
  /** Precomputed diff lines (takes precedence over `before` / `after`). */
  lines?: readonly DiffLine[] | undefined;
  /** Original revision text when computing diff automatically. */
  before?: string | undefined;
  /** Updated revision text when computing diff automatically. */
  after?: string | undefined;
  /** Label for the previous revision (e.g. «نسخهٔ ۳»). */
  beforeLabel?: ReactNode | undefined;
  /** Label for the new revision (e.g. «نسخهٔ ۴»). */
  afterLabel?: ReactNode | undefined;
  /** Optional header title (e.g. «تغییرات سیاست سقف فعال‌سازی»). */
  title?: ReactNode | undefined;
  /** Controlled layout mode: `unified` (default) or `split` (auto-stacks below 900 px). */
  mode?: DiffMode | undefined;
  /** Initial layout mode when uncontrolled. Default `'unified'`. */
  defaultMode?: DiffMode | undefined;
  /** Called when the user switches between unified and split views. */
  onModeChange?: ((mode: DiffMode) => void) | undefined;
  /** Show the unified / split view toggle in the header. Default `false`. */
  allowModeToggle?: boolean | undefined;
  /** Show line-number columns. Default `true`. */
  showLineNumbers?: boolean | undefined;
  /** Render lines as LTR monospace code/serials (`unicode-bidi: isolate`, D-86). Default `false`. */
  isCode?: boolean | undefined;
  /** Explicit text direction for line contents. Defaults to `'ltr'` when `isCode` is true. */
  dir?: 'rtl' | 'ltr' | 'auto' | undefined;
  /** Optional trailing header actions (e.g. restore revision button). */
  actions?: ReactNode | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

function renderLineText(line: DiffLine) {
  if (!line.inlineSegments || line.inlineSegments.length === 0) {
    return line.content;
  }
  let offset = 0;
  const keyed = line.inlineSegments.map((seg) => {
    const start = offset;
    offset += seg.text.length;
    return { key: `${start}-${seg.changed ? 'c' : 'u'}-${seg.text.length}`, seg };
  });
  return keyed.map(({ key, seg }) => {
    if (!seg.changed) return <span key={key}>{seg.text}</span>;
    return (
      <span
        key={key}
        className={cx(line.type === 'added' ? styles.highlightAdded : styles.highlightRemoved)}
      >
        {seg.text}
      </span>
    );
  });
}

function formatLineNumber(num: number | undefined): string {
  if (num === undefined) return '';
  return formatNumber(num, { maximumFractionDigits: 0 });
}

/**
 * Revision comparison view supporting unified and responsive split modes, inline highlight
 * segments, LTR code/serial isolation (D-86), and accessible `+`/`−` markers + `<ins>`/`<del>`
 * semantics (never colour alone).
 */
export function DiffView({
  lines,
  before,
  after,
  beforeLabel,
  afterLabel,
  title,
  mode,
  defaultMode = 'unified',
  onModeChange,
  allowModeToggle = false,
  showLineNumbers = true,
  isCode = false,
  dir,
  actions,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  ref,
}: DiffViewProps) {
  const m = useNdsMessages();
  const [uncontrolledMode, setUncontrolledMode] = useState<DiffMode>(defaultMode);
  const activeMode = mode ?? uncontrolledMode;

  const resolvedLines =
    lines ?? (before !== undefined || after !== undefined ? computeLineDiff(before ?? '', after ?? '') : []);

  let seq = 0;
  const keyedLines = resolvedLines.map((line) => {
    seq += 1;
    return {
      key: `${line.type}-${line.oldLineNumber ?? 'x'}-${line.newLineNumber ?? 'x'}-${seq}`,
      line,
    };
  });

  let addedCount = 0;
  let removedCount = 0;
  for (const line of resolvedLines) {
    if (line.type === 'added') addedCount += 1;
    else if (line.type === 'removed') removedCount += 1;
  }

  const handleModeChange = (next: DiffMode) => {
    if (mode === undefined) setUncontrolledMode(next);
    onModeChange?.(next);
  };

  const resolvedDir = dir ?? (isCode ? 'ltr' : undefined);
  const resolvedLabel = ariaLabelledBy
    ? undefined
    : (ariaLabel ?? (typeof title === 'string' ? title : m.diffLabel));
  const hasHeader =
    title !== undefined ||
    beforeLabel !== undefined ||
    afterLabel !== undefined ||
    allowModeToggle ||
    actions !== undefined ||
    addedCount > 0 ||
    removedCount > 0;

  const renderAnnotatedContent = (line: DiffLine) => {
    const inner = renderLineText(line);
    const lineDir = line.dir ?? resolvedDir;
    const contentClass = cx(styles.content, (isCode || lineDir === 'ltr') && styles.code);

    if (line.type === 'added') {
      return (
        <span className={contentClass} {...(lineDir ? { dir: lineDir } : {})}>
          <VisuallyHidden>{`${m.diffAdded}: `}</VisuallyHidden>
          <ins className={cx(styles.ins)}>{inner}</ins>
        </span>
      );
    }
    if (line.type === 'removed') {
      return (
        <span className={contentClass} {...(lineDir ? { dir: lineDir } : {})}>
          <VisuallyHidden>{`${m.diffRemoved}: `}</VisuallyHidden>
          <del className={cx(styles.del)}>{inner}</del>
        </span>
      );
    }
    return (
      <span className={contentClass} {...(lineDir ? { dir: lineDir } : {})}>
        {inner}
      </span>
    );
  };

  const renderMarker = (type: DiffLineType) => (
    <span className={cx(styles.marker)} aria-hidden="true">
      {type === 'added' ? (
        <Icon icon={iconPlus} size="sm" />
      ) : type === 'removed' ? (
        <Icon icon={iconMinus} size="sm" />
      ) : (
        ' '
      )}
    </span>
  );

  return (
    <section
      ref={ref}
      {...(resolvedLabel !== undefined ? { 'aria-label': resolvedLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      data-nds="DiffView"
      data-mode={activeMode}
      data-code={isCode ? 'true' : undefined}
      className={cx(styles.root, className)}
    >
      {hasHeader && (
        <div className={cx(styles.header)}>
          <div className={cx(styles.headerMeta)}>
            {title !== undefined && <p className={cx(styles.title)}>{title}</p>}
            {(beforeLabel !== undefined || afterLabel !== undefined) && (
              <div className={cx(styles.revisions)}>
                {beforeLabel !== undefined && <span>{beforeLabel}</span>}
                {beforeLabel !== undefined && afterLabel !== undefined && (
                  <span aria-hidden="true">←</span>
                )}
                {afterLabel !== undefined && <span>{afterLabel}</span>}
              </div>
            )}
            <div className={cx(styles.summary)}>
              <VisuallyHidden>{m.diffSummary(addedCount, removedCount)}</VisuallyHidden>
              <span className={cx(styles.countAdded)} aria-hidden="true">
                +{formatNumber(addedCount, { maximumFractionDigits: 0 })}
              </span>
              <span className={cx(styles.countRemoved)} aria-hidden="true">
                −{formatNumber(removedCount, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {(allowModeToggle || actions !== undefined) && (
            <div className={cx(styles.headerControls)}>
              {allowModeToggle && (
                <ToggleButtonGroup
                  aria-label={m.diffLabel}
                  selectedKeys={[activeMode]}
                  disallowEmptySelection
                  onSelectionChange={(keys) => {
                    const [selected] = [...keys];
                    if (selected === 'unified' || selected === 'split') {
                      handleModeChange(selected);
                    }
                  }}
                >
                  <ToggleButton id="unified" size="sm">
                    {m.diffModeUnified}
                  </ToggleButton>
                  <ToggleButton id="split" size="sm">
                    {m.diffModeSplit}
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={cx(styles.body)}>
        {keyedLines.length === 0 ? (
          <p className={cx(styles.empty)}>{m.diffEmpty}</p>
        ) : activeMode === 'unified' ? (
          <ol className={cx(styles.list)}>
            {keyedLines.map(({ key, line }) => (
              <li
                key={key}
                data-type={line.type}
                data-numbers={showLineNumbers ? 'true' : 'false'}
                className={cx(styles.line)}
              >
                {showLineNumbers && (
                  <>
                    <span className={cx(styles.lineNum)} aria-hidden="true">
                      {formatLineNumber(line.oldLineNumber)}
                    </span>
                    <span className={cx(styles.lineNum)} aria-hidden="true">
                      {formatLineNumber(line.newLineNumber)}
                    </span>
                  </>
                )}
                {renderMarker(line.type)}
                {renderAnnotatedContent(line)}
              </li>
            ))}
          </ol>
        ) : (
          <div>
            <div className={cx(styles.splitHeader)} aria-hidden="true">
              <div className={cx(styles.splitColHead)}>{beforeLabel ?? m.diffOldLine}</div>
              <div className={cx(styles.splitColHead)}>{afterLabel ?? m.diffNewLine}</div>
            </div>
            <ol className={cx(styles.list)}>
              {buildSplitPairs(resolvedLines).map((pair) => (
                <li key={pair.key} className={cx(styles.splitRow)}>
                  <div
                    className={cx(styles.splitCell)}
                    data-type={pair.left ? pair.left.type : 'empty'}
                    data-numbers={showLineNumbers ? 'true' : 'false'}
                  >
                    {pair.left && (
                      <>
                        {showLineNumbers && (
                          <span className={cx(styles.lineNum)} aria-hidden="true">
                            {formatLineNumber(pair.left.oldLineNumber)}
                          </span>
                        )}
                        {renderMarker(pair.left.type)}
                        {renderAnnotatedContent(pair.left)}
                      </>
                    )}
                  </div>
                  <div
                    className={cx(styles.splitCell)}
                    data-type={pair.right ? pair.right.type : 'empty'}
                    data-numbers={showLineNumbers ? 'true' : 'false'}
                  >
                    {pair.right && (
                      <>
                        {showLineNumbers && (
                          <span className={cx(styles.lineNum)} aria-hidden="true">
                            {formatLineNumber(pair.right.newLineNumber)}
                          </span>
                        )}
                        {renderMarker(pair.right.type)}
                        {renderAnnotatedContent(pair.right)}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

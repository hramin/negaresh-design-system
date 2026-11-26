import { iconUpload } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  DropZone as RacDropZone,
  FileTrigger as RacFileTrigger,
  isFileDropItem,
} from 'react-aria-components';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './FileUpload.module.css';

export interface DropZoneProps {
  /** Primary drop prompt shown inside the zone. Defaults to `messages.fileUploadDropPrompt`. */
  prompt?: ReactNode;
  /** Optional helper hint (e.g., accepted file types and size limit). */
  hint?: ReactNode;
  /** File picker button label. Defaults to `messages.fileUploadChoose` / `fileUploadChooseMultiple`. */
  actionLabel?: ReactNode;
  /** Accepted file extensions or MIME types (e.g. `['.csv', '.txt', 'image/png']`). */
  accept?: readonly string[] | undefined;
  /** Allow selecting or dropping multiple files. Default `false`. */
  allowsMultiple?: boolean | undefined;
  /** Disables drag-and-drop and the file picker button. */
  isDisabled?: boolean | undefined;
  /** Highlights the dropzone border in the danger semantic role. */
  isInvalid?: boolean | undefined;
  /** Called with the selected or dropped `File[]`. */
  onSelectFiles?: ((files: File[]) => void) | undefined;
  /** Optional id forwarded to the file picker button (for `FormErrorSummary` links). */
  buttonId?: string | undefined;
  /** Accessible name for the drop zone (defaults to `messages.fileUploadDropPrompt` if omitted). */
  'aria-label'?: string | undefined;
  /** References an external visible label id. */
  'aria-labelledby'?: string | undefined;
  /** References description / error ids. */
  'aria-describedby'?: string | undefined;
  /** Optional custom content inside the dropzone below the default picker. */
  children?: ReactNode;
  /** Class applied only to the dropzone root. */
  className?: string | undefined;
  /** Ref forwarded to the dropzone root `div`. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Accessible drag-and-drop surface with a keyboard/pointer `FileTrigger` button
 * alternative (WCAG 2.2 AA 2.5.7), built on React Aria `DropZone` and `FileTrigger`.
 */
export function DropZone({
  prompt,
  hint,
  actionLabel,
  accept,
  allowsMultiple = false,
  isDisabled = false,
  isInvalid = false,
  onSelectFiles,
  buttonId,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  children,
  className,
  ref,
}: DropZoneProps) {
  const messages = useNdsMessages();
  const resolvedLabel =
    ariaLabelledBy !== undefined ? undefined : (ariaLabel ?? messages.fileUploadDropPrompt);
  const resolvedAction =
    actionLabel ?? (allowsMultiple ? messages.fileUploadChooseMultiple : messages.fileUploadChoose);

  return (
    <RacDropZone
      ref={ref}
      data-nds="DropZone"
      data-invalid={isInvalid || undefined}
      isDisabled={isDisabled}
      className={cx(styles.dropZone, className)}
      {...(resolvedLabel !== undefined ? { 'aria-label': resolvedLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      {...(ariaDescribedBy !== undefined ? { 'aria-describedby': ariaDescribedBy } : {})}
      getDropOperation={() => (isDisabled ? 'cancel' : 'copy')}
      onDrop={async (event) => {
        if (isDisabled) return;
        const fileItems = event.items.filter(isFileDropItem);
        if (fileItems.length === 0) return;
        const resolved = await Promise.all(fileItems.map((item) => item.getFile()));
        const files = allowsMultiple ? resolved : resolved.slice(0, 1);
        if (files.length > 0) onSelectFiles?.(files);
      }}
    >
      <span className={styles.dropIcon} aria-hidden="true">
        <Icon icon={iconUpload} size="md" />
      </span>
      <div className={styles.promptGroup}>
        <p className={styles.prompt}>{prompt ?? messages.fileUploadDropPrompt}</p>
        {hint != null && <p className={styles.hint}>{hint}</p>}
      </div>
      <RacFileTrigger
        allowsMultiple={allowsMultiple}
        {...(accept && accept.length > 0 ? { acceptedFileTypes: accept } : {})}
        onSelect={(fileList) => {
          if (isDisabled || !fileList || fileList.length === 0) return;
          const files = Array.from(fileList);
          onSelectFiles?.(allowsMultiple ? files : files.slice(0, 1));
        }}
      >
        <Button
          {...(buttonId !== undefined ? { id: buttonId } : {})}
          type="button"
          variant="secondary"
          size="md"
          iconStart={iconUpload}
          isDisabled={isDisabled}
          {...(ariaDescribedBy !== undefined ? { 'aria-describedby': ariaDescribedBy } : {})}
        >
          {resolvedAction}
        </Button>
      </RacFileTrigger>
      {children}
    </RacDropZone>
  );
}

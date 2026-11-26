import { iconError, iconFile, iconImage, iconSuccess, iconTrash } from '@negaresh/icons';
import { formatPercent } from '@negaresh/utils';
import { type ReactNode, type Ref, useContext, useId, useState } from 'react';
import { FormValidationContext, ProgressBar as RacProgressBar } from 'react-aria-components';
import { IconButton } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { DropZone } from './DropZone.tsx';
import styles from './FileUpload.module.css';

export type FileUploadItemStatus = 'ready' | 'uploading' | 'complete' | 'error';

export interface FileUploadItem {
  /** Stable unique identifier for the uploaded or queued file. */
  id: string;
  /** Original file name (rendered isolated so Latin names stay readable in RTL). */
  name: string;
  /** File size in bytes. */
  size: number;
  /** Optional MIME type (used to pick an image vs. generic file icon). */
  type?: string | undefined;
  /** Lifecycle status of this file entry. Default `'ready'`. */
  status?: FileUploadItemStatus | undefined;
  /** Determinate upload progress percentage (`0`–`100`) when `status === 'uploading'`. */
  progress?: number | undefined;
  /** Specific item-level error message when `status === 'error'`. */
  error?: string | undefined;
  /** Underlying browser `File` instance when selected/dropped on the client. */
  file?: File | undefined;
}

export type FileRejectionCode = 'invalid-type' | 'file-too-large' | 'too-many-files';

export interface FileRejection {
  file: File;
  code: FileRejectionCode;
  message: string;
}

export interface FileUploadProps {
  /** Visible field label. */
  label: ReactNode;
  /** Optional help text shown beneath the dropzone. */
  description?: ReactNode;
  /** Hint shown inside the dropzone (e.g., allowed formats and maximum size). */
  hint?: ReactNode;
  /** Primary drop prompt inside the dropzone. */
  prompt?: ReactNode;
  /** Custom file picker button label. */
  actionLabel?: ReactNode;
  /** Validation error displayed when invalid. */
  errorMessage?: ReactNode;
  /** Controlled list of files. */
  items?: readonly FileUploadItem[] | undefined;
  /** Uncontrolled initial file list (SSR-safe plain objects). */
  defaultItems?: readonly FileUploadItem[] | undefined;
  /** Called whenever files are added or removed in uncontrolled/controlled flows. */
  onItemsChange?: ((items: FileUploadItem[]) => void) | undefined;
  /** Called with newly accepted `File[]` after type, size, and count validation. */
  onSelectFiles?: ((files: File[]) => void) | undefined;
  /** Called when a user removes a file from the list. */
  onRemove?: ((id: string) => void) | undefined;
  /** Called when one or more chosen/dropped files fail validation. */
  onReject?: ((rejections: FileRejection[]) => void) | undefined;
  /** Accepted file extensions or MIME types (e.g. `['.csv', '.txt', 'image/*']`). */
  accept?: readonly string[] | undefined;
  /** Maximum allowed size per file in bytes. */
  maxFileSize?: number | undefined;
  /** Maximum total number of files when `allowsMultiple` is true. */
  maxFiles?: number | undefined;
  /** Allow selecting/dropping multiple files. Default `false`. */
  allowsMultiple?: boolean | undefined;
  /** Field name used for `Form` `validationErrors`. */
  name?: string | undefined;
  /** Optional id forwarded to the picker button (for `FormErrorSummary` links). */
  id?: string | undefined;
  /** Disables dropping, picking, and removing files. */
  isDisabled?: boolean | undefined;
  /** Marks the field invalid. */
  isInvalid?: boolean | undefined;
  /** Marks the field as required. */
  isRequired?: boolean | undefined;
  /** Class applied only to the component root. */
  className?: string | undefined;
  /** Ref forwarded to the dropzone root element. */
  ref?: Ref<HTMLDivElement> | undefined;
}

function isImageItem(item: Pick<FileUploadItem, 'name' | 'type'>): boolean {
  if (item.type?.toLowerCase().startsWith('image/')) return true;
  return /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(item.name);
}

function matchesAccept(file: File, accept: readonly string[]): boolean {
  const fileName = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();
  return accept.some((rule) => {
    const normalized = rule.trim().toLowerCase();
    if (!normalized) return true;
    if (normalized.startsWith('.')) return fileName.endsWith(normalized);
    if (normalized.endsWith('/*')) {
      const prefix = normalized.slice(0, -1);
      return mime.startsWith(prefix);
    }
    return mime === normalized;
  });
}

function formatValidationError(
  result: string | string[] | null | undefined,
): string | undefined {
  if (typeof result === 'string' && result.length > 0) return result;
  if (Array.isArray(result) && result.length > 0) return result.join(' ');
  return undefined;
}

/**
 * File upload field combining `DropZone` (`FileTrigger` + drag-and-drop),
 * Persian type/size/count validation, accessible file list with remove actions,
 * and upload progress/error states.
 */
export function FileUpload({
  label,
  description,
  hint,
  prompt,
  actionLabel,
  errorMessage,
  items,
  defaultItems = [],
  onItemsChange,
  onSelectFiles,
  onRemove,
  onReject,
  accept,
  maxFileSize,
  maxFiles,
  allowsMultiple = false,
  name,
  id,
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  className,
  ref,
}: FileUploadProps) {
  const messages = useNdsMessages();
  const formErrors = useContext(FormValidationContext);
  const autoId = useId();
  const labelId = `${autoId}-label`;
  const descriptionId = `${autoId}-desc`;
  const errorId = `${autoId}-error`;
  const buttonId = id ?? `${autoId}-choose`;

  const [uncontrolledItems, setUncontrolledItems] = useState<FileUploadItem[]>(() => [
    ...defaultItems,
  ]);
  const [rejectionError, setRejectionError] = useState<string | undefined>(undefined);
  const currentItems = items ?? uncontrolledItems;

  const updateItems = (next: FileUploadItem[]) => {
    if (items === undefined) setUncontrolledItems(next);
    onItemsChange?.(next);
  };

  const handleIncomingFiles = (incoming: File[]) => {
    if (isDisabled) return;
    const accepted: File[] = [];
    const rejections: FileRejection[] = [];
    const acceptLabel = accept?.join('، ') ?? '';
    const existingCount = allowsMultiple ? currentItems.length : 0;
    const limit = allowsMultiple ? maxFiles : 1;

    for (const file of incoming) {
      if (accept && accept.length > 0 && !matchesAccept(file, accept)) {
        rejections.push({
          file,
          code: 'invalid-type',
          message: messages.fileUploadInvalidType(file.name, acceptLabel),
        });
        continue;
      }
      if (maxFileSize !== undefined && file.size > maxFileSize) {
        rejections.push({
          file,
          code: 'file-too-large',
          message: messages.fileUploadTooLarge(file.name, messages.fileSize(maxFileSize)),
        });
        continue;
      }
      if (limit !== undefined && existingCount + accepted.length >= limit) {
        rejections.push({
          file,
          code: 'too-many-files',
          message: messages.fileUploadTooMany(limit),
        });
        continue;
      }
      accepted.push(file);
    }

    if (rejections.length > 0) {
      setRejectionError(rejections[0]?.message);
      onReject?.(rejections);
    } else {
      setRejectionError(undefined);
    }

    if (accepted.length > 0) {
      const created: FileUploadItem[] = accepted.map((file, idx) => ({
        id: `${autoId}-${file.name}-${file.size}-${currentItems.length + idx}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'ready',
        file,
      }));
      const next = allowsMultiple ? [...currentItems, ...created] : created.slice(0, 1);
      updateItems(next);
      onSelectFiles?.(accepted);
    }
  };

  const handleRemove = (itemId: string) => {
    if (isDisabled) return;
    setRejectionError(undefined);
    const next = currentItems.filter((item) => item.id !== itemId);
    updateItems(next);
    onRemove?.(itemId);
  };

  const serverError = name ? formatValidationError(formErrors?.[name]) : undefined;
  const resolvedError = errorMessage ?? serverError ?? rejectionError;
  const invalid = Boolean(isInvalid || serverError || rejectionError);

  const describedBy =
    [description != null ? descriptionId : null, invalid && resolvedError ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div
      data-nds="FileUpload"
      data-invalid={invalid || undefined}
      data-disabled={isDisabled || undefined}
      data-required={isRequired || undefined}
      className={cx(styles.root, className)}
    >
      <span id={labelId} className={styles.label}>
        {label}
      </span>

      <DropZone
        ref={ref}
        buttonId={buttonId}
        prompt={prompt}
        hint={hint}
        actionLabel={actionLabel}
        accept={accept}
        allowsMultiple={allowsMultiple}
        isDisabled={isDisabled}
        isInvalid={invalid}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        onSelectFiles={handleIncomingFiles}
      />

      {description != null && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}

      <div className={styles.errorSlot} data-field-error-slot>
        {invalid && resolvedError != null && (
          <div id={errorId} className={styles.error} role="alert">
            <Icon icon={iconError} size="sm" />
            <span>{resolvedError}</span>
          </div>
        )}
      </div>

      {currentItems.length > 0 && (
        <ul className={styles.list}>
          {currentItems.map((item) => {
            const status = item.status ?? 'ready';
            const percent =
              item.progress !== undefined
                ? Math.max(0, Math.min(100, Math.round(item.progress)))
                : undefined;

            return (
              <li key={item.id} className={styles.item} data-status={status}>
                <div className={styles.itemRow}>
                  <span className={styles.fileIcon} aria-hidden="true">
                    <Icon icon={isImageItem(item) ? iconImage : iconFile} size="md" />
                  </span>
                  <div className={styles.itemMeta}>
                    <span className={styles.fileName} dir="auto">
                      {item.name}
                    </span>
                    <span className={styles.fileSubline}>
                      <span>{messages.fileSize(item.size)}</span>
                      {status === 'complete' && (
                        <span className={styles.statusComplete}>
                          <Icon icon={iconSuccess} size="sm" />
                          <span>{messages.fileUploadComplete}</span>
                        </span>
                      )}
                      {status === 'error' && (
                        <span className={styles.statusError}>
                          <Icon icon={iconError} size="sm" />
                          <span>{item.error ?? messages.fileUploadError}</span>
                        </span>
                      )}
                    </span>
                  </div>
                  <IconButton
                    icon={iconTrash}
                    variant="ghost"
                    aria-label={messages.fileUploadRemove(item.name)}
                    isDisabled={isDisabled}
                    onPress={() => handleRemove(item.id)}
                  />
                </div>

                {status === 'uploading' && (
                  <RacProgressBar
                    aria-label={messages.fileUploadUploading(percent)}
                    {...(percent !== undefined
                      ? { value: percent, minValue: 0, maxValue: 100 }
                      : { isIndeterminate: true })}
                    className={cx(styles.progress)}
                  >
                    {({ percentage }) => (
                      <>
                        <div className={styles.progressTrack}>
                          <span
                            className={styles.progressFill}
                            style={{ inlineSize: `${percentage ?? 45}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          {percent !== undefined
                            ? formatPercent(percent)
                            : messages.fileUploadUploading()}
                        </span>
                      </>
                    )}
                  </RacProgressBar>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

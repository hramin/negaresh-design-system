import type { FormError } from '@negaresh/react';

/**
 * Minimal TanStack Form + Zod (Standard Schema v1) adapter helpers for product apps.
 * Lives in docs / app code — `@negaresh/react` never depends on TanStack Form or Zod.
 */

export interface FieldValidationMeta {
  isTouched: boolean;
  errors: readonly unknown[];
}

/** Extracts a plain message from either a string error or a Zod / Standard Schema issue object. */
export function extractErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'string' && error.trim().length > 0) return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    const message = (error as { message: string }).message;
    return message.trim().length > 0 ? message : undefined;
  }
  return undefined;
}

/** Returns the first displayable error message for a TanStack Form field. */
export function getFirstFieldError(errors: readonly unknown[]): string | undefined {
  for (const error of errors) {
    const message = extractErrorMessage(error);
    if (message) return message;
  }
  return undefined;
}

/**
 * Maps a TanStack Form field's validation metadata + optional server error into
 * the `isInvalid` / `errorMessage` props accepted by every NDS input component.
 */
export function toNdsFieldError(
  meta: FieldValidationMeta,
  options: { showError: boolean; serverError?: string | undefined },
): { isInvalid: boolean; errorMessage: string | undefined } {
  const clientError = options.showError ? getFirstFieldError(meta.errors) : undefined;
  const errorMessage = options.serverError ?? clientError;
  return {
    isInvalid: Boolean(errorMessage),
    errorMessage,
  };
}

/**
 * Builds an ordered `FormErrorSummary` list from TanStack Form's `fieldMeta` map
 * and any server-returned field errors, using deterministic DOM input IDs.
 */
export function toFormErrorSummaryItems<TFieldName extends string>(
  fieldOrder: readonly TFieldName[],
  fieldIds: Readonly<Record<TFieldName, string>>,
  fieldMeta: Partial<Record<TFieldName, FieldValidationMeta | undefined>>,
  serverErrors: Partial<Record<TFieldName, string | undefined>> = {},
): FormError[] {
  const items: FormError[] = [];
  for (const name of fieldOrder) {
    const server = serverErrors[name];
    const client = getFirstFieldError(fieldMeta[name]?.errors ?? []);
    const message = server ?? client;
    if (message) {
      items.push({ id: fieldIds[name], message });
    }
  }
  return items;
}

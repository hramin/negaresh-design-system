/** Joins truthy class names without adding a runtime dependency. */
export function cx(...parts: readonly (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

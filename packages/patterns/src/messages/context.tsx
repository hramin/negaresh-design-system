import { createContext, type ReactNode, useContext } from 'react';
import { faPatternMessages } from './fa.ts';
import type { PatternMessages } from './types.ts';

export type PartialPatternMessages = {
  [K in keyof PatternMessages]?: Partial<PatternMessages[K]> | undefined;
};

const PatternMessagesContext = createContext<PatternMessages>(faPatternMessages);

export interface PatternMessagesProviderProps {
  /** Override all or part of the default Persian pattern message catalogue. */
  messages?: PartialPatternMessages | undefined;
  children: ReactNode;
}

function mergeMessages(
  base: PatternMessages,
  overrides?: PartialPatternMessages,
): PatternMessages {
  if (!overrides) return base;
  return {
    commerce: { ...base.commerce, ...overrides.commerce },
    licensing: {
      ...base.licensing,
      ...overrides.licensing,
      errors: { ...base.licensing.errors, ...overrides.licensing?.errors },
      limitSources: { ...base.licensing.limitSources, ...overrides.licensing?.limitSources },
      alertChannels: { ...base.licensing.alertChannels, ...overrides.licensing?.alertChannels },
    },
    content: {
      ...base.content,
      ...overrides.content,
      contentTypes: { ...base.content.contentTypes, ...overrides.content?.contentTypes },
      calloutTitles: { ...base.content.calloutTitles, ...overrides.content?.calloutTitles },
      contentCalloutLabels: {
        ...base.content.contentCalloutLabels,
        ...overrides.content?.contentCalloutLabels,
      },
      consultationModes: {
        ...base.content.consultationModes,
        ...overrides.content?.consultationModes,
      },
    },
    courses: { ...base.courses, ...overrides.courses },
    shells: { ...base.shells, ...overrides.shells },
    testPlatform: { ...base.testPlatform, ...overrides.testPlatform },
  };
}

/** Provides localized strings for `@negaresh/patterns` components (D-94). */
export function PatternMessagesProvider({ messages, children }: PatternMessagesProviderProps) {
  const parent = useContext(PatternMessagesContext);
  const merged = mergeMessages(parent, messages);
  return (
    <PatternMessagesContext.Provider value={merged}>{children}</PatternMessagesContext.Provider>
  );
}

/** Reads the active `PatternMessages` catalogue, merged with optional local overrides. */
export function usePatternMessages(overrides?: PartialPatternMessages): PatternMessages {
  const ctx = useContext(PatternMessagesContext);
  return mergeMessages(ctx, overrides);
}

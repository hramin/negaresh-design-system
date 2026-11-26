import { createContext, type ReactNode, useContext } from 'react';
import { faAssessmentMessages } from './fa.ts';
import type { AssessmentMessages } from './types.ts';

const AssessmentMessagesContext = createContext<AssessmentMessages>(faAssessmentMessages);

export interface AssessmentMessagesProviderProps {
  /** Override all or part of the default Persian assessment message catalogue. */
  messages?: Partial<AssessmentMessages> | undefined;
  children: ReactNode;
}

/** Provides localized strings for `@negaresh/assessment` components (D-94). */
export function AssessmentMessagesProvider({
  messages,
  children,
}: AssessmentMessagesProviderProps) {
  const parent = useContext(AssessmentMessagesContext);
  const merged: AssessmentMessages = messages
    ? {
        ...parent,
        ...messages,
        campaignBlockers: { ...parent.campaignBlockers, ...messages.campaignBlockers },
        modeBadge: { ...parent.modeBadge, ...messages.modeBadge },
        resultKindLabel: { ...parent.resultKindLabel, ...messages.resultKindLabel },
        severityProfessional: { ...parent.severityProfessional, ...messages.severityProfessional },
        severityCalm: { ...parent.severityCalm, ...messages.severityCalm },
        reportDescriptions: { ...parent.reportDescriptions, ...messages.reportDescriptions },
      }
    : parent;

  return (
    <AssessmentMessagesContext.Provider value={merged}>
      {children}
    </AssessmentMessagesContext.Provider>
  );
}

/** Reads the active `AssessmentMessages` catalogue, merged with optional local overrides. */
export function useAssessmentMessages(
  overrides?: Partial<AssessmentMessages>,
): AssessmentMessages {
  const ctx = useContext(AssessmentMessagesContext);
  if (!overrides) return ctx;
  return {
    ...ctx,
    ...overrides,
    campaignBlockers: { ...ctx.campaignBlockers, ...overrides.campaignBlockers },
    modeBadge: { ...ctx.modeBadge, ...overrides.modeBadge },
    resultKindLabel: { ...ctx.resultKindLabel, ...overrides.resultKindLabel },
    severityProfessional: { ...ctx.severityProfessional, ...overrides.severityProfessional },
    severityCalm: { ...ctx.severityCalm, ...overrides.severityCalm },
    reportDescriptions: { ...ctx.reportDescriptions, ...overrides.reportDescriptions },
  };
}

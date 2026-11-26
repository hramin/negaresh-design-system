import {
  iconCheck,
  iconDanger,
  iconInfo,
  iconSuccess,
  iconWarning,
  type IconDefinition,
} from '@negaresh/icons';
import type { BadgeTone } from '@negaresh/react';
import type { AssessmentMessages } from '../messages/types.ts';
import type { AssessmentMode, AssessmentSeverity } from '../types.ts';

export interface ResolvedSeverityMeta {
  tone: BadgeTone;
  icon: IconDefinition;
  label: string;
}

/**
 * Resolves badge tone, semantic icon, and Persian severity label for either
 * `professional` (clinical status tokens) or `calm` (neutral/teal only; zero rose/danger).
 */
export function resolveSeverityMeta(
  severity: AssessmentSeverity,
  mode: AssessmentMode,
  messages: AssessmentMessages,
  customLabel?: string,
): ResolvedSeverityMeta {
  if (mode === 'calm') {
    const label = customLabel ?? messages.severityCalm[severity];
    if (severity === 'severe') {
      return { tone: 'accent', icon: iconInfo, label };
    }
    if (severity === 'caution') {
      return { tone: 'neutral', icon: iconInfo, label };
    }
    return { tone: 'neutral', icon: iconCheck, label };
  }

  const label = customLabel ?? messages.severityProfessional[severity];
  if (severity === 'severe') {
    return { tone: 'danger', icon: iconDanger, label };
  }
  if (severity === 'caution') {
    return { tone: 'warning', icon: iconWarning, label };
  }
  return { tone: 'success', icon: iconSuccess, label };
}

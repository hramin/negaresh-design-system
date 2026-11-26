import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { faChartMessages } from './fa.ts';
import type { ChartMessages } from './types.ts';

const ChartMessagesContext = createContext<ChartMessages>(faChartMessages);

export interface ChartMessagesProviderProps {
  /** Partial or complete message overrides merged over `faChartMessages`. */
  messages?: Partial<ChartMessages> | undefined;
  children: ReactNode;
}

/** Provides localized chart labels to descendant `@negaresh/charts` components. */
export function ChartMessagesProvider({ messages, children }: ChartMessagesProviderProps) {
  const parent = useContext(ChartMessagesContext);
  const merged = useMemo<ChartMessages>(
    () => (messages ? { ...parent, ...messages } : parent),
    [parent, messages],
  );
  return <ChartMessagesContext.Provider value={merged}>{children}</ChartMessagesContext.Provider>;
}

/** Returns the active `ChartMessages` catalogue, optionally merged with per-component overrides. */
export function useChartMessages(overrides?: Partial<ChartMessages>): ChartMessages {
  const ctx = useContext(ChartMessagesContext);
  return useMemo<ChartMessages>(
    () => (overrides ? { ...ctx, ...overrides } : ctx),
    [ctx, overrides],
  );
}

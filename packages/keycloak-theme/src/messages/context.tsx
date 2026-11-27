import { createContext, type ReactNode, useContext } from 'react';
import { faAuthMessages } from './fa.ts';
import type { AuthMessages } from './types.ts';

const AuthMessagesContext = createContext<AuthMessages>(faAuthMessages);

export interface AuthMessagesProviderProps {
  /** Overrides or provides a localized AuthMessages catalogue. Defaults to `faAuthMessages`. */
  messages?: AuthMessages | undefined;
  children: ReactNode;
}

/** Provides typed auth-screen messages to all Keycloak theme screens (D-94). */
export function AuthMessagesProvider({
  messages = faAuthMessages,
  children,
}: AuthMessagesProviderProps) {
  return <AuthMessagesContext.Provider value={messages}>{children}</AuthMessagesContext.Provider>;
}

/** Reads the active typed auth-screen message catalogue. */
export function useAuthMessages(): AuthMessages {
  return useContext(AuthMessagesContext);
}

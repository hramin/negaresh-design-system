// @vitest-environment node
import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import type { ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { mockKcContexts, sampleAuthFixtures } from '../fixtures/index.ts';
import KcPage from '../login/KcPage.tsx';
import { AuthMessagesProvider } from '../messages/context.tsx';
import { faAuthMessages } from '../messages/fa.ts';
import { ErrorScreen } from '../screens/ErrorScreen.tsx';
import { ForgotPassword } from '../screens/ForgotPassword.tsx';
import { InfoScreen } from '../screens/InfoScreen.tsx';
import { PasswordSignIn } from '../screens/PasswordSignIn.tsx';
import { PhoneSignIn } from '../screens/PhoneSignIn.tsx';
import { Register } from '../screens/Register.tsx';
import { TwoFactorSetup } from '../screens/TwoFactorSetup.tsx';
import { VerifyMobile } from '../screens/VerifyMobile.tsx';

function renderSsr(node: ReactNode): string {
  return renderToString(
    <ThemeProvider messages={faMessages}>
      <AuthMessagesProvider messages={faAuthMessages}>{node}</AuthMessagesProvider>
    </ThemeProvider>,
  );
}

describe('P6 Wave 2 · Node SSR parity (zero window/document access)', () => {
  it('renders all 8 auth screens and KcPage on the server without throwing', () => {
    const outputs = [
      renderSsr(<PhoneSignIn step="phone" />),
      renderSsr(<PhoneSignIn step="otp" resendSecondsRemaining={45} />),
      renderSsr(<PasswordSignIn defaultUsername={sampleAuthFixtures.staffEmail} />),
      renderSsr(<ForgotPassword mode="sms" step="identify" />),
      renderSsr(<Register />),
      renderSsr(<VerifyMobile step="phone" />),
      renderSsr(
        <TwoFactorSetup
          qrImageSrc={sampleAuthFixtures.totpQrDataUri}
          manualSecret={sampleAuthFixtures.totpSecret}
        />,
      ),
      renderSsr(<ErrorScreen referenceCode={sampleAuthFixtures.errorReferenceCode} />),
      renderSsr(<InfoScreen actionHref="#app" />),
      renderToString(<KcPage kcContext={mockKcContexts.phoneSignIn()} />),
      renderToString(<KcPage kcContext={mockKcContexts.twoFactorSetup()} />),
    ];

    for (const html of outputs) {
      expect(html).toContain('data-nds="AuthShell"');
      expect(html).toContain('dir="rtl"');
    }
  });
});

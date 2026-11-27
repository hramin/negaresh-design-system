import { cleanup, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockKcContexts, sampleAuthFixtures } from '../fixtures/index.ts';
import KcPage from '../login/KcPage.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';

describe('P6 Wave 2 · Keycloakify KcPage adapter routing', () => {
  it('routes login-phone.ftl and login-sms-otp.ftl with native POST form bindings', async () => {
    const { container: phoneContainer } = render(
      <KcPage kcContext={mockKcContexts.phoneSignIn()} />,
    );
    const phoneForm = phoneContainer.querySelector('form');
    expect(phoneForm?.getAttribute('method')).toBe('post');
    expect(phoneForm?.getAttribute('action')).toBe('#keycloak-action');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('ورود به حساب نگرش');
    await expectNoAxeViolations(phoneContainer);
    cleanup();

    const { container: otpContainer } = render(
      <KcPage kcContext={mockKcContexts.phoneOtp({ fieldErrors: { code: 'کد نادرست است.' } })} />,
    );
    expect(
      otpContainer.querySelector('input[type="hidden"][name="phone"]')?.getAttribute('value'),
    ).toBe(sampleAuthFixtures.phone);
    expect(otpContainer.textContent).toContain('کد نادرست است.');
    await expectNoAxeViolations(otpContainer);
  });

  it('routes login.ftl, login-reset-password.ftl, and register.ftl with server banners & errors', async () => {
    const { container: loginContainer } = render(
      <KcPage
        kcContext={mockKcContexts.passwordSignIn({
          message: { type: 'error', summary: 'نام کاربری یا رمز عبور نادرست است.' },
        })}
      />,
    );
    expect(loginContainer.textContent).toContain('نام کاربری یا رمز عبور نادرست است.');
    await expectNoAxeViolations(loginContainer);
    cleanup();

    const { container: resetContainer } = render(
      <KcPage kcContext={mockKcContexts.forgotPassword()} />,
    );
    expect(resetContainer.querySelector('[data-nds="ForgotPassword"]')).not.toBeNull();
    await expectNoAxeViolations(resetContainer);
    cleanup();

    const { container: registerContainer } = render(
      <KcPage
        kcContext={mockKcContexts.register({ fieldErrors: { email: 'ایمیل تکراری است.' } })}
      />,
    );
    expect(registerContainer.querySelector('form')?.getAttribute('action')).toBe(
      '#register-action',
    );
    expect(registerContainer.textContent).toContain('ایمیل تکراری است.');
    await expectNoAxeViolations(registerContainer);
  });

  it('routes verify-mobile.ftl, login-config-totp.ftl, error.ftl, and info.ftl cleanly', async () => {
    const { container: verifyContainer } = render(
      <KcPage kcContext={mockKcContexts.verifyMobile({ step: 'phone' })} />,
    );
    expect(verifyContainer.querySelector('[data-nds="VerifyMobile"]')).not.toBeNull();
    await expectNoAxeViolations(verifyContainer);
    cleanup();

    const { container: totpContainer } = render(
      <KcPage kcContext={mockKcContexts.twoFactorSetup()} />,
    );
    expect(
      totpContainer.querySelector('input[type="hidden"][name="totpSecret"]')?.getAttribute('value'),
    ).toBe(sampleAuthFixtures.totpSecretRaw);
    await expectNoAxeViolations(totpContainer);
    cleanup();

    const { container: errorContainer } = render(<KcPage kcContext={mockKcContexts.error()} />);
    expect(errorContainer.querySelector('[data-nds="ErrorScreen"]')).not.toBeNull();
    await expectNoAxeViolations(errorContainer);
    cleanup();

    const { container: infoContainer } = render(
      <KcPage
        kcContext={mockKcContexts.info({
          requiredActions: [...sampleAuthFixtures.infoRequiredActions],
        })}
      />,
    );
    expect(infoContainer.querySelector('[data-nds="InfoScreen"]')).not.toBeNull();
    await expectNoAxeViolations(infoContainer);
  });
});

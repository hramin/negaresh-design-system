import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { sampleAuthFixtures } from '../fixtures/index.ts';
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
import { expectNoAxeViolations } from '../test/axe.ts';

function wrap(ui: ReactNode) {
  return (
    <ThemeProvider messages={faMessages}>
      <AuthMessagesProvider messages={faAuthMessages}>{ui}</AuthMessagesProvider>
    </ThemeProvider>
  );
}

describe('P6 Wave 2 · @negaresh/keycloak-theme auth screens', () => {
  it('PhoneSignIn normalises Persian digits to +989…, transitions to OTP, and passes axe', async () => {
    const user = userEvent.setup();
    const onSubmitPhone = vi.fn();
    const onSubmitOtp = vi.fn();

    const { container } = render(
      wrap(
        <PhoneSignIn
          onSubmitPhone={onSubmitPhone}
          onSubmitOtp={onSubmitOtp}
          resendSecondsRemaining={45}
          captchaSlot={<span>ویجت امنیتی</span>}
        />,
      ),
    );

    const phoneInput = screen.getByLabelText(/شمارهٔ موبایل/);
    expect(phoneInput.getAttribute('dir')).toBe('ltr');
    await user.type(phoneInput, '۰۹۱۲۳۴۵۶۷۸۹');
    await user.click(screen.getByRole('button', { name: 'دریافت کد تأیید' }));

    expect(onSubmitPhone).toHaveBeenCalledWith('+989123456789');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('تأیید شمارهٔ موبایل');
    expect(screen.getByText(/۲ دقیقه/)).toBeTruthy();

    const otpInputs = container.querySelectorAll('input[inputmode="numeric"]');
    expect(otpInputs).toHaveLength(6);
    await user.type(otpInputs[0] as HTMLElement, '482915');
    await user.click(screen.getByRole('button', { name: 'تأیید و ورود' }));

    expect(onSubmitOtp).toHaveBeenCalledWith({ phone: '+989123456789', code: '482915' });
    await expectNoAxeViolations(container);
  });

  it('PhoneSignIn disables submit and announces warning under rate-limit state', async () => {
    const { container } = render(wrap(<PhoneSignIn rateLimitedSeconds={55} />));
    expect(screen.getByText(/۵۵ ثانیهٔ دیگر/)).toBeTruthy();
    const submitBtn = screen.getByRole('button', { name: 'دریافت کد تأیید' }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
    await expectNoAxeViolations(container);
  });

  it('PasswordSignIn isolates username LTR, validates empty fields, and passes axe', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(
      wrap(
        <PasswordSignIn
          socialProviders={sampleAuthFixtures.socialProviders}
          forgotPasswordHref="#forgot"
          phoneSignInHref="#phone"
          onSubmit={onSubmit}
        />,
      ),
    );

    const usernameInput = screen.getByLabelText(/ایمیل یا نام کاربری/);
    expect(usernameInput.getAttribute('dir')).toBe('ltr');

    await user.click(screen.getByRole('button', { name: 'ورود به حساب' }));
    expect(container.querySelector('[data-nds="FormErrorSummary"]')).not.toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.type(usernameInput, sampleAuthFixtures.staffEmail);
    await user.type(screen.getByLabelText(/^رمز عبور/), 'NdsSecure2026');
    await user.click(screen.getByRole('button', { name: 'ورود به حساب' }));

    expect(onSubmit).toHaveBeenCalledWith({
      username: sampleAuthFixtures.staffEmail,
      password: 'NdsSecure2026',
      rememberMe: false,
    });
    await expectNoAxeViolations(container);
  });

  it('ForgotPassword completes 3-step SMS recovery (Phone → OTP → New Password) and passes axe', async () => {
    const user = userEvent.setup();
    const onResetPassword = vi.fn();
    const { container } = render(
      wrap(<ForgotPassword mode="sms" onResetPassword={onResetPassword} />),
    );

    await user.type(screen.getByLabelText(/شمارهٔ موبایل/), '09123456789');
    await user.click(screen.getByRole('button', { name: 'ارسال کد بازیابی' }));
    expect(screen.getByText('مرحلهٔ ۲ از ۳')).toBeTruthy();

    const otpInputs = container.querySelectorAll('input[inputmode="numeric"]');
    await user.type(otpInputs[0] as HTMLElement, '123456');
    await user.click(screen.getByRole('button', { name: 'تأیید کد و ادامه' }));
    expect(screen.getByText('مرحلهٔ ۳ از ۳')).toBeTruthy();

    await user.type(screen.getByLabelText(/^رمز عبور جدید/), 'Negaresh2026');
    await user.type(screen.getByLabelText(/^تکرار رمز عبور جدید/), 'Negaresh2026');
    await user.click(screen.getByRole('button', { name: 'ذخیرهٔ رمز عبور جدید' }));

    expect(onResetPassword).toHaveBeenCalledWith({ password: 'Negaresh2026' });
    expect(screen.getByText('درخواست بازیابی ثبت شد')).toBeTruthy();
    await expectNoAxeViolations(container);
  });

  it('Register validates fields via FormErrorSummary and submits normalized values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(wrap(<Register onSubmit={onSubmit} />));

    await user.click(screen.getByRole('button', { name: 'ساخت حساب کاربری' }));
    expect(container.querySelector('[data-nds="FormErrorSummary"]')).not.toBeNull();

    await user.type(screen.getByLabelText(/^نام(?! خانوادگی)/), sampleAuthFixtures.firstName);
    await user.type(screen.getByLabelText(/^نام خانوادگی/), sampleAuthFixtures.lastName);
    await user.type(screen.getByLabelText(/^شمارهٔ موبایل/), '09123456789');
    await user.type(screen.getByLabelText(/^نشانی ایمیل/), sampleAuthFixtures.staffEmail);
    await user.type(screen.getByLabelText(/^رمز عبور/), 'Negaresh2026');
    await user.type(screen.getByLabelText(/^تکرار رمز عبور/), 'Negaresh2026');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'ساخت حساب کاربری' }));

    expect(onSubmit).toHaveBeenCalledWith({
      firstName: sampleAuthFixtures.firstName,
      lastName: sampleAuthFixtures.lastName,
      phone: '+989123456789',
      email: sampleAuthFixtures.staffEmail,
      password: 'Negaresh2026',
      termsAccepted: true,
    });
    await expectNoAxeViolations(container);
  });

  it('VerifyMobile explains migrated-user requirement and completes phone → OTP verification', async () => {
    const user = userEvent.setup();
    const onSubmitOtp = vi.fn();
    const { container } = render(wrap(<VerifyMobile onSubmitOtp={onSubmitOtp} />));

    expect(screen.getByText('تکمیل امنیت حساب منتقل‌شده')).toBeTruthy();
    await user.type(screen.getByLabelText(/شمارهٔ موبایل/), '09123456789');
    await user.click(screen.getByRole('button', { name: 'ارسال کد تأیید' }));

    const otpInputs = container.querySelectorAll('input[inputmode="numeric"]');
    await user.type(otpInputs[0] as HTMLElement, '654321');
    await user.click(screen.getByRole('button', { name: 'ثبت و تأیید شماره' }));

    expect(onSubmitOtp).toHaveBeenCalledWith({ phone: '+989123456789', code: '654321' });
    await expectNoAxeViolations(container);
  });

  it('TwoFactorSetup renders QR, LTR copyable manual secret, and verifies 6-digit TOTP', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(
      wrap(
        <TwoFactorSetup
          qrImageSrc={sampleAuthFixtures.totpQrDataUri}
          manualSecret={sampleAuthFixtures.totpSecret}
          rawSecret={sampleAuthFixtures.totpSecretRaw}
          onSubmit={onSubmit}
        />,
      ),
    );

    expect(screen.getByAltText(/رمزینهٔ QR/)).toBeTruthy();
    expect(screen.getByText(sampleAuthFixtures.totpSecret)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'کپی کلید دستی' })).toBeTruthy();

    const otpInputs = container.querySelectorAll('input[inputmode="numeric"]');
    await user.type(otpInputs[0] as HTMLElement, '998877');
    await user.click(screen.getByRole('button', { name: 'فعال‌سازی ورود دومرحله‌ای' }));

    expect(onSubmit).toHaveBeenCalledWith({
      code: '998877',
      deviceLabel: undefined,
      logoutSessions: false,
    });
    await expectNoAxeViolations(container);
  });

  it('ErrorScreen and InfoScreen pair status badges with icons and copyable LTR code', async () => {
    const { container: errContainer } = render(
      wrap(
        <ErrorScreen
          referenceCode={sampleAuthFixtures.errorReferenceCode}
          backHref="#home"
          supportHref="#support"
        />,
      ),
    );
    expect(screen.getByText(sampleAuthFixtures.errorReferenceCode)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'کپی کد پیگیری' })).toBeTruthy();
    await expectNoAxeViolations(errContainer);
    cleanup();

    const { container: infoContainer } = render(
      wrap(
        <InfoScreen
          requiredActions={sampleAuthFixtures.infoRequiredActions}
          actionHref="#continue"
        />,
      ),
    );
    expect(screen.getByText('مراحل باقی‌مانده')).toBeTruthy();
    await expectNoAxeViolations(infoContainer);
  });
});

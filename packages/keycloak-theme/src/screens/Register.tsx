import { iconUser } from '@negaresh/icons';
import {
  Button,
  Checkbox,
  FormErrorSummary,
  Link,
  PasswordField,
  PhoneField,
  Text,
  TextField,
} from '@negaresh/react';
import { normalizePhone } from '@negaresh/utils';
import { type FormEvent, type ReactNode, useId, useState } from 'react';
import { useAuthMessages } from '../messages/context.tsx';
import { type AuthBannerMessage, AuthShell, type AuthShellProps } from '../shell/AuthShell.tsx';
import styles from './AuthScreens.module.css';

export interface RegisterFieldErrors {
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  passwordConfirm?: string | undefined;
  terms?: string | undefined;
}

export interface RegisterValues {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

export interface RegisterProps {
  /** Initial form field values. */
  defaultValues?: Partial<RegisterValues> | undefined;
  /** Server-side field validation errors. */
  fieldErrors?: RegisterFieldErrors | undefined;
  /** Whether email is required (default `false`; optional with helper note). */
  emailRequired?: boolean | undefined;
  /** Whether password fields are required (`kcContext.passwordRequired`). Default `true`. */
  passwordRequired?: boolean | undefined;
  /** Whether terms acceptance checkbox is required (`kcContext.termsAcceptanceRequired`). Default `true`. */
  termsRequired?: boolean | undefined;
  /** Optional CAPTCHA slot. */
  captchaSlot?: ReactNode;
  /** Pending state. */
  isPending?: boolean | undefined;
  /** Keycloak POST registration action URL (`url.registrationAction`). */
  actionUrl?: string | undefined;
  /** Sign-in link URL (`url.loginUrl`). */
  signInHref?: string | undefined;
  /** Optional callback for switching to sign-in. */
  onNavigateSignIn?: (() => void) | undefined;
  /** Client submit handler (prevents default when provided). */
  onSubmit?: ((values: RegisterValues) => void) | undefined;
  /** Optional banner message. */
  banner?: AuthBannerMessage | undefined;
  /** Shell overrides. */
  shellProps?: Partial<Omit<AuthShellProps, 'title' | 'children'>> | undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Account registration screen (`register.ftl`) with Persian names, normalised LTR mobile,
 * optional/required LTR email, password strength guidance, and accessible error summary.
 */
export function Register({
  defaultValues,
  fieldErrors,
  emailRequired = false,
  passwordRequired = true,
  termsRequired = true,
  captchaSlot,
  isPending = false,
  actionUrl,
  signInHref,
  onNavigateSignIn,
  onSubmit,
  banner,
  shellProps,
}: RegisterProps) {
  const m = useAuthMessages();
  const baseId = useId();
  const ids = {
    firstName: `${baseId}-firstName`,
    lastName: `${baseId}-lastName`,
    phone: `${baseId}-phone`,
    email: `${baseId}-email`,
    password: `${baseId}-password`,
    passwordConfirm: `${baseId}-passwordConfirm`,
    terms: `${baseId}-terms`,
  };

  const [firstName, setFirstName] = useState(defaultValues?.firstName ?? '');
  const [lastName, setLastName] = useState(defaultValues?.lastName ?? '');
  const [phone, setPhone] = useState(defaultValues?.phone ?? '');
  const [email, setEmail] = useState(defaultValues?.email ?? '');
  const [password, setPassword] = useState(defaultValues?.password ?? '');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(defaultValues?.termsAccepted ?? false);
  const [localErrors, setLocalErrors] = useState<RegisterFieldErrors>({});

  const errors: RegisterFieldErrors = {
    firstName: localErrors.firstName ?? fieldErrors?.firstName,
    lastName: localErrors.lastName ?? fieldErrors?.lastName,
    phone: localErrors.phone ?? fieldErrors?.phone,
    email: localErrors.email ?? fieldErrors?.email,
    password: localErrors.password ?? fieldErrors?.password,
    passwordConfirm: localErrors.passwordConfirm ?? fieldErrors?.passwordConfirm,
    terms: localErrors.terms ?? fieldErrors?.terms,
  };

  const summaryErrors = [
    ...(errors.firstName ? [{ id: ids.firstName, message: errors.firstName }] : []),
    ...(errors.lastName ? [{ id: ids.lastName, message: errors.lastName }] : []),
    ...(errors.phone ? [{ id: ids.phone, message: errors.phone }] : []),
    ...(errors.email ? [{ id: ids.email, message: errors.email }] : []),
    ...(errors.password ? [{ id: ids.password, message: errors.password }] : []),
    ...(errors.passwordConfirm ? [{ id: ids.passwordConfirm, message: errors.passwordConfirm }] : []),
    ...(errors.terms ? [{ id: ids.terms, message: errors.terms }] : []),
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const next: RegisterFieldErrors = {};
    if (!firstName.trim()) next.firstName = m.common.requiredFieldError;
    if (!lastName.trim()) next.lastName = m.common.requiredFieldError;
    const canonicalPhone = normalizePhone(phone);
    if (!canonicalPhone) next.phone = m.common.invalidPhoneError;
    if (emailRequired && !email.trim()) {
      next.email = m.common.requiredFieldError;
    } else if (email.trim() && !EMAIL_RE.test(email.trim())) {
      next.email = m.common.invalidEmailError;
    }
    if (passwordRequired) {
      if (password.length < 8) next.password = m.common.passwordTooShortError;
      if (password !== passwordConfirm) next.passwordConfirm = m.common.passwordMismatchError;
    }
    if (termsRequired && !termsAccepted) {
      next.terms = m.common.termsRequiredError;
    }

    if (Object.values(next).some(Boolean)) {
      event.preventDefault();
      setLocalErrors(next);
      return;
    }
    setLocalErrors({});
    if (onSubmit || !actionUrl) {
      event.preventDefault();
      onSubmit?.({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: canonicalPhone!,
        email: email.trim(),
        password,
        termsAccepted,
      });
    }
  };

  const footer =
    signInHref || onNavigateSignIn ? (
      <div className={styles.linkRow}>
        <Text size="sm" tone="muted">
          {m.register.alreadyHaveAccountPrompt}
        </Text>
        {signInHref && !onNavigateSignIn ? (
          <Link href={signInHref} variant="standalone" className={styles.touchLink}>
            {m.register.signInAction}
          </Link>
        ) : (
          <Button type="button" variant="ghost" onPress={() => onNavigateSignIn?.()}>
            {m.register.signInAction}
          </Button>
        )}
      </div>
    ) : undefined;

  return (
    <AuthShell
      {...shellProps}
      title={m.register.title}
      subtitle={m.register.subtitle}
      banner={banner}
      cardFooter={footer}
    >
      <div data-nds="Register">
        <form
          method={actionUrl ? 'post' : undefined}
          action={actionUrl}
          noValidate
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <FormErrorSummary errors={summaryErrors} title={m.common.errorSummaryTitle} />

          <div className={styles.nameRow}>
            <TextField
              id={ids.firstName}
              name="firstName"
              label={m.register.firstNameLabel}
              autoComplete="given-name"
              value={firstName}
              onChange={(next) => {
                setFirstName(next);
                if (localErrors.firstName) setLocalErrors((prev) => ({ ...prev, firstName: undefined }));
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(errors.firstName)}
              errorMessage={errors.firstName}
            />
            <TextField
              id={ids.lastName}
              name="lastName"
              label={m.register.lastNameLabel}
              autoComplete="family-name"
              value={lastName}
              onChange={(next) => {
                setLastName(next);
                if (localErrors.lastName) setLocalErrors((prev) => ({ ...prev, lastName: undefined }));
              }}
              isRequired
              isDisabled={isPending}
              isInvalid={Boolean(errors.lastName)}
              errorMessage={errors.lastName}
            />
          </div>

          <PhoneField
            id={ids.phone}
            name="phone"
            label={m.register.phoneLabel}
            description={m.register.phoneDescription}
            value={phone}
            onChange={(next) => {
              setPhone(next);
              if (localErrors.phone) setLocalErrors((prev) => ({ ...prev, phone: undefined }));
            }}
            isRequired
            isDisabled={isPending}
            isInvalid={Boolean(errors.phone)}
            errorMessage={errors.phone}
          />

          <TextField
            id={ids.email}
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            label={m.register.emailLabel}
            description={emailRequired ? undefined : m.register.emailOptionalNote}
            value={email}
            onChange={(next) => {
              setEmail(next);
              if (localErrors.email) setLocalErrors((prev) => ({ ...prev, email: undefined }));
            }}
            isRequired={emailRequired}
            isDisabled={isPending}
            isInvalid={Boolean(errors.email)}
            errorMessage={errors.email}
          />

          {passwordRequired && (
            <>
              <PasswordField
                id={ids.password}
                name="password"
                label={m.register.passwordLabel}
                strengthHint={m.register.passwordStrengthHint}
                autoComplete="new-password"
                value={password}
                onChange={(next) => {
                  setPassword(next);
                  if (localErrors.password) setLocalErrors((prev) => ({ ...prev, password: undefined }));
                }}
                isRequired
                isDisabled={isPending}
                isInvalid={Boolean(errors.password)}
                errorMessage={errors.password}
              />

              <PasswordField
                id={ids.passwordConfirm}
                name="password-confirm"
                label={m.register.confirmPasswordLabel}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(next) => {
                  setPasswordConfirm(next);
                  if (localErrors.passwordConfirm) {
                    setLocalErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
                  }
                }}
                isRequired
                isDisabled={isPending}
                isInvalid={Boolean(errors.passwordConfirm)}
                errorMessage={errors.passwordConfirm}
              />
            </>
          )}

          {termsRequired && (
            <Checkbox
              id={ids.terms}
              name="termsAccepted"
              value="true"
              isSelected={termsAccepted}
              onChange={(checked) => {
                setTermsAccepted(checked);
                if (localErrors.terms) setLocalErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              isInvalid={Boolean(errors.terms)}
              isDisabled={isPending}
            >
              {m.register.termsLabel}
            </Checkbox>
          )}

          {captchaSlot && (
            <fieldset className={styles.captchaSlot}>
              <legend className={styles.captchaLegend}>{m.common.captchaLabel}</legend>
              {captchaSlot}
            </fieldset>
          )}

          <Button type="submit" variant="primary" iconStart={iconUser} fullWidth isPending={isPending}>
            {m.register.submitAction}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}

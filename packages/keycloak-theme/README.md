# `@negaresh/keycloak-theme`

Keycloakify (Vite) login theme built on `@negaresh/theme-company`, `@negaresh/tokens`, `@negaresh/react`, `@negaresh/icons`, and `@negaresh/utils` for all Negaresh Persian products (Registry, Main site, Test platform, and later Ravanma).

## Implemented screens

| Screen component | Keycloak `pageId` | Notes |
| --- | --- | --- |
| `PhoneSignIn` | `login-phone.ftl`, `login-sms-otp.ftl` | Two-step mobile (`PhoneField`, normalised to `+989xxxxxxxxx`) → 6-digit `OTPField` with 60-s resend countdown, 2-min expiry, rate-limit, and CAPTCHA slot |
| `PasswordSignIn` | `login.ftl` | LTR email/username, `PasswordField` reveal toggle, remember-me, forgot password, register, and social/SSO links |
| `ForgotPassword` | `login-reset-password.ftl`, `login-update-password.ftl` | SMS recovery (Phone → OTP → new password) and standard identifier reset flows |
| `Register` | `register.ftl` | Persian first/last name, LTR mobile, optional/required LTR email, password confirmation, terms, and CAPTCHA slot |
| `VerifyMobile` | `verify-mobile.ftl` | Required Action for migrated users without a verified Iranian mobile number |
| `TwoFactorSetup` | `login-config-totp.ftl`, `login-otp.ftl` | Authenticator QR code, LTR copyable base32 manual key, 6-digit verification, device label, and TOTP challenge |
| `ErrorScreen` | `error.ftl` | Calm Persian error screen with severity badge + icon, copyable LTR error reference code, and recovery CTA |
| `InfoScreen` | `info.ftl` | Confirmation / required-actions screen with primary continue CTA |

## Custom SPI contract (`KcContextExtensionPerPage`)

`keycloakify build` reads `src/login/KcContext.ts` and emits FreeMarker templates for custom authenticator and required-action SPIs:

- `login-phone.ftl` — expects optional `phone`, `passwordLoginUrl`, `registrationUrl`, `rateLimitedSeconds`, `phoneFieldName` (default `phone`).
- `login-sms-otp.ftl` — expects optional `phone`, `maskedPhone`, `resendCooldownSeconds` (default `60`), `codeExpiryMinutes` (default `2`), `changePhoneUrl`, `expired`, `rateLimitedSeconds`, `otpFieldName` (default `code`).
- `verify-mobile.ftl` — expects optional `step` (`'phone' | 'otp'`), `phone`, `maskedPhone`, `isMigratedUser`, `resendCooldownSeconds`, `codeExpiryMinutes`, `changePhoneUrl`, `logoutUrl`.

## Commands

```bash
# Library ESM + TypeScript declarations + Keycloakify Vite web bundle (Node-only; used by CI)
pnpm --filter @negaresh/keycloak-theme build

# Package Keycloak 26+ theme JAR (requires Java 17+ and Maven)
pnpm --filter @negaresh/keycloak-theme build:jar
# Output: packages/keycloak-theme/dist_keycloak/negaresh-keycloak-theme.jar

# Run unit, axe-core, KcPage adapter, and Node SSR tests
pnpm --filter @negaresh/keycloak-theme test
```

## Local Keycloak container verification

```bash
docker run --rm --name nds-keycloak -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -v "$(pwd)/packages/keycloak-theme/dist_keycloak/negaresh-keycloak-theme.jar:/opt/keycloak/providers/negaresh-keycloak-theme.jar:ro" \
  quay.io/keycloak/keycloak:26.1 start-dev
```

Then set **Realm settings → Themes → Login theme = `negaresh`** and **Localization → Internationalization = On, Default locale = `fa`**.

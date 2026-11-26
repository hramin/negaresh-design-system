/**
 * The approved reference page (reference/registry-activation) rebuilt from NDS components:
 * header and actions (P2) plus the full Registry activation form, validation, error summary,
 * serial/code normalization, Jalali/Toman formatting, and gateway ChoiceCard picker (P3 Wave 4).
 * `e2e/reference.spec.ts` compares header, desktop actions, and mobile bar pixel by pixel.
 */
import {
  iconApp,
  iconChevronDown,
  iconHelp,
  iconLink,
  iconLock,
  iconMoon,
  iconPhone,
  iconSuccess,
  iconSun,
  iconWarning,
} from '@negaresh/icons';
import {
  AccountPill,
  Button,
  ButtonGroup,
  ChoiceCard,
  Code,
  CodeField,
  Container,
  CopyButton,
  Form,
  FormErrorSummary,
  Heading,
  Icon,
  IconButton,
  Link,
  LinkButton,
  LogoSlot,
  Ltr,
  Menu,
  MenuItem,
  MenuTrigger,
  RadioGroup,
  Section,
  SerialField,
  SkipLink,
  Stack,
  Surface,
  Text,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavLink,
  useTheme,
} from '@negaresh/react';
import {
  formatDateTime,
  formatPrice,
  formatSerial,
  isValidSerial,
  maskPhone,
  normalizeSerial,
} from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styles from './registry-activation.module.css';

type State = 'form' | 'error' | 'success' | 'limit';
type Gateway = 'behpardakht' | 'zarinpal' | 'zibal';

const DEFAULT_SERIAL = 'N25AG-EMV0K';
const DEFAULT_SYSCODE = '882859354';
const ACTIVATION_CODE = '441790826153';
const ACTIVATION_CODE_DISPLAY = '4417 9082 6153';
const ACTIVATION_TIMESTAMP_ISO = '2026-11-13T13:34:00Z';
const EXTRA_ACTIVATION_PRICE = 95_000;
const WRONG_PRODUCT_ERROR =
  'این سریال برای «نگارش تست هوش ۴» نیست. سریال همین برنامه را وارد کنید.';

const coerceSearchParam = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
};

export const Route = createFileRoute('/reference/registry-activation')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { state?: State; s?: string; code?: string } => {
    const out: { state?: State; s?: string; code?: string } = {};
    if (
      search.state === 'success' ||
      search.state === 'limit' ||
      search.state === 'form' ||
      search.state === 'error'
    ) {
      out.state = search.state;
    }
    const serialParam = coerceSearchParam(search.s);
    if (serialParam !== undefined) out.s = serialParam;
    const codeParam = coerceSearchParam(search.code);
    if (codeParam !== undefined) out.code = codeParam;
    return out;
  },
  head: () => ({ meta: [{ title: 'فعال‌سازی نرم‌افزار — بازسازی مرجع' }] }),
  component: RegistryActivation,
});

const COPY: Record<State, [string, string]> = {
  form: [
    'فعال‌سازی نرم‌افزار',
    'سریالی را که خریده‌اید وارد کنید تا کد فعال‌سازی ساخته شود. کد را در برنامه وارد می‌کنید و کار تمام است.',
  ],
  error: [
    'فعال‌سازی نرم‌افزار',
    'سریالی را که خریده‌اید وارد کنید تا کد فعال‌سازی ساخته شود. کد را در برنامه وارد می‌کنید و کار تمام است.',
  ],
  success: [
    'برنامه آمادهٔ فعال‌سازی است',
    'کد زیر را در پنجرهٔ فعال‌سازی برنامه وارد کنید. بعداً هم در «فعال‌سازی‌های من» در دسترس است.',
  ],
  limit: [
    'فعال‌سازی روی رایانهٔ تازه',
    'سقف این سریال پر شده است. می‌توانید یک فعال‌سازی دیگر بخرید یا با پشتیبانی تماس بگیرید.',
  ],
};

const NAV: [string, string][] = [
  ['فعال‌سازی', '#main'],
  ['فعال‌سازی‌های من', '#activations'],
  ['خریدها', '#purchases'],
  ['پشتیبانی', '#support'],
];

const GATEWAYS: readonly { id: Gateway; label: string }[] = [
  { id: 'behpardakht', label: 'به‌پرداخت ملت' },
  { id: 'zarinpal', label: 'زرین‌پال' },
  { id: 'zibal', label: 'زیبال' },
];

function RegistryActivation() {
  const { state: searchState = 'form', s, code } = Route.useSearch();
  const [activeState, setActiveState] = useState<State>(searchState);
  const [serial, setSerial] = useState(() => normalizeSerial(s ?? DEFAULT_SERIAL));
  const [sysCode, setSysCode] = useState(() => normalizeSerial(code ?? DEFAULT_SYSCODE));
  const [serialError, setSerialError] = useState<string | undefined>(() =>
    searchState === 'error' ? WRONG_PRODUCT_ERROR : undefined,
  );
  const [gateway, setGateway] = useState<Gateway>('behpardakht');
  const [smsNotice, setSmsNotice] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [helpOpenMobile, setHelpOpenMobile] = useState(false);

  useEffect(() => {
    setActiveState(searchState);
    setSerialError(searchState === 'error' ? WRONG_PRODUCT_ERROR : undefined);
    setSmsNotice(null);
    setPaymentNotice(null);
  }, [searchState]);

  useEffect(() => {
    if (s !== undefined) setSerial(normalizeSerial(s));
  }, [s]);

  useEffect(() => {
    if (code !== undefined) setSysCode(normalizeSerial(code));
  }, [code]);

  const [title, lede] = COPY[activeState];
  const isFormView = activeState === 'form' || activeState === 'error';
  const formattedSerial = formatSerial(serial) || DEFAULT_SERIAL;
  const jalaliTime = formatDateTime(ACTIVATION_TIMESTAMP_ISO);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const canonical = normalizeSerial(serial);
    if (!canonical) {
      setSerialError('سریال را وارد کنید.');
      setActiveState('error');
      return;
    }
    if (!isValidSerial(canonical)) {
      setSerialError('سریال را مطابق الگوی XXXXX-XXXXX وارد کنید.');
      setActiveState('error');
      return;
    }
    if (canonical === 'WRONG00000') {
      setSerialError(WRONG_PRODUCT_ERROR);
      setActiveState('error');
      return;
    }
    if (canonical === 'REVOKED000') {
      setSerialError('این سریال باطل شده است. با پشتیبانی تماس بگیرید.');
      setActiveState('error');
      return;
    }
    if (canonical === 'LIMIT00000') {
      setSerialError(undefined);
      setActiveState('limit');
      return;
    }
    setSerialError(undefined);
    setActiveState('success');
  };

  const handleGatewayPay = () => {
    const selected = GATEWAYS.find((g) => g.id === gateway)?.label ?? 'درگاه پرداخت';
    setPaymentNotice(`انتقال به ${selected} برای مبلغ ${formatPrice(EXTRA_ACTIVATION_PRICE)} آماده شد.`);
  };

  return (
    <div className={styles.frame} data-reference-rebuild data-registry-state={activeState}>
      <SkipLink />
      <RegistryHeader />
      <main id="main" className={styles.mainLandmark}>
        <Container className={styles.page}>
          <div className={styles.main}>
            <Stack gap="2" className={styles.pageHead}>
              <p className={styles.eyebrow}>
                <span className={styles.badge}>
                  <Icon icon={iconLink} size="sm" />
                  <span>باز شده از برنامه</span>
                </span>
              </p>
              <Heading level={1}>{title}</Heading>
              <Text as="p" tone="muted" leading="text" className={styles.lede}>
                {lede}
              </Text>
            </Stack>

            {isFormView && (
              <Surface aria-labelledby="rb-title" className={styles.primarySurface}>
                <Form
                  id="registry-activation-form"
                  aria-labelledby="rb-title"
                  validationBehavior="aria"
                  onSubmit={handleSubmit}
                >
                  <Section>
                    <Stack gap="6">
                      <Stack gap="1">
                        <Heading level={2} size="lg" id="rb-title">
                          سریال را وارد کنید
                        </Heading>
                        <Text as="p" size="sm" tone="muted">
                          نام محصول و کد سیستم از برنامه آمده‌اند؛ فقط سریال لازم است.
                        </Text>
                      </Stack>

                      <FormErrorSummary
                        errors={
                          serialError ? [{ id: 'registry-serial', message: serialError }] : []
                        }
                      />

                      <div className={styles.fieldsTwo}>
                        <SerialField
                          id="registry-serial"
                          name="serial"
                          label="سریال"
                          placeholder="XXXXX-XXXXX"
                          value={serial}
                          onChange={(next) => {
                            setSerial(next);
                            if (serialError) setSerialError(undefined);
                          }}
                          showPatternHint={false}
                          description="بزرگی و کوچکی حروف، خط تیره و فاصله مهم نیست."
                          isRequired
                          isInvalid={Boolean(serialError)}
                          errorMessage={serialError}
                        />

                        <CodeField
                          id="registry-syscode"
                          name="syscode"
                          label="کد سیستم"
                          value={sysCode}
                          isReadOnly
                          description="برنامه این کد را از سخت‌افزار رایانه می‌سازد."
                        />
                      </div>
                    </Stack>
                  </Section>

                  <Section tone="sunken" className={styles.actionsSection} data-actions="form">
                    <ButtonGroup>
                      <Button variant="primary" type="submit">
                        ساخت کد فعال‌سازی
                      </Button>
                      <Text size="xs" tone="subtle">
                        کد روی صفحه نمایش داده می‌شود و با پیامک و ایمیل هم می‌آید.
                      </Text>
                    </ButtonGroup>
                  </Section>
                </Form>
              </Surface>
            )}

            {activeState === 'success' && (
              <Surface aria-labelledby="rb-title" className={styles.primarySurface}>
                <Section>
                  <Stack gap="5">
                    <div className={`${styles.alert} ${styles.alertSuccess}`} role="status">
                      <span className={styles.alertIcon}>
                        <Icon icon={iconSuccess} size="md" />
                      </span>
                      <div>
                        <Heading level={2} size="md" id="rb-title" className={styles.alertTitle}>
                          کد فعال‌سازی ساخته شد
                        </Heading>
                        <span>
                          همین کد را در پنجرهٔ فعال‌سازی برنامه وارد کنید. یک نسخه با پیامک و ایمیل
                          هم فرستاده شد.
                        </span>
                      </div>
                    </div>

                    <div className={styles.codebox}>
                      <span className={styles.codeboxLabel} id="rb-code-label">
                        کد فعال‌سازی
                      </span>
                      <output
                        className={styles.codeboxValue}
                        id="rb-activation-code"
                        aria-labelledby="rb-code-label"
                      >
                        {ACTIVATION_CODE_DISPLAY}
                      </output>
                      <div className={styles.codeboxCopy}>
                        <CopyButton
                          value={ACTIVATION_CODE}
                          variant="primary"
                          aria-label="کپی کد فعال‌سازی"
                        >
                          کپی کد
                        </CopyButton>
                      </div>
                    </div>
                  </Stack>
                </Section>

                <Section>
                  <dl className={styles.kv}>
                    <dt>محصول</dt>
                    <dd>نگارش تست هوش ۴</dd>
                    <dt>سریال</dt>
                    <dd>
                      <Code>{formattedSerial}</Code>
                    </dd>
                    <dt>کد سیستم</dt>
                    <dd>
                      <Code>{sysCode}</Code>
                    </dd>
                    <dt>زمان</dt>
                    <dd>{jalaliTime}</dd>
                  </dl>
                  {smsNotice && (
                    <p className={styles.statusMessage} role="status">
                      {smsNotice}
                    </p>
                  )}
                </Section>

                <Section tone="sunken" className={styles.actionsSection} data-actions="success">
                  <ButtonGroup>
                    <LinkButton href="#" size="sm">
                      فعال‌سازی‌های من
                    </LinkButton>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => setSmsNotice('کد فعال‌سازی دوباره با پیامک ارسال شد.')}
                    >
                      ارسال دوبارهٔ پیامک
                    </Button>
                  </ButtonGroup>
                </Section>
              </Surface>
            )}

            {activeState === 'limit' && (
              <Surface aria-labelledby="rb-title" className={styles.primarySurface}>
                <Section>
                  <Stack gap="5">
                    <div className={`${styles.alert} ${styles.alertWarning}`} role="status">
                      <span className={styles.alertIcon}>
                        <Icon icon={iconWarning} size="md" />
                      </span>
                      <div>
                        <Heading level={2} size="md" id="rb-title" className={styles.alertTitle}>
                          سقف فعال‌سازی این سریال پر شده است
                        </Heading>
                        <span>
                          این سریال پیش‌تر روی رایانهٔ دیگری فعال شده است. اگر همان رایانه را دوباره
                          نصب کرده‌اید، از همان‌جا اقدام کنید؛ رایگان است.
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.meter} ${styles.meterFull}`}>
                      <div className={styles.meterRow}>
                        <span>رایانه‌های فعال‌شده</span>
                        <strong>۱ از ۱</strong>
                      </div>
                      <div className={styles.meterTrack} aria-hidden="true">
                        <span className={styles.meterSeg} data-on="true" />
                      </div>
                      <p className={styles.meterNote}>سقف پیش‌فرض محصول</p>
                    </div>
                  </Stack>
                </Section>

                <Section>
                  <Stack gap="5">
                    <div className={styles.limitHeader}>
                      <Stack gap="1">
                        <Heading level={3} size="md">
                          یک فعال‌سازی دیگر بخرید
                        </Heading>
                        <Text as="p" size="sm" tone="muted">
                          بعد از پرداخت، کد برای همین رایانه ساخته می‌شود.
                        </Text>
                      </Stack>
                      <span className={styles.price}>{formatPrice(EXTRA_ACTIVATION_PRICE)}</span>
                    </div>

                    <RadioGroup
                      label="درگاه پرداخت"
                      name="gateway"
                      value={gateway}
                      onChange={(next) => {
                        if (next === 'behpardakht' || next === 'zarinpal' || next === 'zibal') {
                          setGateway(next);
                          setPaymentNotice(null);
                        }
                      }}
                    >
                      <div className={styles.gatewayGrid}>
                        {GATEWAYS.map((item) => (
                          <ChoiceCard key={item.id} value={item.id} title={item.label} />
                        ))}
                      </div>
                    </RadioGroup>

                    {paymentNotice && (
                      <p className={styles.statusMessage} role="status">
                        {paymentNotice}
                      </p>
                    )}
                  </Stack>
                </Section>

                <Section tone="sunken" className={styles.actionsSection} data-actions="limit">
                  <ButtonGroup>
                    <Button variant="primary" iconStart={iconLock} onPress={handleGatewayPay}>
                      پرداخت و ساخت کد
                    </Button>
                    <LinkButton href="#" variant="ghost">
                      تماس با پشتیبانی
                    </LinkButton>
                  </ButtonGroup>
                </Section>
              </Surface>
            )}
          </div>

          <aside className={styles.aside} aria-label="جزئیات فعال‌سازی">
            <Surface className={styles.asideProduct}>
              <Section>
                <div className={styles.product}>
                  <span className={styles.productThumb} aria-hidden="true">
                    <Icon icon={iconApp} size="md" />
                  </span>
                  <Stack gap="1">
                    <Text weight="bold">نگارش تست هوش ۴</Text>
                    <Text size="xs" tone="subtle">
                      ویندوز · نسخهٔ دانلودی
                    </Text>
                  </Stack>
                </div>
              </Section>

              {activeState !== 'limit' && (
                <Section className={styles.deskOnly}>
                  <div className={styles.meter}>
                    <div className={styles.meterRow}>
                      <span>سقف این سریال</span>
                      <strong>{activeState === 'success' ? '۱ از ۱' : '۰ از ۱'}</strong>
                    </div>
                    <div className={styles.meterTrack} aria-hidden="true">
                      <span
                        className={styles.meterSeg}
                        data-on={activeState === 'success' ? 'true' : undefined}
                      />
                    </div>
                    <p className={styles.meterNote}>
                      نصب دوباره روی همین رایانه رایگان است و سقف را مصرف نمی‌کند.
                    </p>
                  </div>
                </Section>
              )}
            </Surface>

            <section className={styles.asideHelp} aria-label="راهنمای فعال‌سازی">
              <Button
                variant="ghost"
                size="sm"
                iconStart={iconHelp}
                iconEnd={iconChevronDown}
                aria-expanded={helpOpenMobile}
                aria-controls="registry-help-panel"
                className={styles.helpToggle}
                onPress={() => setHelpOpenMobile((open) => !open)}
              >
                راهنمای فعال‌سازی
              </Button>
              <div
                id="registry-help-panel"
                className={helpOpenMobile ? undefined : styles.deskOnly}
              >
                <Surface>
                  <Section>
                    <Stack gap="5">
                      <Heading level={2} size="md" className={styles.deskOnly}>
                        سه گام تا فعال‌سازی
                      </Heading>
                      <ol className={styles.steps}>
                        <li data-done="true">
                          <span>
                            <strong>باز کردن از برنامه.</strong> دکمهٔ «فعال‌سازی آنلاین» برنامه همین
                            صفحه را باز می‌کند.
                          </span>
                        </li>
                        <li
                          data-done={activeState === 'success' ? 'true' : undefined}
                          aria-current={activeState !== 'success' ? 'step' : undefined}
                        >
                          <span>
                            <strong>وارد کردن سریال.</strong> سریال روی جعبه یا در پیامک خرید است.
                          </span>
                        </li>
                        <li aria-current={activeState === 'success' ? 'step' : undefined}>
                          <span>
                            <strong>وارد کردن کد در برنامه.</strong> کد را کپی و در پنجرهٔ فعال‌سازی
                            برنامه وارد کنید.
                          </span>
                        </li>
                      </ol>
                    </Stack>
                  </Section>
                  <Section>
                    <p className={styles.supportRow}>
                      <span className={styles.supportIcon} aria-hidden="true">
                        <Icon icon={iconPhone} size="sm" />
                      </span>
                      <span>
                        پشتیبانی{' '}
                        <Link href="tel:+982191012345">
                          <Ltr>۰۲۱ ۹۱۰۱ ۲۳۴۵</Ltr>
                        </Link>
                        <br />
                        شنبه تا چهارشنبه، ۹ تا ۱۷
                      </span>
                    </p>
                  </Section>
                </Surface>
              </div>
            </section>
          </aside>
        </Container>
      </main>

      <section className={styles.mobileBar} aria-label="اقدام اصلی" data-region="mobile-bar">
        {activeState === 'success' ? (
          <CopyButton
            value={ACTIVATION_CODE}
            variant="primary"
            fullWidth
            aria-label="کپی کد فعال‌سازی"
          >
            کپی کد
          </CopyButton>
        ) : activeState === 'limit' ? (
          <Button variant="primary" fullWidth iconStart={iconLock} onPress={handleGatewayPay}>
            پرداخت ۹۵٬۰۰۰ تومان
          </Button>
        ) : (
          <Button variant="primary" fullWidth type="submit" form="registry-activation-form">
            ساخت کد فعال‌سازی
          </Button>
        )}
      </section>
    </div>
  );
}

function RegistryHeader() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const maskedPhone = maskPhone('09121234567');
  return (
    <TopBar
      data-region="header"
      brand={
        <TopBarBrand
          href="/reference/registry-activation"
          aria-label="رجیستری نگارش برتر، صفحهٔ اصلی"
        >
          <LogoSlot name="نگارش برتر" product="رجیستری" />
        </TopBarBrand>
      }
      nav={
        <TopBarNav aria-label="بخش‌های رجیستری">
          {NAV.map(([label, href], i) => (
            <TopBarNavLink key={label} href={href} isCurrent={i === 0}>
              {label}
            </TopBarNavLink>
          ))}
        </TopBarNav>
      }
      actions={
        <>
          <IconButton
            icon={isDark ? iconSun : iconMoon}
            aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تیره'}
            onPress={() => setTheme(isDark ? 'light' : 'dark')}
          />
          <MenuTrigger>
            <AccountPill label={maskedPhone} ltr aria-label={`حساب کاربری ${maskedPhone}`} />
            <Menu placement="bottom end">
              <MenuItem id="activations">فعال‌سازی‌های من</MenuItem>
              <MenuItem id="signout">خروج</MenuItem>
            </Menu>
          </MenuTrigger>
        </>
      }
    />
  );
}

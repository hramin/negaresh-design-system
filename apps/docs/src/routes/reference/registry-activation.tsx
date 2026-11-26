/**
 * The approved reference page (reference/registry-activation) rebuilt 100% from NDS components
 * across all four states (form, error, success, limit) — P4 Done-when #1.
 * `e2e/reference.spec.ts` verifies pixel parity for header, desktop actions, and mobile bar.
 */
import {
  iconApp,
  iconHelp,
  iconLink,
  iconLock,
  iconMoon,
  iconPhone,
  iconSuccess,
  iconSun,
} from '@negaresh/icons';
import {
  Badge,
  Button,
  ButtonGroup,
  ChoiceCard,
  CodeField,
  Container,
  CopyButton,
  Disclosure,
  Form,
  FormErrorSummary,
  Grid,
  Heading,
  Icon,
  IconButton,
  Inline,
  InlineAlert,
  KeyValueItem,
  KeyValueList,
  Link,
  LinkButton,
  LogoSlot,
  Ltr,
  RadioGroup,
  Section,
  SerialField,
  SkipLink,
  Stack,
  Stepper,
  Surface,
  Text,
  ToastProvider,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavLink,
  UsageMeter,
  UserMenu,
  useTheme,
  useToast,
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
  return (
    <ToastProvider placement="bottom-center">
      <RegistryActivationContent />
    </ToastProvider>
  );
}

function RegistryActivationContent() {
  const { state: searchState = 'form', s, code } = Route.useSearch();
  const toast = useToast();
  const [activeState, setActiveState] = useState<State>(searchState);
  const [serial, setSerial] = useState(() => normalizeSerial(s ?? DEFAULT_SERIAL));
  const [sysCode, setSysCode] = useState(() => normalizeSerial(code ?? DEFAULT_SYSCODE));
  const [serialError, setSerialError] = useState<string | undefined>(() =>
    searchState === 'error' ? WRONG_PRODUCT_ERROR : undefined,
  );
  const [gateway, setGateway] = useState<Gateway>('behpardakht');
  const [smsNotice, setSmsNotice] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

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
    const message = `انتقال به ${selected} برای مبلغ ${formatPrice(EXTRA_ACTIVATION_PRICE)} آماده شد.`;
    setPaymentNotice(message);
    toast.add({ title: message, tone: 'info' });
  };

  const handleCodeCopied = () => {
    toast.add({ title: 'کد کپی شد', tone: 'neutral', icon: iconSuccess }, { timeout: 2200 });
  };

  const handleResendSms = () => {
    const message = 'کد فعال‌سازی دوباره با پیامک ارسال شد.';
    setSmsNotice(message);
    toast.add({ title: message, tone: 'success' });
  };

  const activationSteps = [
    {
      id: 'open',
      title: 'باز کردن از برنامه.',
      description: 'دکمهٔ «فعال‌سازی آنلاین» برنامه همین صفحه را باز می‌کند.',
      inlineDescription: true,
    },
    {
      id: 'serial',
      title: 'وارد کردن سریال.',
      description: 'سریال روی جعبه یا در پیامک خرید است.',
      inlineDescription: true,
    },
    {
      id: 'code',
      title: 'وارد کردن کد در برنامه.',
      description: 'کد را کپی و در پنجرهٔ فعال‌سازی برنامه وارد کنید.',
      inlineDescription: true,
    },
  ] as const;

  return (
    <div className={styles.frame} data-reference-rebuild data-registry-state={activeState}>
      <SkipLink />
      <RegistryHeader />
      <main id="main" className={styles.mainLandmark}>
        <Container className={styles.page}>
          <div className={styles.main}>
            <Stack gap="2" className={styles.pageHead}>
              <p className={styles.eyebrow}>
                <Badge tone="accent" size="sm" icon={iconLink}>
                  باز شده از برنامه
                </Badge>
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

                      <Grid gap="5" className={styles.fieldsTwo}>
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
                      </Grid>
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
                    <InlineAlert
                      id="rb-title"
                      tone="success"
                      headingLevel={2}
                      title="کد فعال‌سازی ساخته شد"
                    >
                      همین کد را در پنجرهٔ فعال‌سازی برنامه وارد کنید. یک نسخه با پیامک و ایمیل هم
                      فرستاده شد.
                    </InlineAlert>

                    <Stack gap="3" align="center" className={styles.codebox}>
                      <Text size="xs" weight="medium" tone="subtle" id="rb-code-label">
                        کد فعال‌سازی
                      </Text>
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
                          onCopy={handleCodeCopied}
                        >
                          کپی کد
                        </CopyButton>
                      </div>
                    </Stack>
                  </Stack>
                </Section>

                <Section>
                  <Stack gap="4">
                    <KeyValueList
                      divided={false}
                      density="compact"
                      aria-label="جزئیات کد فعال‌سازی"
                    >
                      <KeyValueItem label="محصول" value="نگارش تست هوش ۴" />
                      <KeyValueItem label="سریال" value={formattedSerial} code />
                      <KeyValueItem label="کد سیستم" value={sysCode} code />
                      <KeyValueItem label="زمان" value={jalaliTime} />
                    </KeyValueList>
                    {smsNotice && <InlineAlert tone="success">{smsNotice}</InlineAlert>}
                  </Stack>
                </Section>

                <Section tone="sunken" className={styles.actionsSection} data-actions="success">
                  <ButtonGroup>
                    <LinkButton href="#" size="sm">
                      فعال‌سازی‌های من
                    </LinkButton>
                    <Button variant="ghost" size="sm" onPress={handleResendSms}>
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
                    <InlineAlert
                      id="rb-title"
                      tone="warning"
                      headingLevel={2}
                      title="سقف فعال‌سازی این سریال پر شده است"
                    >
                      این سریال پیش‌تر روی رایانهٔ دیگری فعال شده است. اگر همان رایانه را دوباره نصب
                      کرده‌اید، از همان‌جا اقدام کنید؛ رایگان است.
                    </InlineAlert>

                    <UsageMeter
                      label="رایانه‌های فعال‌شده"
                      used={1}
                      limit={1}
                      sourceNote="سقف پیش‌فرض محصول"
                    />
                  </Stack>
                </Section>

                <Section>
                  <Stack gap="5">
                    <Inline justify="between" align="start" gap="4">
                      <Stack gap="1">
                        <Heading level={3} size="md">
                          یک فعال‌سازی دیگر بخرید
                        </Heading>
                        <Text as="p" size="sm" tone="muted">
                          بعد از پرداخت، کد برای همین رایانه ساخته می‌شود.
                        </Text>
                      </Stack>
                      <Text size="2xl" weight="heavy" tabular className={styles.price}>
                        {formatPrice(EXTRA_ACTIVATION_PRICE)}
                      </Text>
                    </Inline>

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
                      <Grid gap="3" className={styles.gatewayGrid}>
                        {GATEWAYS.map((item) => (
                          <ChoiceCard key={item.id} value={item.id} title={item.label} />
                        ))}
                      </Grid>
                    </RadioGroup>

                    {paymentNotice && <InlineAlert tone="info">{paymentNotice}</InlineAlert>}
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
                <Inline gap="4" align="center" wrap={false}>
                  <span className={styles.productThumb} aria-hidden="true">
                    <Icon icon={iconApp} size="md" />
                  </span>
                  <Stack gap="1">
                    <Text weight="bold">نگارش تست هوش ۴</Text>
                    <Text size="xs" tone="subtle">
                      ویندوز · نسخهٔ دانلودی
                    </Text>
                  </Stack>
                </Inline>
              </Section>

              {activeState !== 'limit' && (
                <Section className={styles.deskOnly}>
                  <UsageMeter
                    label="سقف این سریال"
                    used={activeState === 'success' ? 1 : 0}
                    limit={1}
                    isFull={false}
                    sourceNote="نصب دوباره روی همین رایانه رایگان است و سقف را مصرف نمی‌کند."
                  />
                </Section>
              )}
            </Surface>

            <section className={styles.asideHelp} aria-label="راهنمای فعال‌سازی">
              <Disclosure
                variant="plain"
                icon={iconHelp}
                title="راهنمای فعال‌سازی"
                alwaysExpandedAbove="md"
              >
                <Surface>
                  <Section>
                    <Stack gap="5">
                      <Heading level={2} size="md" className={styles.deskOnly}>
                        سه گام تا فعال‌سازی
                      </Heading>
                      <Stepper
                        orientation="vertical"
                        currentStep={activeState === 'success' ? 3 : 2}
                        steps={activationSteps}
                      />
                    </Stack>
                  </Section>
                  <Section>
                    <Inline as="p" gap="2" align="start" wrap={false}>
                      <span className={styles.supportIcon} aria-hidden="true">
                        <Icon icon={iconPhone} size="sm" />
                      </span>
                      <Text size="xs" tone="subtle" leading="text">
                        پشتیبانی{' '}
                        <Link href="tel:+982191012345">
                          <Ltr>۰۲۱ ۹۱۰۱ ۲۳۴۵</Ltr>
                        </Link>
                        <br />
                        شنبه تا چهارشنبه، ۹ تا ۱۷
                      </Text>
                    </Inline>
                  </Section>
                </Surface>
              </Disclosure>
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
            onCopy={handleCodeCopied}
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
          <UserMenu
            label={maskedPhone}
            ltr
            aria-label={`حساب کاربری ${maskedPhone}`}
            showThemeToggle
            items={[{ id: 'activations', label: 'فعال‌سازی‌های من', href: '#activations' }]}
            onSignOut={() => {}}
            signOutLabel="خروج"
          />
        </>
      }
    />
  );
}

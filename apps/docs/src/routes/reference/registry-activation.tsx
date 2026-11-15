/**
 * The approved reference page (reference/registry-activation) rebuilt from NDS components:
 * header and actions only (P2). Fields, alerts, meter and choice cards arrive in P3–P4.
 * `e2e/reference.spec.ts` compares these regions with the static page pixel by pixel.
 */
import { iconLock, iconMoon, iconSun, iconUser } from '@negaresh/icons';
import {
  Button,
  ButtonGroup,
  Container,
  CopyButton,
  Heading,
  Icon,
  IconButton,
  LinkButton,
  LogoSlot,
  Ltr,
  Menu,
  MenuItem,
  MenuTrigger,
  Section,
  SkipLink,
  Stack,
  Surface,
  Text,
  useTheme,
} from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import styles from './registry-activation.module.css';

type State = 'form' | 'success' | 'limit';

export const Route = createFileRoute('/reference/registry-activation')({
  validateSearch: (search: Record<string, unknown>): { state?: State } =>
    search.state === 'success' || search.state === 'limit' || search.state === 'form'
      ? { state: search.state }
      : {},
  head: () => ({ meta: [{ title: 'فعال‌سازی نرم‌افزار — بازسازی مرجع' }] }),
  component: RegistryActivation,
});

const COPY: Record<State, [string, string]> = {
  form: [
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

function RegistryActivation() {
  const { state = 'form' } = Route.useSearch();
  const [title, lede] = COPY[state];
  return (
    <div className={styles.frame} data-reference-rebuild>
      <SkipLink />
      <RegistryHeader />
      <main id="main" className={styles.mainLandmark}>
        <Container className={styles.page}>
          <div className={styles.main}>
            <Stack gap="2" className={styles.pageHead}>
              <Heading level={1}>{title}</Heading>
              <Text as="p" tone="muted" leading="text" className={styles.lede}>
                {lede}
              </Text>
            </Stack>
            <Surface aria-labelledby="rb-title">
              <Section>
                <Stack gap="1">
                  <Heading level={2} size="lg" id="rb-title">
                    {state === 'success'
                      ? 'کد فعال‌سازی ساخته شد'
                      : state === 'limit'
                        ? 'یک فعال‌سازی دیگر بخرید'
                        : 'سریال را وارد کنید'}
                  </Heading>
                  <Text as="p" size="sm" tone="muted">
                    فیلدها، هشدارها و کارت‌های انتخاب در P3 و P4 ساخته می‌شوند.
                  </Text>
                </Stack>
                {state === 'success' && (
                  <div className={styles.codebox}>
                    <CopyButton value="441790826153" variant="primary" aria-label="کپی کد فعال‌سازی">
                      کپی کد
                    </CopyButton>
                  </div>
                )}
              </Section>
              <Section tone="sunken" className={styles.actionsSection} data-actions={state}>
                {state === 'form' && (
                  <ButtonGroup>
                    <Button variant="primary" type="submit">
                      ساخت کد فعال‌سازی
                    </Button>
                    <Text size="xs" tone="subtle">
                      کد روی صفحه نمایش داده می‌شود و با پیامک و ایمیل هم می‌آید.
                    </Text>
                  </ButtonGroup>
                )}
                {state === 'success' && (
                  <ButtonGroup>
                    <LinkButton href="#" size="sm">
                      فعال‌سازی‌های من
                    </LinkButton>
                    <Button variant="ghost" size="sm">
                      ارسال دوبارهٔ پیامک
                    </Button>
                  </ButtonGroup>
                )}
                {state === 'limit' && (
                  <ButtonGroup>
                    <Button variant="primary" iconStart={iconLock}>
                      پرداخت و ساخت کد
                    </Button>
                    <LinkButton href="#" variant="ghost">
                      تماس با پشتیبانی
                    </LinkButton>
                  </ButtonGroup>
                )}
              </Section>
            </Surface>
          </div>
          <aside className={styles.aside} aria-label="راهنما" />
        </Container>
      </main>
      <section className={styles.mobileBar} aria-label="اقدام اصلی" data-region="mobile-bar">
        {state === 'success' ? (
          <CopyButton value="441790826153" variant="primary" fullWidth aria-label="کپی کد فعال‌سازی">
            کپی کد
          </CopyButton>
        ) : (
          <Button
            variant="primary"
            fullWidth
            {...(state === 'limit' ? { iconStart: iconLock } : {})}
          >
            {state === 'limit' ? 'پرداخت ۹۵٬۰۰۰ تومان' : 'ساخت کد فعال‌سازی'}
          </Button>
        )}
      </section>
    </div>
  );
}

function RegistryHeader() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <header className={styles.topbar} data-region="header">
      <Container className={styles.topbarIn}>
        <a
          className={styles.brand}
          href="/reference/registry-activation"
          aria-label="رجیستری نگارش برتر، صفحهٔ اصلی"
        >
          <LogoSlot name="نگارش برتر" product="رجیستری" />
        </a>
        <nav className={styles.nav} aria-label="بخش‌های رجیستری">
          {NAV.map(([label, href], i) => (
            <a
              key={label}
              href={href}
              className={styles.navLink}
              {...(i === 0 ? { 'aria-current': 'page' as const } : {})}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className={styles.end}>
          <IconButton
            icon={isDark ? iconSun : iconMoon}
            aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تیره'}
            onPress={() => setTheme(isDark ? 'light' : 'dark')}
          />
          <MenuTrigger>
            <Button className={styles.user} aria-label={`حساب کاربری ${maskPhone('09121234567')}`}>
              <Ltr className={styles.userLabel}>{maskPhone('09121234567')}</Ltr>
              <span className={styles.avatar}>
                <Icon icon={iconUser} size="sm" />
              </span>
            </Button>
            <Menu placement="bottom end">
              <MenuItem id="activations">فعال‌سازی‌های من</MenuItem>
              <MenuItem id="signout">خروج</MenuItem>
            </Menu>
          </MenuTrigger>
        </div>
      </Container>
    </header>
  );
}

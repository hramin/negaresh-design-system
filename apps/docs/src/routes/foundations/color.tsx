import { iconCheck, iconClose } from '@negaresh/icons';
import { Badge } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { colorRamps, contrastResults, cssTokens, type Mode } from '../../lib/tokens.ts';
import color from './color.module.css';

export const Route = createFileRoute('/foundations/color')({
  head: () => ({ meta: [{ title: 'رنگ · دیزاین سیستم نگرش' }] }),
  component: ColorPage,
});

const FAMILY_NAMES: Record<string, string> = {
  sand: 'شنی (خنثای گرم، حالت روشن)',
  ink: 'جوهری (حالت تیره)',
  teal: 'سبزآبی (رنگ تأکید)',
  mauve: 'ارغوانی',
  ochre: 'اُخرایی',
  sage: 'مریم‌گلی',
  clay: 'سفالی',
  slate: 'سنگی',
  rose: 'گلی',
};

const ROLE_GROUPS: { id: string; title: string; match: RegExp }[] = [
  { id: 'bg', title: 'پس‌زمینه', match: /^color\.bg\./ },
  { id: 'fg', title: 'متن', match: /^color\.fg\./ },
  { id: 'border', title: 'مرز', match: /^color\.border\./ },
  { id: 'accent', title: 'تأکید و فوکوس', match: /^color\.(accent|focus)\./ },
  { id: 'status', title: 'وضعیت', match: /^color\.(success|warning|danger|info)\./ },
  { id: 'viz', title: 'نمودار', match: /^color\.viz\./ },
];

const MODES: { mode: Mode; label: string }[] = [
  { mode: 'light', label: 'روشن' },
  { mode: 'dark', label: 'تیره' },
];

const USE_NAMES: Record<string, string> = {
  text: 'متن',
  link: 'پیوند',
  'text on selected': 'متن روی انتخاب‌شده',
  'button label': 'برچسب دکمه',
  ui: 'رابط',
  'control border': 'مرز کنترل',
  focus: 'فوکوس',
  status: 'وضعیت',
  'error text': 'متن خطا',
  chart: 'نمودار',
};

function ColorPage() {
  const ramps = colorRamps();
  const semantic = cssTokens.filter((t) => t.tier === 'semantic' && t.type === 'color');
  const passed = contrastResults.filter((r) => r.pass).length;
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>رنگ</h1>
        <p className={styles.lead}>
          آرامش، گرما و اعتبار: خنثای گرم «شنی» برای حالت روشن، «جوهری» آبی‌سبز و کم‌درخشش برای حالت
          تیره، و یک رنگ تأکید سبزآبی تیره. رنگ هرگز به‌تنهایی معنا را منتقل نمی‌کند.
        </p>
        <nav aria-label="بخش‌های صفحه">
          <ul className={styles.toc}>
            <li>
              <a href="#roles">نقش‌های معنایی</a>
            </li>
            <li>
              <a href="#ramps">طیف‌های پایه</a>
            </li>
            <li>
              <a href="#contrast">کنتراست</a>
            </li>
          </ul>
        </nav>
      </header>

      <section className={styles.section} aria-labelledby="roles">
        <h2 id="roles" className={styles.h2}>
          نقش‌های معنایی
        </h2>
        <p className={styles.text}>
          کامپوننت‌ها فقط این نقش‌ها را مصرف می‌کنند. هر نقش در هر دو حالت مقدار دارد؛ نمونه‌ها زنده‌اند
          و از همان متغیرهای CSS خوانده می‌شوند.
        </p>
        {ROLE_GROUPS.map((g) => {
          const list = semantic.filter((t) => g.match.test(t.path));
          return (
            <div key={g.id} className={styles.section}>
              <h3 className={styles.h3}>{g.title}</h3>
              <TableWrap label={`جدول ${g.title}`} desktopOnly>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">نقش</th>
                      {MODES.map((m) => (
                        <th key={m.mode} scope="col">
                          {m.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((t) => (
                      <tr key={t.path}>
                        <th scope="row">
                          <code className={styles.code}>{t.cssVar}</code>
                        </th>
                        {MODES.map((m) => (
                          <td key={m.mode}>
                            <span className={color.swatchCell}>
                              <span data-theme={m.mode} className={color.modeFrame}>
                                <span
                                  className={styles.swatch}
                                  style={{ background: `var(${t.cssVar})` }}
                                />
                              </span>
                              <span className={color.swatchMeta}>
                                <code className={styles.code}>{t.value[m.mode]}</code>
                                {t.alias?.[m.mode] && (
                                  <code className={`${styles.code} ${styles.muted}`}>
                                    {t.alias[m.mode]}
                                  </code>
                                )}
                              </span>
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
              <ul className={`${styles.cards} ${styles.mobileOnly}`}>
                {list.map((t) => (
                  <li key={t.path} className={styles.card}>
                    <code className={styles.code}>{t.cssVar}</code>
                    <div className={styles.modes}>
                      {MODES.map((m) => (
                        <div key={m.mode} className={color.swatchCell}>
                          <span data-theme={m.mode} className={color.modeFrame}>
                            <span
                              className={styles.swatch}
                              style={{ background: `var(${t.cssVar})` }}
                            />
                          </span>
                          <span className={color.swatchMeta}>
                            <span className={styles.label}>{m.label}</span>
                            <code className={styles.code}>{t.value[m.mode]}</code>
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className={styles.section} aria-labelledby="ramps">
        <h2 id="ramps" className={styles.h2}>
          طیف‌های پایه
        </h2>
        <p className={styles.text}>
          مقدارهای خام فقط در توکن‌ها زندگی می‌کنند. کامپوننت‌ها هرگز مستقیم از این طیف‌ها استفاده
          نمی‌کنند.
        </p>
        {ramps.map((r) => (
          <figure key={r.family} className={color.ramp}>
            <figcaption className={color.rampTitle}>
              {FAMILY_NAMES[r.family] ?? r.family} <code className={styles.code}>{r.family}</code>
            </figcaption>
            <ol className={color.rampList}>
              {r.steps.map((s) => (
                <li key={s.step} className={color.rampStep}>
                  <span className={color.rampChip} style={{ background: s.hex }} />
                  <code className={styles.code}>{s.step}</code>
                  <code className={`${styles.code} ${styles.muted}`}>{s.hex}</code>
                </li>
              ))}
            </ol>
          </figure>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="contrast">
        <h2 id="contrast" className={styles.h2}>
          کنتراست
        </h2>
        <p className={styles.text}>
          WCAG 2.2: متن ۴٫۵ به ۱، اجزای رابط و نمودار ۳ به ۱. این جدول در هر ساخت با{' '}
          <code className={styles.code}>pnpm tokens:check</code> دوباره محاسبه می‌شود و اگر یک جفت رد
          شود، CI متوقف می‌شود. اکنون {formatNumber(passed)} از{' '}
          {formatNumber(contrastResults.length)} جفت قبول است.
        </p>
        <TableWrap label="جدول کنتراست" desktopOnly>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">حالت</th>
                <th scope="col">پیش‌زمینه</th>
                <th scope="col">پس‌زمینه</th>
                <th scope="col">کاربرد</th>
                <th scope="col">نسبت</th>
                <th scope="col">حداقل</th>
                <th scope="col">نتیجه</th>
              </tr>
            </thead>
            <tbody>
              {contrastResults.map((r) => (
                <tr key={`${r.mode}-${r.fg}-${r.bg}`}>
                  <td>{r.mode === 'light' ? 'روشن' : 'تیره'}</td>
                  <th scope="row">
                    <code className={styles.code}>{r.fg}</code>
                  </th>
                  <td>
                    <code className={styles.code}>{r.bg}</code>
                  </td>
                  <td>{USE_NAMES[r.use] ?? r.use}</td>
                  <td>{formatNumber(r.ratio, { maximumFractionDigits: 2 })}</td>
                  <td>{formatNumber(r.min, { maximumFractionDigits: 1 })}</td>
                  <td>
                    <Badge
                      tone={r.pass ? 'success' : 'danger'}
                      icon={r.pass ? iconCheck : iconClose}
                      size="sm"
                    >
                      {r.pass ? 'قبول' : 'رد'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <ul className={`${styles.cards} ${styles.mobileOnly}`}>
          {contrastResults.map((r) => (
            <li key={`${r.mode}-${r.fg}-${r.bg}`} className={styles.card}>
              <div className={styles.cardRow}>
                <span>
                  <code className={styles.code}>{r.fg}</code>
                  <span className={styles.label}> روی </span>
                  <code className={styles.code}>{r.bg}</code>
                </span>
                <Badge
                  tone={r.pass ? 'success' : 'danger'}
                  icon={r.pass ? iconCheck : iconClose}
                  size="sm"
                >
                  {r.pass ? 'قبول' : 'رد'}
                </Badge>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>
                  {r.mode === 'light' ? 'روشن' : 'تیره'} · {USE_NAMES[r.use] ?? r.use}
                </span>
                <span>
                  {formatNumber(r.ratio, { maximumFractionDigits: 2 })} (حداقل{' '}
                  {formatNumber(r.min, { maximumFractionDigits: 1 })})
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

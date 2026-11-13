import { createFileRoute, Link } from '@tanstack/react-router';
import { TableWrap } from '../components/TableWrap.tsx';
import styles from '../components/Page.module.css';

export const Route = createFileRoute('/')({
  component: Overview,
});

const PRODUCTS = [
  { name: 'رجیستری', note: 'بازنویسی؛ اولین محصول روی NDS' },
  { name: 'سایت اصلی نگرش', note: 'فروشگاه، بلاگ، دوره‌ها، متخصصان، حساب کاربری، مدیریت' },
  { name: 'پلتفرم آزمون‌های روان‌شناختی', note: 'انتقال به پشته‌ی جدید، سپس NDS' },
  { name: 'روانما', note: 'بعداً، با تم و هنر خودش' },
];

function Overview() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>دیزاین سیستم نگرش</h1>
        <p className={styles.lead}>
          یک مجموعه‌ی توکن، کامپوننت، الگو و قاعده برای همه‌ی محصولات نگرش: فارسی و راست‌به‌چپ از پایه،
          حالت روشن و تیره از نسخه‌ی اول، و دسترس‌پذیری در سطح WCAG 2.2 AA.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="start">
        <h2 id="start" className={styles.h2}>
          از کجا شروع کنیم
        </h2>
        <ul className={styles.toc}>
          <li>
            <Link to="/foundations/color">رنگ</Link>
          </li>
          <li>
            <Link to="/tokens">همه‌ی توکن‌ها</Link>
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="products">
        <h2 id="products" className={styles.h2}>
          محصولات
        </h2>
        <TableWrap label="جدول محصولات">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">محصول</th>
                <th scope="col">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.name}>
                  <th scope="row">{p.name}</th>
                  <td className={styles.muted}>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </section>
    </article>
  );
}

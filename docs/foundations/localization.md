# Localization: RTL, digits, dates, money, phones, codes

All formatting goes through `@negaresh/utils`. Components never format by hand.

## Direction

- `<html lang="fa" dir="rtl">`. Components use logical properties only.
- LTR islands: serials, system codes, activation codes, order numbers, tracking codes, phones in inputs, emails, URLs, Latin product names. Use `<Ltr>` or the `Code` component (monospace, Latin digits, `unicode-bidi: isolate`).
- Mixed lists (Persian label + LTR value) keep the label on the start side, the value aligned to the end.

## Digits (D-86)

| Content | Digits |
| --- | --- |
| Running text, dates, prices, counts, page numbers, scores | Persian (`۰۱۲۳۴۵۶۷۸۹`) |
| Codes the user types elsewhere (serial, system code, activation code), order and tracking numbers in code fields, phone inputs | Latin |
| Inputs | Accept Persian, Arabic-Indic and Latin digits; normalise on the fly |

## Dates and time

- Display: Jalali via `Intl.DateTimeFormat('fa-IR-u-ca-persian', { timeZone: 'Asia/Tehran' })` — e.g. «۲۲ آبان ۱۴۰۵، ساعت ۱۷:۰۴».
- Relative time for recent events («۵ دقیقه پیش») up to 24 h, then the date.
- Date input: RAC `DatePicker` with `PersianCalendar` from `@internationalized/date`; week starts Saturday; Friday marked as weekend.
- Store and transmit ISO-8601 UTC; convert only at the edge.

## Money

- Toman only (D-26). Format: Persian digits, Persian thousands separator «٬», unit «تومان» after the number, never «T» or «IRT».
- Free: «رایگان» (badge), not «۰ تومان».
- Sale: old price struck through with `<del>` and an accessible label («قیمت قبل»), new price emphasised, sale end date if any.
- Large numbers in tight spaces may use «۱٫۲ میلیون تومان» — only in cards, never in checkout or invoices.

## Phones

- Input: `PhoneField` accepts `09…`, `9…`, `+98…`, `0098…`, `98…`, spaces, Persian/Arabic digits → stores `+989xxxxxxxxx`.
- Display: masked where full number isn't needed: «۰۹۱۲ ••• ۴۵۶۷».

## Serials and codes

- `SerialField`: uppercase on display, ignore dashes and spaces when validating, show the 5-5 pattern as a hint; never auto-correct look-alike characters silently.
- Copy actions copy the normalised value without spaces.

## Plurals and gender

Persian nouns after numbers stay singular («۳ فعال‌سازی»). Address the user with the polite plural («وارد کنید»). Avoid gendered wording.

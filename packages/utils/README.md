# @negaresh/utils

Pure TypeScript, no React: Jalali formatting/parsing (Asia/Tehran), Persian/Latin digit conversion, Toman formatting, phone normalisation (+989…) and masking, serial normalisation, relative time. Used by components and product apps.

Status: built in P1 (100 % test coverage).

```ts
import { formatDateTime, formatToman, normalizePhone, maskPhone, normalizeSerial } from '@negaresh/utils';
formatDateTime('2026-11-13T13:34:00Z'); // «۲۲ آبان ۱۴۰۵، ساعت ۱۷:۰۴»
formatToman(120000);                    // «۱۲۰٬۰۰۰ تومان»
normalizePhone('۰۹۱۲ ۱۲۳ ۴۵۶۷');        // '+989121234567'
```

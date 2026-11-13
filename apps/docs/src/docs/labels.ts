import type { Product, Status } from './types.ts';

export const PRODUCT_NAMES: Record<Product, string> = {
  R: 'رجیستری',
  N: 'سایت نگارش',
  T: 'پلتفرم آزمون',
  V: 'روانما',
};

export const STATUS_NAMES: Record<Status, string> = {
  planned: 'برنامه‌ریزی‌شده',
  building: 'در حال ساخت',
  review: 'آمادهٔ بازبینی',
  approved: 'تأییدشده',
};

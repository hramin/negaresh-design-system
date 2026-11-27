import {
  Cart,
  Checkout,
  GatewayPicker,
  Invoice,
  OrderDetail,
  OrderSummary,
  PaymentResult,
  Price,
  ProductCard,
  ProductPage,
  Wishlist,
} from '@negaresh/patterns';
import {
  sampleCartItems,
  sampleGateways,
  sampleInvoiceBuyer,
  sampleInvoiceSeller,
  sampleOrderItems,
  sampleOrderTimeline,
  sampleProductEditions,
  sampleProductFaqs,
  sampleProductGallery,
  sampleProductRequirements,
  sampleProducts,
  sampleShippingMethods,
} from '@negaresh/patterns/fixtures';
import { Inline, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { State } from '../ui.tsx';
import pStyles from './patterns.module.css';

function CommerceCatalogExample() {
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({
    'prod-negaresh-suite': true,
  });
  const [cartNote, setCartNote] = useState<string | null>(null);

  return (
    <div className={pStyles.stack}>
      <div className={pStyles.gridTwo}>
        {sampleProducts.map((item) => (
          <ProductCard
            key={item.id}
            product={{ ...item, isWishlisted: Boolean(wishlisted[item.id]) }}
            onToggleWishlist={(id, selected) =>
              setWishlisted((prev) => ({ ...prev, [id]: selected }))
            }
            onAddToCart={(id) => setCartNote(`محصول ${id} به سبد خرید اضافه شد.`)}
          />
        ))}
      </div>
      {cartNote && (
        <Text size="sm" tone="muted">
          {cartNote}
        </Text>
      )}
    </div>
  );
}

export const commerceCatalogDoc: ComponentDoc = {
  slug: 'commerce-catalog',
  title: 'فروشگاه · کاتالوگ، صفحهٔ محصول و علاقه‌مندی‌ها',
  components: ['Price', 'ProductCard', 'ProductPage', 'Wishlist'],
  summary:
    'نمایش قیمت تنها به تومان (D-26)، کارت محصول با دکمهٔ علاقه‌مندی، صفحهٔ کامل محصول با گالری و انتخاب ویرایش، و فهرست علاقه‌مندی‌ها.',
  status: 'approved',
  products: ['N', 'R', 'T'],
  Example: CommerceCatalogExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="انواع قیمت (عادی، تخفیف‌دار، رایگان، تعرفهٔ سازمانی)">
        <Inline gap="5">
          <Price amount={4_850_000} />
          <Price amount={4_850_000} originalAmount={5_900_000} />
          <Price amount={0} />
          <Price amount={180_000} isOrgRate unit="هر صندلی" />
        </Inline>
      </State>
      <State label="صفحهٔ محصول با گالری، انتخاب ویرایش، نیازمندی‌ها و پرسش‌های متداول">
        <ProductPage
          title="مجموعه نرم‌افزار روان‌سنجی نگرش ۴"
          summary="اجرا، نمره‌گذاری دقیق و تولید گزارش چاپی بیش از ۴۵ آزمون استاندارد بالینی و شغلی."
          category="نرم‌افزار تخصصی"
          gallery={sampleProductGallery}
          editions={sampleProductEditions}
          systemRequirements={sampleProductRequirements}
          faqs={sampleProductFaqs}
          relatedProducts={sampleProducts.slice(1)}
          onAddToCart={() => {}}
          onToggleWishlist={() => {}}
        />
      </State>
      <State label="فهرست علاقه‌مندی‌ها (دارای محصول و حالت خالی)">
        <Stack gap="4">
          <Wishlist
            items={sampleProducts.slice(0, 2)}
            aria-label="فهرست علاقه‌مندی‌ها (دارای محصول)"
            onMoveToCart={() => {}}
            onRemove={() => {}}
          />
          <Wishlist items={[]} aria-label="فهرست علاقه‌مندی‌ها (خالی)" />
        </Stack>
      </State>
    </div>
  ),
  usage: {
    do: [
      'همهٔ قیمت‌ها را به‌صورت عدد صحیح به تومان ارسال کنید تا `formatPrice` قالب‌بندی یکپارچه انجام دهد (D-26).',
      'برای محصولات دارای چند ویرایش، انتخابگر `ChoiceCard` در `ProductPage` را به‌کار ببرید.',
    ],
    dont: [
      'در لایهٔ UI هرگز تبدیل ریال/تومان انجام ندهید.',
      'امتیاز ستاره‌ای یا دیدگاه فروشگاه اضافه نکنید (در D-01/Q-05 از دامنه خارج است).',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'جابه‌جایی میان بندانگشتی‌های گالری، کارت‌های ویرایش و دکمهٔ علاقه‌مندی' },
    { keys: 'Space / Enter', action: 'انتخاب تصویر گالری، ویرایش یا افزودن به سبد خرید' },
    { keys: 'ArrowUp / ArrowDown', action: 'تغییر ویرایش داخل گروه رادیویی `ChoiceCard`' },
  ],
  a11y: [
    'دکمهٔ علاقه‌مندی و بندانگشتی‌های گالری دارای حداقل هدف لمسی ۴۴×۴۴ پیکسل و `aria-pressed` هستند.',
    'تصاویر محصول بدون `alt` پذیرفته نمی‌شوند و گالری در بخش معنایی `<section>` قرار دارد.',
  ],
  rtl: [
    'ارقام قیمت و درصد تخفیف به فارسی با `tabular-nums` و واحد «تومان» نمایش داده می‌شوند.',
    'شبکهٔ دو ستونهٔ صفحهٔ محصول زیر ۹۰۰ پیکسل به چیدمان تک‌ستونهٔ موبایل تبدیل می‌شود.',
  ],
};

function CommerceCheckoutExample() {
  const [items, setItems] = useState([...sampleCartItems]);
  const [coupon, setCoupon] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState(0);

  return (
    <Cart
      items={items}
      discount={discount}
      couponCode={coupon}
      onQuantityChange={(id, qty) =>
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it)))
      }
      onRemoveItem={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
      onApplyCoupon={(code) => {
        setCoupon(code);
        setDiscount(450_000);
      }}
      onRemoveCoupon={() => {
        setCoupon(undefined);
        setDiscount(0);
      }}
      onProceedToCheckout={() => {}}
    />
  );
}

export const commerceCheckoutDoc: ComponentDoc = {
  slug: 'commerce-checkout',
  title: 'فروشگاه · سبد خرید، تسویهٔ حساب و نتیجهٔ پرداخت',
  components: ['Cart', 'OrderSummary', 'Checkout', 'GatewayPicker', 'PaymentResult'],
  summary:
    'سبد خرید با کنترل تعداد و کد تخفیف، تسویهٔ چندمرحله‌ای با حذف خودکار نشانی برای کالاهای دیجیتال، انتخابگر درگاه و نتیجهٔ پرداخت.',
  status: 'approved',
  products: ['N', 'R', 'T'],
  Example: CommerceCheckoutExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="سبد خرید خالی">
        <Cart items={[]} aria-label="سبد خرید خالی (گالری)" />
      </State>
      <State label="فرایند تسویهٔ حساب (سفارش فیزیکی با گام‌های کامل)">
        <Checkout
          items={sampleCartItems}
          gateways={sampleGateways}
          shippingMethods={sampleShippingMethods}
          requiresSignIn
          defaultStep={4}
          onPay={() => {}}
        />
      </State>
      <State label="انتخابگر درگاه پرداخت (به ترتیب تنظیمات مدیر)">
        <GatewayPicker gateways={sampleGateways} defaultValue="behpardakht" />
      </State>
      <State label="نتیجهٔ پرداخت: موفق، لغوشده و ناموفق">
        <Stack gap="4">
          <PaymentResult
            status="success"
            description="سریال نرم‌افزار به حساب کاربری شما اضافه و پیامک شد."
            orderNumber="NG-1405-4092"
            trackingCode="BP-884920145"
            amount={6_800_000}
            orderHref="#order-4092"
          />
          <PaymentResult
            status="cancelled"
            description="تراکنش پیش از تکمیل لغو شد؛ اقلام سبد خرید شما همچنان محفوظ است."
            onRetry={() => {}}
            onReturnToCart={() => {}}
          />
          <PaymentResult
            status="failed"
            description="درگاه بانکی پاسخ نداد. در صورت کسر وجه، مبلغ حداکثر طی ۷۲ ساعت بازگردانده می‌شود."
            onRetry={() => {}}
            onReturnToCart={() => {}}
          />
        </Stack>
      </State>
      <State label="خلاصهٔ سفارش مستقل با تخفیف">
        <OrderSummary subtotal={7_250_000} discount={450_000} shipping={0} couponCode="NEGARESH1405" />
      </State>
    </div>
  ),
  usage: {
    do: [
      'برای سفارش‌های صرفاً دیجیتال (سریال یا آزمون)، `isDigitalOnly={true}` را تنظیم کنید تا گام‌های نشانی و ارسال حذف شوند.',
      'کد پیگیری بانکی و شمارهٔ سفارش را همیشه با `Code` چپ‌به‌راست و دکمهٔ کپی نمایش دهید.',
    ],
    dont: [
      'در `PaymentResult` وضعیت را تنها با رنگ نشان ندهید؛ آیکون، برچسب و عنوان متنی اجباری‌اند.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Enter', action: 'تغییر تعداد، اعمال کد تخفیف و حرکت بین گام‌های تسویه' },
    { keys: 'ArrowUp / ArrowDown', action: 'انتخاب روش ارسال یا درگاه پرداخت' },
  ],
  a11y: [
    'دکمه‌های افزایش/کاهش تعداد و حذف هر ردیف نام دسترس‌پذیر اختصاصی با عنوان کالا دارند و حداقل ۴۴×۴۴ پیکسل هستند.',
    'مراحل تکمیل خرید روی `Stepper` با `aria-current="step"` نمایش داده می‌شوند.',
  ],
  rtl: [
    'مبالغ به تومان با ارقام فارسی و شمارهٔ سفارش/کد پیگیری به‌صورت جزیرهٔ LTR نمایش داده می‌شوند.',
  ],
};

export const commerceOrdersDoc: ComponentDoc = {
  slug: 'commerce-orders',
  title: 'فروشگاه · جزئیات سفارش و فاکتور چاپی A4',
  components: ['OrderDetail', 'Invoice'],
  summary:
    'نمایش روند وضعیت سفارش با تایم‌لاین و برچسب دامنهٔ سفارش، همراه با فاکتور رسمی A4 آمادهٔ چاپ با تاریخ شمسی و مبالغ تومان.',
  status: 'approved',
  products: ['N', 'T'],
  Example: () => (
    <OrderDetail
      orderNumber="NG-1405-4092"
      status="completed"
      createdAt="2026-11-20T08:15:00Z"
      timeline={sampleOrderTimeline}
      items={sampleOrderItems}
      shippingDetails={[
        { id: 'rec', label: 'گیرنده', value: 'کلینیک مشاورهٔ آرامش سپهر' },
        { id: 'ship', label: 'روش تحویل', value: 'تحویل آنی دیجیتال (سریال در حساب)' },
      ]}
      discount={450_000}
      onDownloadInvoice={() => {}}
    />
  ),
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="فاکتور چاپی A4 (حاشیه ۱۴×۱۰ میلی‌متر، تاریخ شمسی، تومان)">
        <Invoice
          invoiceNumber="INV-1405-0891"
          issuedAt="2026-11-20T08:19:00Z"
          seller={sampleInvoiceSeller}
          buyer={sampleInvoiceBuyer}
          items={sampleOrderItems}
          discount={450_000}
          onPrint={() => {}}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'برای چاپ یا خروجی PDF از الگوی `Invoice` استفاده کنید که دکمهٔ چاپ را در `@media print` پنهان می‌کند.',
    ],
    dont: [
      'تاریخ فاکتور را به میلادی یا بدون منطقهٔ زمانی تهران نمایش ندهید.',
    ],
  },
  a11y: [
    'جدول اقلام دارای سرستون‌های `<th scope="col">` و ظرف اسکرول افقی ایمن در موبایل است.',
    'برچسب وضعیت سفارش از `StatusBadge(domain="order")` با آیکون و واژه استفاده می‌کند.',
  ],
  rtl: [
    'شمارهٔ سفارش، شمارهٔ فاکتور، شناسهٔ ملی و تلفن ماسک‌شده در `<Code>` و `<Ltr>` ایزوله می‌شوند.',
  ],
};

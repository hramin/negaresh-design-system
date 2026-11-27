import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
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
} from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import {
  Cart,
  Checkout,
  GatewayPicker,
  Invoice,
  OrderDetail,
  PaymentResult,
  Price,
  ProductCard,
  ProductPage,
  Wishlist,
} from './index.ts';

function wrap(ui: ReactNode) {
  return <ThemeProvider messages={faMessages}>{ui}</ThemeProvider>;
}

describe('Commerce patterns', () => {
  it('renders Price in Toman with free, sale, and org-rate states (D-26)', async () => {
    const { container } = render(
      wrap(
        <div>
          <Price amount={4_850_000} originalAmount={5_900_000} />
          <Price amount={0} />
          <Price amount={180_000} isOrgRate />
        </div>,
      ),
    );
    expect(container.textContent).toContain('تومان');
    expect(container.textContent).toContain('رایگان');
    expect(container.textContent).toContain('تعرفهٔ سازمانی');
    await expectNoAxeViolations(container);
  });

  it('toggles wishlist and triggers add-to-cart on ProductCard and Wishlist', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onAdd = vi.fn();
    const { container } = render(
      wrap(
        <div>
          <ProductCard
            product={sampleProducts[0]!}
            onToggleWishlist={onToggle}
            onAddToCart={onAdd}
          />
          <Wishlist items={[]} />
        </div>,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'افزودن به سبد خرید' }));
    expect(onAdd).toHaveBeenCalledWith('prod-negaresh-suite');
    await expectNoAxeViolations(container);
  });

  it('switches gallery images and edition ChoiceCards in ProductPage', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const { container } = render(
      wrap(
        <ProductPage
          title="نرم‌افزار نگرش ۴"
          summary="نسخهٔ جامع روان‌سنجی"
          gallery={sampleProductGallery}
          editions={sampleProductEditions}
          systemRequirements={sampleProductRequirements}
          faqs={sampleProductFaqs}
          onAddToCart={onAdd}
        />,
      ),
    );

    const secondThumb = screen.getByRole('button', { name: /نمایش تصویر ۲ از ۳/ });
    await user.click(secondThumb);
    expect(secondThumb.getAttribute('aria-pressed')).toBe('true');

    await user.click(screen.getByRole('button', { name: 'افزودن به سبد خرید' }));
    expect(onAdd).toHaveBeenCalledWith('ed-single');
    await expectNoAxeViolations(container);
  });

  it('supports Cart quantity steppers, coupon apply, and Checkout digital-only shortcut', async () => {
    const user = userEvent.setup();
    const onQty = vi.fn();
    const onCoupon = vi.fn();
    const onPay = vi.fn();

    const { container } = render(
      wrap(
        <div>
          <Cart
            items={sampleCartItems}
            onQuantityChange={onQty}
            onApplyCoupon={onCoupon}
            onProceedToCheckout={() => {}}
          />
          <Checkout
            items={sampleCartItems}
            gateways={sampleGateways}
            shippingMethods={sampleShippingMethods}
            isDigitalOnly
            onPay={onPay}
          />
          <GatewayPicker gateways={sampleGateways} defaultValue="behpardakht" />
        </div>,
      ),
    );

    const incBtn = screen.getByRole('button', { name: /افزایش تعداد مجموعه نرم‌افزار/ });
    await user.click(incBtn);
    expect(onQty).toHaveBeenCalledWith('line-1', 2);

    await user.click(screen.getByRole('button', { name: 'انتقال به درگاه و پرداخت' }));
    expect(onPay).toHaveBeenCalledWith(expect.objectContaining({ gatewayId: 'behpardakht' }));
    await expectNoAxeViolations(container);
  });

  it('renders PaymentResult, OrderDetail, and printable A4 Invoice cleanly', async () => {
    const { container } = render(
      wrap(
        <div>
          <PaymentResult
            status="success"
            orderNumber="NG-1405-4092"
            trackingCode="BP-884920145"
            amount={6_800_000}
          />
          <OrderDetail
            orderNumber="NG-1405-4092"
            status="completed"
            createdAt="2026-11-20T08:15:00Z"
            timeline={sampleOrderTimeline}
            items={sampleOrderItems}
          />
          <Invoice
            invoiceNumber="INV-1405-0891"
            issuedAt="2026-11-20T08:19:00Z"
            seller={sampleInvoiceSeller}
            buyer={sampleInvoiceBuyer}
            items={sampleOrderItems}
            onPrint={() => {}}
          />
        </div>,
      ),
    );

    expect(container.textContent).toContain('BP-884920145');
    expect(container.textContent).toContain('INV-1405-0891');
    expect(container.querySelector('[data-nds="Invoice"]')).not.toBeNull();
    await expectNoAxeViolations(container);
  });
});

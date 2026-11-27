import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  sampleActivations,
  sampleAlertChannels,
  sampleAuditEntries,
  sampleLimitHistory,
  sampleSerialProducts,
} from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import {
  ActivationFlow,
  AlertChannels,
  AuditLog,
  CodeDisplay,
  LimitEditor,
  MyActivations,
  SerialBatchGenerator,
} from './index.ts';

function wrap(ui: ReactNode) {
  return <ThemeProvider messages={faMessages}>{ui}</ThemeProvider>;
}

describe('Licensing patterns', () => {
  it('renders CodeDisplay repeat-PC notice (FR-12) and ActivationFlow limit-reached buy +1 CTA (FR-11)', async () => {
    const user = userEvent.setup();
    const onBuy = vi.fn();
    const { container } = render(
      wrap(
        <div>
          <CodeDisplay code="ACT-7K9P-3M2Q-8V4X" isRepeatPc sentByChannels="پیامک" />
          <ActivationFlow
            productName="نگرش ۴"
            systemCode="SYS-94FA-21BC-08E1"
            defaultSerialValue="N25AG-EMV0K"
            errorKind="limit_reached"
            usage={{ used: 2, limit: 2, sourceNote: 'سقف محصول' }}
            onBuyExtraSlot={onBuy}
          />
          <MyActivations records={sampleActivations} onResendCode={() => {}} />
        </div>,
      ),
    );

    expect(container.textContent).toContain('بدون کسر از سهمیه');
    await user.click(screen.getByRole('button', { name: 'خرید +۱ فعال‌سازی' }));
    expect(onBuy).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });

  it('renders FR-23 limit source, SerialBatchGenerator CSV export, AlertChannels send-test, and AuditLog DiffView', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    const onTest = vi.fn();
    const { container } = render(
      wrap(
        <div>
          <LimitEditor effectiveLimit={3} source="serial" history={sampleLimitHistory} />
          <SerialBatchGenerator products={sampleSerialProducts} onExportCsv={onExport} />
          <AlertChannels
            channels={sampleAlertChannels}
            primaryRecipient="+989123456789"
            secondaryRecipient="ops@negaresh.ir"
            onSendTest={onTest}
          />
          <AuditLog entries={sampleAuditEntries} />
        </div>,
      ),
    );

    expect(container.textContent).toContain('سقف اختصاصی سریال');
    await user.click(screen.getByRole('button', { name: 'خروجی CSV' }));
    expect(onExport).toHaveBeenCalledTimes(1);

    const testBtns = screen.getAllByRole('button', { name: 'ارسال آزمایشی' });
    await user.click(testBtns[0]!);
    expect(onTest).toHaveBeenCalledWith('sms');

    await user.click(screen.getByRole('button', { name: 'نمایش تغییرات' }));
    expect(container.querySelector('[data-nds="DiffView"]')).not.toBeNull();
    await expectNoAxeViolations(container);
  });
});

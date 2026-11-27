import { iconCheck } from '@negaresh/icons';
import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  sampleB2BClients,
  sampleCampaignParticipants,
  sampleDashboardReports,
  sampleTestCatalog,
  sampleWalletLedger,
} from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import {
  B2BPanel,
  CampaignBuilder,
  CampaignParticipants,
  OrgWallet,
  RosterImport,
  SeatMeter,
  ShareLinkPanel,
  TestCatalog,
  TestDashboard,
} from './index.ts';

function wrap(ui: ReactNode) {
  return <ThemeProvider messages={faMessages}>{ui}</ThemeProvider>;
}

describe('Test Platform patterns', () => {
  it('renders TestCatalog, TestDashboard, Campaign workspace, OrgWallet, and B2BPanel', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    const { container } = render(
      wrap(
        <div>
          <TestCatalog tests={sampleTestCatalog} onStartOrBuy={() => {}} />
          <TestDashboard
            stats={[{ label: 'آزمون‌های تکمیل‌شده', value: 6, icon: iconCheck }]}
            unfinishedTestTitle="MMPI-Teen-13"
            reports={sampleDashboardReports}
          />
          <CampaignBuilder
            testOptions={[{ id: 't1', label: 'MMPI-Teen-13' }]}
            extraFieldOptions={[{ id: 'f1', label: 'پایه' }]}
          />
          <ShareLinkPanel shareUrl="https://tests.negaresh.ir/c/demo" />
          <RosterImport
            defaultPasteText={'09121112233\n09357654321\ninvalid'}
            onImport={onImport}
          />
          <SeatMeter used={38} limit={50} />
          <CampaignParticipants participants={sampleCampaignParticipants} />
          <OrgWallet balance={2_950_000} ledger={sampleWalletLedger} />
          <B2BPanel
            clients={sampleB2BClients}
            newlyCreatedKey="nds_live_8f3a9d20c4e1"
            onRevokeKey={() => {}}
          />
        </div>,
      ),
    );

    expect(container.textContent).toContain('۲ ردیف معتبر · ۱ ردیف نامعتبر');
    expect(container.textContent).toContain('nds_live_8f3a9d20c4e1');
    await user.click(screen.getByRole('button', { name: 'ثبت فهرست شرکت‌کنندگان' }));
    expect(onImport).toHaveBeenCalledWith(['+989121112233', '+989357654321']);
    await expectNoAxeViolations(container);
  });
});

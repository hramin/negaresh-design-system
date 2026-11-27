import { Switch, ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  sampleAccountNav,
  sampleAdminNav,
  sampleBreadcrumbs,
  sampleNotificationTemplates,
  sampleShellStats,
  sampleUserMenu,
  sampleVerifiedMobiles,
} from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import {
  AccountContacts,
  AccountShell,
  AdminShell,
  NotificationTemplatesEditor,
  SettingsPage,
} from './index.ts';

function wrap(ui: ReactNode) {
  return <ThemeProvider messages={faMessages}>{ui}</ThemeProvider>;
}

describe('Account & Admin Shell patterns', () => {
  it('reuses AccountPill/UserMenu inside AccountShell and filters AdminShell nav by role', async () => {
    const { container } = render(
      wrap(
        <div>
          <AccountShell
            embedded
            navLabel="ناوبری حساب آزمون"
            productLabel="حساب نگرش"
            pageTitle="پیشخوان"
            userMenu={{ ...sampleUserMenu, 'aria-label': 'منوی حساب کاربری ۱' }}
            navGroups={sampleAccountNav}
            stats={sampleShellStats}
          >
            <p>محتوای حساب</p>
          </AccountShell>
          <AdminShell
            embedded
            navLabel="ناوبری مدیریت آزمون"
            productLabel="مدیریت نگرش"
            pageTitle="سریال‌ها"
            breadcrumbs={sampleBreadcrumbs}
            userMenu={{ ...sampleUserMenu, 'aria-label': 'منوی حساب کاربری ۲' }}
            navGroups={sampleAdminNav}
            userRoles={['support']}
          >
            <p>محتوای مدیریت</p>
          </AdminShell>
        </div>,
      ),
    );

    expect(container.querySelectorAll('[data-nds="AccountPill"]').length).toBe(2);
    expect(container.querySelectorAll('main').length).toBe(0);
    // Support role must not see admin-only operations group
    expect(container.textContent).not.toContain('کانال‌های هشدار');
    await expectNoAxeViolations(container);
  });

  it('renders AccountContacts, SettingsPage, and NotificationTemplatesEditor with live preview', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const { container } = render(
      wrap(
        <div>
          <AccountContacts
            mobiles={sampleVerifiedMobiles}
            email="sara@negaresh.ir"
            isEmailVerified
            onRemoveMobile={() => {}}
          />
          <SettingsPage
            title="تنظیمات"
            isDirty
            onSave={onSave}
            onDiscard={() => {}}
            sections={[
              {
                id: 's1',
                title: 'اعلان‌ها',
                content: <Switch defaultSelected>دریافت پیامک</Switch>,
              },
            ]}
          />
          <NotificationTemplatesEditor templates={sampleNotificationTemplates} />
        </div>,
      ),
    );

    expect(container.textContent).toContain('۰۹۱۲ ••• ۶۷۸۹');
    expect(container.textContent).toContain('ACT-7K9P-3M2Q');
    await user.click(screen.getByRole('button', { name: 'ذخیرهٔ تغییرات' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });
});

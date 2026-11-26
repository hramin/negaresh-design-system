import {
  iconBell,
  iconFile,
  iconHome,
  iconKey,
  iconMenu,
  iconSettings,
  iconShield,
} from '@negaresh/icons';
import {
  Container,
  DialogTrigger,
  IconButton,
  LogoSlot,
  Sheet,
  SideNav,
  type SideNavGroupData,
  SkipLink,
  ToastProvider,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavLink,
  UserMenu,
  useToast,
} from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import { type ReactNode, useState } from 'react';
import styles from './admin-serials.module.css';

export interface AdminShellProps {
  activeSection?: 'serials' | 'limits' | 'alerts' | 'audit' | 'settings' | undefined;
  children: ReactNode;
}

function AdminShellInner({ activeSection = 'serials', children }: AdminShellProps) {
  const toast = useToast();
  const [activeRole, setActiveRole] = useState<'admin' | 'support'>('admin');
  const [navSection, setNavSection] = useState<string>(activeSection);

  const navGroups: SideNavGroupData[] = [
    {
      id: 'licensing',
      title: 'مدیریت مجوزها',
      items: [
        {
          id: 'dashboard',
          label: 'داشبورد',
          icon: iconHome,
          isCurrent: navSection === 'dashboard',
          onPress: () => {
            setNavSection('dashboard');
            toast.add({
              title: 'نمای پیش‌نمایش',
              description: 'در حال مشاهدهٔ نمونهٔ مدیریت سریال‌ها هستید.',
              tone: 'info',
            });
          },
        },
        {
          id: 'serials',
          label: 'سریال‌ها',
          href: '/reference/admin-serials',
          icon: iconKey,
          badge: 10,
          isCurrent: navSection === 'serials',
        },
        {
          id: 'limits',
          label: 'سقف‌های فعال‌سازی',
          icon: iconShield,
          badge: 3,
          isCurrent: navSection === 'limits',
          onPress: () => setNavSection('limits'),
        },
      ],
    },
    {
      id: 'operations',
      title: 'عملیات و پایش',
      roles: ['admin'],
      isCollapsible: true,
      defaultExpanded: true,
      items: [
        {
          id: 'alerts',
          label: 'هشدارها',
          icon: iconBell,
          badge: 2,
          isCurrent: navSection === 'alerts',
          onPress: () => setNavSection('alerts'),
        },
        {
          id: 'audit',
          label: 'گزارش ممیزی',
          icon: iconFile,
          isCurrent: navSection === 'audit',
          onPress: () => setNavSection('audit'),
        },
        {
          id: 'settings',
          label: 'تنظیمات سامانه',
          icon: iconSettings,
          isCurrent: navSection === 'settings',
          onPress: () => setNavSection('settings'),
        },
      ],
    },
  ];

  const userRoles = activeRole === 'admin' ? ['admin', 'support'] : ['support'];

  return (
    <div className={styles.shell} data-admin-sample>
      <SkipLink />
      <TopBar
        brand={
          <TopBarBrand href="/reference/admin-serials">
            <LogoSlot product="رجیستری نگرش · مدیریت" size="sm" />
          </TopBarBrand>
        }
        nav={
          <TopBarNav aria-label="ناوبری بالای پنل مدیریت">
            <TopBarNavLink href="/reference/admin-serials" isCurrent>
              سریال‌ها
            </TopBarNavLink>
            <TopBarNavLink href="/reference/registry-activation">
              فعال‌سازی نرم‌افزار
            </TopBarNavLink>
            <TopBarNavLink href="/components">مستندات NDS</TopBarNavLink>
          </TopBarNav>
        }
        mobileMenu={
          <DialogTrigger>
            <IconButton icon={iconMenu} variant="ghost" aria-label="باز کردن منوی مدیریت" />
            <Sheet title="منوی مدیریت رجیستری" side="start" size="sm">
              {(close) => (
                <SideNav
                  aria-label="منوی کشویی مدیریت رجیستری"
                  adaptToTabStrip={false}
                  userRoles={userRoles}
                  groups={navGroups.map((g) => ({
                    ...g,
                    items: g.items.map((item) => ({
                      ...item,
                      onPress: () => {
                        item.onPress?.();
                        close();
                      },
                    })),
                  }))}
                />
              )}
            </Sheet>
          </DialogTrigger>
        }
        actions={
          <UserMenu
            label="حامد کریمی"
            aria-label="حساب کاربری حامد کریمی"
            name="حامد کریمی"
            subtitle={maskPhone('09123450011')}
            ltrSubtitle
            roles={[
              { id: 'admin', label: 'مدیر سامانه' },
              { id: 'support', label: 'پشتیبان فنی' },
            ]}
            activeRole={activeRole}
            onRoleChange={(roleId) => {
              if (roleId === 'admin' || roleId === 'support') {
                setActiveRole(roleId);
                toast.add({
                  title: 'نقش کاربری تغییر کرد',
                  description:
                    roleId === 'admin'
                      ? 'دسترسی کامل مدیریت فعال شد.'
                      : 'نمای محدود پشتیبان فنی فعال شد.',
                  tone: 'info',
                });
              }
            }}
            showThemeToggle
            onSignOut={() =>
              toast.add({
                title: 'حالت پیش‌نمایش',
                description: 'در صفحهٔ نمونهٔ مستندات خروج واقعی انجام نمی‌شود.',
                tone: 'info',
              })
            }
          />
        }
      />

      <Container size="wide">
        <div className={styles.workspace}>
          <div className={styles.sidebar}>
            <SideNav
              aria-label="بخش‌های پنل مدیریت"
              userRoles={userRoles}
              groups={navGroups}
            />
          </div>
          <main id="main" className={styles.main} tabIndex={-1}>
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}

export function AdminShell(props: AdminShellProps) {
  return (
    <ToastProvider>
      <AdminShellInner {...props} />
    </ToastProvider>
  );
}

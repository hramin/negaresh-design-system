import {
  iconCheck,
  iconMail,
  iconMenu,
  iconPhone,
  iconPlus,
  iconSend,
  iconTrash,
} from '@negaresh/icons';
import {
  AlertDialog,
  Badge,
  Breadcrumbs,
  type BreadcrumbItemData,
  Button,
  Code,
  DialogTrigger,
  Footer,
  type FooterGroupData,
  Heading,
  IconButton,
  Inline,
  InlineAlert,
  LogoSlot,
  Ltr,
  OTPField,
  PhoneField,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Sheet,
  SideNav,
  type SideNavGroupData,
  SkipLink,
  Stack,
  StatGroup,
  StatTile,
  type StatTileProps,
  Surface,
  Text,
  TextArea,
  TextField,
  TopBar,
  TopBarBrand,
  UserMenu,
  type UserMenuProps,
} from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import { type ReactNode, type Ref, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './shells.module.css';

/* ── AccountShell ────────────────────────────────────────────────────────────────────── */
export interface AccountShellProps {
  /** Product title displayed beside `LogoSlot`. */
  productLabel: string;
  /** Current page title. */
  pageTitle: string;
  /** Optional page subtitle. */
  pageDescription?: string | undefined;
  /** Optional header actions aligned to inline end. */
  pageActions?: ReactNode | undefined;
  /** UserMenu configuration (reuses approved P2 `AccountPill` + P4 `UserMenu`). */
  userMenu: UserMenuProps;
  /** Side navigation groups (automatically adapts to scrollable `TabStrip` below 900 px). */
  navGroups: readonly SideNavGroupData[];
  /** Optional dashboard summary stat tiles. */
  stats?: readonly StatTileProps[] | undefined;
  /** Optional footer link groups. */
  footerGroups?: readonly FooterGroupData[] | undefined;
  /** Accessible label for the account navigation landmark. */
  navLabel?: string | undefined;
  /** Render inside another page/gallery without duplicating `<main>` or `<SkipLink>`. Default `false`. */
  embedded?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Customer account shell composing `TopBar`, `UserMenu` (reusing approved `AccountPill`),
 * `SideNav` → mobile `TabStrip`, page header, optional dashboard `StatGroup`, and `Footer`.
 */
export function AccountShell({
  productLabel,
  pageTitle,
  pageDescription,
  pageActions,
  userMenu,
  navGroups,
  stats,
  footerGroups,
  navLabel,
  embedded = false,
  children,
  className,
  ref,
}: AccountShellProps) {
  const { shells } = usePatternMessages();
  const contentBody = (
    <div className={styles.shellContent}>
      <div className={styles.pageHeader}>
        <Stack gap="1">
          <Heading level={embedded ? 3 : 1}>{pageTitle}</Heading>
          {pageDescription && (
            <Text as="p" size="sm" tone="muted">
              {pageDescription}
            </Text>
          )}
        </Stack>
        {pageActions && <Inline gap="2">{pageActions}</Inline>}
      </div>

      {stats && stats.length > 0 && (
        <StatGroup>
          {stats.map((tile) => (
            <StatTile key={String(tile.label)} {...tile} />
          ))}
        </StatGroup>
      )}

      {children}
    </div>
  );

  return (
    <div
      ref={ref}
      data-nds="AccountShell"
      data-embedded={embedded ? 'true' : 'false'}
      className={cx(styles.shellFrame, className)}
    >
      {!embedded && <SkipLink />}
      <TopBar
        brand={
          <TopBarBrand href="#account-home" aria-label={productLabel}>
            <LogoSlot size="sm" product={productLabel} />
          </TopBarBrand>
        }
        actions={<UserMenu {...userMenu} />}
      />
      <div className={styles.shellBody}>
        <SideNav
          aria-label={navLabel ?? shells.accountNavLabel}
          groups={navGroups}
          adaptToTabStrip
        />
        {embedded ? (
          <section aria-label={pageTitle}>{contentBody}</section>
        ) : (
          <main id="main" tabIndex={-1}>
            {contentBody}
          </main>
        )}
      </div>
      {footerGroups && footerGroups.length > 0 && !embedded && (
        <Footer brand={<LogoSlot size="sm" product={productLabel} />} groups={footerGroups} />
      )}
    </div>
  );
}

/* ── AccountContacts ─────────────────────────────────────────────────────────────────── */
export interface VerifiedMobileItem {
  id: string;
  phone: string;
  isPrimary?: boolean | undefined;
}

export interface AccountContactsProps {
  mobiles: readonly VerifiedMobileItem[];
  email?: string | undefined;
  isEmailVerified?: boolean | undefined;
  onAddMobile?: ((phone: string, otpCode: string) => void) | undefined;
  onRemoveMobile?: ((id: string) => void) | undefined;
  onUpdateEmail?: ((email: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Customer verified contacts pattern: multiple verified mobiles (`maskPhone` + LTR),
 * inline add + OTP verify flow, `AlertDialog`-guarded removal, and verified email management.
 */
export function AccountContacts({
  mobiles,
  email = '',
  isEmailVerified = false,
  onAddMobile,
  onRemoveMobile,
  onUpdateEmail,
  className,
  ref,
}: AccountContactsProps) {
  const { shells } = usePatternMessages();
  const [adding, setAdding] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailDraft, setEmailDraft] = useState(email);

  return (
    <section
      ref={ref}
      data-nds="AccountContacts"
      aria-label={shells.contactsTitle}
      className={className}
    >
      <Stack gap="5">
        <Heading level={2}>{shells.contactsTitle}</Heading>

        <Surface>
          <Section>
            <Stack gap="4">
              <div className={styles.pageHeader}>
                <Heading level={3}>{shells.mobilesHeading}</Heading>
                <Button
                  size="sm"
                  variant="secondary"
                  iconStart={iconPlus}
                  onPress={() => {
                    setAdding((v) => !v);
                    setOtpSent(false);
                    setOtpCode('');
                  }}
                >
                  {shells.addMobileButton}
                </Button>
              </div>

              <ul className={styles.contactList}>
                {mobiles.map((m) => {
                  const masked = maskPhone(m.phone) ?? m.phone;
                  return (
                    <li key={m.id} className={styles.contactRow}>
                      <Inline gap="3">
                        <Ltr>{masked}</Ltr>
                        <Badge tone="success" size="sm" icon={iconPhone}>
                          {shells.verifiedBadge}
                        </Badge>
                        {m.isPrimary && (
                          <Badge tone="accent" size="sm">
                            {shells.primaryBadge}
                          </Badge>
                        )}
                      </Inline>
                      {!m.isPrimary && onRemoveMobile && (
                        <DialogTrigger>
                          <Button size="sm" variant="ghost" iconStart={iconTrash}>
                            {shells.removeMobile}
                          </Button>
                          <AlertDialog
                            tone="danger"
                            title={shells.removeMobileConfirmTitle}
                            confirmLabel={shells.removeMobile}
                            onConfirm={() => onRemoveMobile(m.id)}
                          >
                            {shells.removeMobileConfirmBody(masked)}
                          </AlertDialog>
                        </DialogTrigger>
                      )}
                    </li>
                  );
                })}
              </ul>

              {adding && (
                <Surface variant="plain">
                  <Stack gap="3">
                    <PhoneField
                      label={shells.newMobileLabel}
                      value={newPhone}
                      onChange={setNewPhone}
                    />
                    {!otpSent ? (
                      <Inline gap="2">
                        <Button
                          size="sm"
                          variant="primary"
                          isDisabled={newPhone.trim().length < 10}
                          onPress={() => setOtpSent(true)}
                        >
                          {shells.sendVerificationCode}
                        </Button>
                      </Inline>
                    ) : (
                      <Stack gap="3">
                        <OTPField
                          label={shells.verifyCodeLabel}
                          value={otpCode}
                          onChange={setOtpCode}
                          resendSecondsRemaining={60}
                        />
                        <Inline gap="2">
                          <Button
                            size="sm"
                            variant="primary"
                            isDisabled={otpCode.length < 6}
                            onPress={() => {
                              onAddMobile?.(newPhone, otpCode);
                              setAdding(false);
                              setNewPhone('');
                              setOtpCode('');
                              setOtpSent(false);
                            }}
                          >
                            {shells.confirmMobile}
                          </Button>
                        </Inline>
                      </Stack>
                    )}
                  </Stack>
                </Surface>
              )}
            </Stack>
          </Section>
        </Surface>

        <Surface>
          <Section>
            <Stack gap="3">
              <Inline gap="2">
                <Heading level={3}>{shells.emailHeading}</Heading>
                {isEmailVerified && (
                  <Badge tone="success" size="sm" icon={iconMail}>
                    {shells.verifiedBadge}
                  </Badge>
                )}
              </Inline>
              <TextField
                label={shells.emailAddressLabel}
                type="email"
                value={emailDraft}
                onChange={setEmailDraft}
              />
              {onUpdateEmail && (
                <Inline gap="2">
                  <Button
                    size="sm"
                    variant="secondary"
                    isDisabled={emailDraft.trim().length === 0}
                    onPress={() => onUpdateEmail(emailDraft.trim())}
                  >
                    {shells.updateEmail}
                  </Button>
                </Inline>
              )}
            </Stack>
          </Section>
        </Surface>
      </Stack>
    </section>
  );
}

/* ── AdminShell ──────────────────────────────────────────────────────────────────────── */
export interface AdminShellProps {
  productLabel: string;
  pageTitle: string;
  pageDescription?: string | undefined;
  breadcrumbs?: readonly BreadcrumbItemData[] | undefined;
  pageActions?: ReactNode | undefined;
  userMenu: UserMenuProps;
  navGroups: readonly SideNavGroupData[];
  /** Active roles used to filter role-restricted `SideNav` groups/items. */
  userRoles?: readonly string[] | undefined;
  navLabel?: string | undefined;
  /** Render inside another page/gallery without duplicating `<main>` or `<SkipLink>`. Default `false`. */
  embedded?: boolean | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Multi-role admin workspace shell composing `TopBar`, `UserMenu` (role switcher), role-filtered
 * `SideNav` (mobile `Sheet` below 900 px), `Breadcrumbs`, and page header with actions.
 */
export function AdminShell({
  productLabel,
  pageTitle,
  pageDescription,
  breadcrumbs,
  pageActions,
  userMenu,
  navGroups,
  userRoles,
  navLabel,
  embedded = false,
  children,
  className,
  ref,
}: AdminShellProps) {
  const { shells } = usePatternMessages();
  const resolvedNavLabel = navLabel ?? shells.adminNavLabel;

  const contentBody = (
    <div className={styles.shellContent}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className={styles.pageHeader}>
        <Stack gap="1">
          <Heading level={embedded ? 3 : 1}>{pageTitle}</Heading>
          {pageDescription && (
            <Text as="p" size="sm" tone="muted">
              {pageDescription}
            </Text>
          )}
        </Stack>
        {pageActions && <Inline gap="2">{pageActions}</Inline>}
      </div>
      {children}
    </div>
  );

  return (
    <div
      ref={ref}
      data-nds="AdminShell"
      data-embedded={embedded ? 'true' : 'false'}
      className={cx(styles.shellFrame, className)}
    >
      {!embedded && <SkipLink />}
      <TopBar
        brand={
          <Inline gap="2">
            <span className={styles.mobileTriggerOnly}>
              <DialogTrigger>
                <IconButton
                  variant="ghost"
                  icon={iconMenu}
                  aria-label={shells.openAdminMenu}
                />
                <Sheet title={resolvedNavLabel} side="start">
                  <SideNav
                    aria-label={resolvedNavLabel}
                    groups={navGroups}
                    {...(userRoles !== undefined ? { userRoles } : {})}
                    adaptToTabStrip={false}
                  />
                </Sheet>
              </DialogTrigger>
            </span>
            <TopBarBrand href="#admin-home" aria-label={productLabel}>
              <LogoSlot size="sm" product={productLabel} />
            </TopBarBrand>
          </Inline>
        }
        actions={<UserMenu {...userMenu} />}
      />
      <div className={styles.shellBody}>
        <div className={styles.desktopNavOnly}>
          <SideNav
            aria-label={resolvedNavLabel}
            groups={navGroups}
            {...(userRoles !== undefined ? { userRoles } : {})}
            adaptToTabStrip={false}
          />
        </div>
        {embedded ? (
          <section aria-label={pageTitle}>{contentBody}</section>
        ) : (
          <main id="main" tabIndex={-1}>
            {contentBody}
          </main>
        )}
      </div>
    </div>
  );
}

/* ── SettingsPage ────────────────────────────────────────────────────────────────────── */
export interface SettingsSectionItem {
  id: string;
  title: string;
  description?: string | undefined;
  content: ReactNode;
}

export interface SettingsPageProps {
  title: string;
  sections: readonly SettingsSectionItem[];
  isDirty?: boolean | undefined;
  isSaving?: boolean | undefined;
  savedMessage?: string | undefined;
  onSave?: (() => void) | undefined;
  onDiscard?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Grouped settings layout with section cards and a Save/Discard action bar with polite status announcement. */
export function SettingsPage({
  title,
  sections,
  isDirty = false,
  isSaving = false,
  savedMessage,
  onSave,
  onDiscard,
  className,
  ref,
}: SettingsPageProps) {
  const { shells } = usePatternMessages();

  return (
    <section ref={ref} data-nds="SettingsPage" aria-label={title} className={className}>
      <Stack gap="5">
        <Heading level={2}>{title}</Heading>
        {savedMessage && (
          <InlineAlert tone="success" title={shells.settingsSavedNotice}>
            {savedMessage}
          </InlineAlert>
        )}
        {sections.map((sec) => (
          <Surface key={sec.id}>
            <Section>
              <Stack gap="4">
                <Stack gap="1">
                  <Heading level={3}>{sec.title}</Heading>
                  {sec.description && (
                    <Text as="p" size="sm" tone="muted">
                      {sec.description}
                    </Text>
                  )}
                </Stack>
                {sec.content}
              </Stack>
            </Section>
          </Surface>
        ))}
        <div className={styles.saveBar} role="status" aria-live="polite">
          <Text size="sm" tone={isDirty ? 'default' : 'muted'}>
            {isDirty ? shells.settingsUnsavedNotice : shells.settingsSavedNotice}
          </Text>
          <Inline gap="2">
            {onDiscard && (
              <Button variant="secondary" isDisabled={!isDirty || isSaving} onPress={onDiscard}>
                {shells.discardChanges}
              </Button>
            )}
            {onSave && (
              <Button
                variant="primary"
                iconStart={iconCheck}
                isPending={isSaving}
                isDisabled={!isDirty}
                onPress={onSave}
              >
                {shells.saveChanges}
              </Button>
            )}
          </Inline>
        </div>
      </Stack>
    </section>
  );
}

/* ── NotificationTemplatesEditor ─────────────────────────────────────────────────────── */
export type TemplateChannel = 'sms' | 'email' | 'telegram' | 'bale';

export interface NotificationTemplate {
  id: string;
  channel: TemplateChannel;
  name: string;
  subject?: string | undefined;
  body: string;
  variables: readonly string[];
  sampleValues: Record<string, string>;
}

export interface NotificationTemplatesEditorProps {
  templates: readonly NotificationTemplate[];
  onSave?: ((template: NotificationTemplate) => void) | undefined;
  onSendTest?: ((template: NotificationTemplate) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

function renderTemplatePreview(body: string, sampleValues: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key: string) => sampleValues[key] ?? match);
}

/** Admin notification templates editor with channel switcher, variable insertion chips, live Persian preview, and SMS segment counter. */
export function NotificationTemplatesEditor({
  templates,
  onSave,
  onSendTest,
  className,
  ref,
}: NotificationTemplatesEditorProps) {
  const { shells, licensing } = usePatternMessages();
  const [activeChannel, setActiveChannel] = useState<TemplateChannel>(
    templates[0]?.channel ?? 'sms',
  );
  const activeTemplate =
    templates.find((t) => t.channel === activeChannel) ?? templates[0];
  const [subject, setSubject] = useState(activeTemplate?.subject ?? '');
  const [body, setBody] = useState(activeTemplate?.body ?? '');

  const selectChannel = (channel: TemplateChannel) => {
    setActiveChannel(channel);
    const next = templates.find((t) => t.channel === channel);
    if (next) {
      setSubject(next.subject ?? '');
      setBody(next.body);
    }
  };

  const previewText = activeTemplate
    ? renderTemplatePreview(body, activeTemplate.sampleValues)
    : body;
  const charCount = previewText.length;
  const smsSegments = Math.max(1, Math.ceil(charCount / 70));

  return (
    <section
      ref={ref}
      data-nds="NotificationTemplatesEditor"
      aria-label={shells.templatesTitle}
      className={className}
    >
      <Stack gap="4">
        <Heading level={2}>{shells.templatesTitle}</Heading>
        <SegmentedControl
          label={shells.templatesChannelLabel}
          value={activeChannel}
          onChange={(k) => selectChannel(k as TemplateChannel)}
        >
          {templates.map((t) => (
            <SegmentedControlItem key={t.id} id={t.channel}>
              {licensing.alertChannels[t.channel]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>

        {activeTemplate && (
          <div className={styles.templateGrid}>
            <Surface>
              <Section>
                <Stack gap="4">
                  <Heading level={3}>{activeTemplate.name}</Heading>
                  {activeChannel === 'email' && (
                    <TextField
                      label={shells.templateSubjectLabel}
                      value={subject}
                      onChange={setSubject}
                    />
                  )}
                  <TextArea
                    label={shells.templateBodyLabel}
                    value={body}
                    onChange={setBody}
                  />
                  <Stack gap="2">
                    <Text size="xs" weight="semibold" tone="muted">
                      {shells.templateVariablesHeading}
                    </Text>
                    <div className={styles.varChipList}>
                      {activeTemplate.variables.map((variable) => (
                        <Button
                          key={variable}
                          size="sm"
                          variant="secondary"
                          onPress={() => setBody((prev) => `${prev} {{${variable}}}`.trim())}
                        >
                          <Code>{`{{${variable}}}`}</Code>
                        </Button>
                      ))}
                    </div>
                  </Stack>
                  <Inline gap="2">
                    <Button
                      variant="primary"
                      iconStart={iconCheck}
                      onPress={() =>
                        onSave?.({ ...activeTemplate, subject, body })
                      }
                    >
                      {shells.saveTemplate}
                    </Button>
                    {onSendTest && (
                      <Button
                        variant="secondary"
                        iconStart={iconSend}
                        onPress={() => onSendTest({ ...activeTemplate, subject, body })}
                      >
                        {shells.sendTestTemplate}
                      </Button>
                    )}
                  </Inline>
                </Stack>
              </Section>
            </Surface>

            <Surface>
              <Section>
                <Stack gap="3">
                  <Heading level={3}>{shells.templatePreviewHeading}</Heading>
                  <div className={styles.previewBox}>{previewText}</div>
                  <Text size="xs" tone="subtle">
                    {shells.templateCharCount(charCount, smsSegments)}
                  </Text>
                </Stack>
              </Section>
            </Surface>
          </div>
        )}
      </Stack>
    </section>
  );
}

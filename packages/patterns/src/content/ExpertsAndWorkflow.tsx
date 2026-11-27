import { iconCheck, iconEdit, iconUsers } from '@negaresh/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  DatePicker,
  DiffView,
  EmptyState,
  FilterBar,
  Heading,
  Inline,
  InlineAlert,
  LinkButton,
  type ReviewStatus,
  Section,
  Select,
  SelectItem,
  Stack,
  StatusBadge,
  Surface,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextArea,
  TextField,
  TimeField,
  VerifiedBadge,
} from '@negaresh/react';
import { type DateInput, formatDate, formatDateTime } from '@negaresh/utils';
import { type ReactNode, type Ref, useMemo, useState } from 'react';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './content.module.css';
import { ContentCard, type ContentCardItem } from './EditorialPatterns.tsx';

export type ConsultationMode = 'in_person' | 'online' | 'phone';

export interface ExpertSummary {
  id: string;
  name: string;
  title: string;
  avatarSrc?: string | undefined;
  isVerified?: boolean | undefined;
  specialties: readonly string[];
  modes: readonly ConsultationMode[];
  city: string;
  intro: string;
  profileHref?: string | undefined;
}

export interface ExpertDirectoryProps {
  experts: readonly ExpertSummary[];
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Searchable expert directory (specialty, consultation mode, city) — strictly never exposes private contacts. */
export function ExpertDirectory({ experts, className, ref }: ExpertDirectoryProps) {
  const { content } = usePatternMessages();
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [mode, setMode] = useState('all');
  const [city, setCity] = useState('all');

  const specialties = useMemo(
    () => Array.from(new Set(experts.flatMap((e) => e.specialties))),
    [experts],
  );
  const cities = useMemo(() => Array.from(new Set(experts.map((e) => e.city))), [experts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return experts.filter((e) => {
      if (specialty !== 'all' && !e.specialties.includes(specialty)) return false;
      if (mode !== 'all' && !e.modes.includes(mode as ConsultationMode)) return false;
      if (city !== 'all' && e.city !== city) return false;
      if (!q) return true;
      return `${e.name} ${e.title} ${e.specialties.join(' ')}`.toLowerCase().includes(q);
    });
  }, [experts, query, specialty, mode, city]);

  return (
    <div ref={ref as Ref<HTMLDivElement>} data-nds="ExpertDirectory" className={className}>
      <Stack gap="4">
        <Heading level={2}>{content.expertsTitle}</Heading>
        <FilterBar
          aria-label={content.expertsTitle}
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder={content.expertsSearchPlaceholder}
          onReset={() => {
            setQuery('');
            setSpecialty('all');
            setMode('all');
            setCity('all');
          }}
          filters={
            <Inline gap="3">
              <Select
                label={content.specialtyFilterLabel}
                value={specialty}
                onChange={(k) => setSpecialty(String(k ?? 'all'))}
              >
                <SelectItem id="all" textValue={content.allOptionLabel}>
                  {content.allOptionLabel}
                </SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s} id={s} textValue={s}>
                    {s}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label={content.modeFilterLabel}
                value={mode}
                onChange={(k) => setMode(String(k ?? 'all'))}
              >
                <SelectItem id="all" textValue={content.allOptionLabel}>
                  {content.allOptionLabel}
                </SelectItem>
                <SelectItem id="in_person" textValue={content.consultationModes.in_person}>
                  {content.consultationModes.in_person}
                </SelectItem>
                <SelectItem id="online" textValue={content.consultationModes.online}>
                  {content.consultationModes.online}
                </SelectItem>
                <SelectItem id="phone" textValue={content.consultationModes.phone}>
                  {content.consultationModes.phone}
                </SelectItem>
              </Select>
              <Select
                label={content.cityFilterLabel}
                value={city}
                onChange={(k) => setCity(String(k ?? 'all'))}
              >
                <SelectItem id="all" textValue={content.allOptionLabel}>
                  {content.allOptionLabel}
                </SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} id={c} textValue={c}>
                    {c}
                  </SelectItem>
                ))}
              </Select>
            </Inline>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={iconUsers}
            title={content.expertsEmptyTitle}
            description={content.expertsEmptyDescription}
          />
        ) : (
          <div className={styles.feedGrid}>
            {filtered.map((expert) => (
              <Card key={expert.id}>
                <CardBody>
                  <Stack gap="3">
                    <Inline gap="3">
                      <Avatar
                        name={expert.name}
                        size="lg"
                        {...(expert.avatarSrc !== undefined ? { src: expert.avatarSrc } : {})}
                      />
                      <Stack gap="1">
                        <Inline gap="2">
                          <Heading level={3}>{expert.name}</Heading>
                          {expert.isVerified && <VerifiedBadge size="sm" />}
                        </Inline>
                        <Text size="sm" tone="muted">
                          {expert.title}
                        </Text>
                        <Text size="xs" tone="subtle">
                          {expert.city}
                        </Text>
                      </Stack>
                    </Inline>
                    <Text as="p" size="sm" tone="muted" leading="text">
                      {expert.intro}
                    </Text>
                    <Inline gap="2">
                      {expert.specialties.map((sp) => (
                        <Badge key={sp} tone="neutral" size="sm">
                          {sp}
                        </Badge>
                      ))}
                    </Inline>
                  </Stack>
                </CardBody>
                <CardFooter tone="sunken">
                  <Inline gap="2">
                    {expert.modes.map((m) => (
                      <Badge key={m} tone="info" size="sm">
                        {content.consultationModes[m]}
                      </Badge>
                    ))}
                    {expert.profileHref && (
                      <LinkButton variant="secondary" href={expert.profileHref}>
                        {expert.name}
                      </LinkButton>
                    )}
                  </Inline>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Stack>
    </div>
  );
}

export interface ExpertProfileProps {
  expert: ExpertSummary;
  about: string;
  education: readonly string[];
  authoredContent: readonly ContentCardItem[];
  /** Optional booking CTA slot (defaults to disabled coming-soon badge per docs/patterns.md). */
  bookingAction?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Expert profile page pattern: verified header, intro/about/education, and authored content tabs. */
export function ExpertProfile({
  expert,
  about,
  education,
  authoredContent,
  bookingAction,
  className,
  ref,
}: ExpertProfileProps) {
  const { content } = usePatternMessages();
  const articles = authoredContent.filter((i) => i.variant === 'article');
  const posts = authoredContent.filter((i) => i.variant === 'post');

  return (
    <article ref={ref} data-nds="ExpertProfile" className={className}>
      <Stack gap="5">
        <Surface>
          <Section>
            <div className={styles.expertHeader}>
              <Avatar
                name={expert.name}
                size="xl"
                {...(expert.avatarSrc !== undefined ? { src: expert.avatarSrc } : {})}
              />
              <Stack gap="3">
                <Inline gap="2">
                  <Heading level={2}>{expert.name}</Heading>
                  {expert.isVerified && <VerifiedBadge />}
                </Inline>
                <Text tone="muted">{`${expert.title} · ${expert.city}`}</Text>
                <Inline gap="2">
                  {expert.specialties.map((sp) => (
                    <Badge key={sp} tone="neutral" size="sm">
                      {sp}
                    </Badge>
                  ))}
                  {expert.modes.map((m) => (
                    <Badge key={m} tone="info" size="sm">
                      {content.consultationModes[m]}
                    </Badge>
                  ))}
                </Inline>
                <div>
                  {bookingAction ?? (
                    <Button variant="secondary" isDisabled>
                      {content.expertBookingSoon}
                    </Button>
                  )}
                </div>
              </Stack>
            </div>
          </Section>
        </Surface>

        <Surface>
          <Section>
            <Stack gap="4">
              <Stack gap="2">
                <Heading level={3}>{content.expertIntroHeading}</Heading>
                <Text as="p" leading="text">
                  {expert.intro}
                </Text>
              </Stack>
              <Stack gap="2">
                <Heading level={3}>{content.expertAboutHeading}</Heading>
                <Text as="p" tone="muted" leading="text">
                  {about}
                </Text>
              </Stack>
              <Stack gap="2">
                <Heading level={3}>{content.expertEducationHeading}</Heading>
                <ul className={styles.educationList}>
                  {education.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </Stack>
            </Stack>
          </Section>
        </Surface>

        <Stack gap="3">
          <Heading level={3}>{content.expertContentHeading}</Heading>
          <Tabs defaultSelectedKey="all">
            <TabList aria-label={content.expertContentHeading}>
              <Tab id="all" badge={authoredContent.length}>
                {content.allTypesLabel}
              </Tab>
              <Tab id="articles" badge={articles.length}>
                {content.contentTypes.article}
              </Tab>
              <Tab id="posts" badge={posts.length}>
                {content.contentTypes.post}
              </Tab>
            </TabList>
            <TabPanel id="all">
              <div className={styles.feedGrid}>
                {authoredContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </TabPanel>
            <TabPanel id="articles">
              <div className={styles.feedGrid}>
                {articles.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </TabPanel>
            <TabPanel id="posts">
              <div className={styles.feedGrid}>
                {posts.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </Stack>
      </Stack>
    </article>
  );
}

/* ── WriterWorkspace & ReviewQueue ───────────────────────────────────────────────────── */
export interface WriterDocument {
  id: string;
  title: string;
  summary: string;
  body: string;
  previousBody?: string | undefined;
  status: ReviewStatus;
  updatedAt: DateInput;
  scheduledDate?: string | null | undefined;
  scheduledTime?: string | null | undefined;
  reviewerNote?: string | undefined;
}

export interface WriterWorkspaceProps {
  documents: readonly WriterDocument[];
  /** Optional consumer block editor (e.g. Tiptap per Q-04); falls back to accessible TextArea. */
  editorSlot?: ReactNode | undefined;
  onStatusAction?: ((id: string, nextStatus: ReviewStatus) => void) | undefined;
  onRestoreRevision?: ((id: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Contributor / Expert workspace: content list with 5-state review badges, editor shell, DiffView revisions, and Jalali scheduler. */
export function WriterWorkspace({
  documents,
  editorSlot,
  onStatusAction,
  onRestoreRevision,
  className,
  ref,
}: WriterWorkspaceProps) {
  const { content } = usePatternMessages();
  const [activeId, setActiveId] = useState(documents[0]?.id ?? '');
  const activeDoc = documents.find((d) => d.id === activeId) ?? documents[0];
  const [draftTitle, setDraftTitle] = useState(activeDoc?.title ?? '');
  const [draftSummary, setDraftSummary] = useState(activeDoc?.summary ?? '');
  const [draftBody, setDraftBody] = useState(activeDoc?.body ?? '');
  const [scheduleDate, setScheduleDate] = useState<string | null>(activeDoc?.scheduledDate ?? null);
  const [scheduleTime, setScheduleTime] = useState<string | null>(activeDoc?.scheduledTime ?? '09:00');

  const selectDoc = (doc: WriterDocument) => {
    setActiveId(doc.id);
    setDraftTitle(doc.title);
    setDraftSummary(doc.summary);
    setDraftBody(doc.body);
    setScheduleDate(doc.scheduledDate ?? null);
    setScheduleTime(doc.scheduledTime ?? '09:00');
  };

  return (
    <section
      ref={ref}
      data-nds="WriterWorkspace"
      aria-label={content.writerWorkspaceTitle}
      className={className}
    >
      <Stack gap="4">
        <Heading level={2}>{content.writerWorkspaceTitle}</Heading>
        <div className={styles.workspaceSplit}>
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{content.writerListHeading}</Heading>
                <ul className={styles.workspaceList}>
                  {documents.map((doc) => (
                    <li key={doc.id}>
                      <button
                        type="button"
                        className={styles.workspaceItemBtn}
                        aria-current={doc.id === activeDoc?.id ? 'true' : undefined}
                        onClick={() => selectDoc(doc)}
                      >
                        <Text weight="semibold" size="sm">
                          {doc.title}
                        </Text>
                        <Inline gap="2">
                          <StatusBadge domain="review" status={doc.status} size="sm" />
                          <Text size="xs" tone="subtle">
                            {formatDate(doc.updatedAt)}
                          </Text>
                        </Inline>
                      </button>
                    </li>
                  ))}
                </ul>
              </Stack>
            </Section>
          </Surface>

          {activeDoc && (
            <Stack gap="4">
              <Surface>
                <Section>
                  <Stack gap="4">
                    <Inline gap="2">
                      <Heading level={3}>{content.writerEditorHeading}</Heading>
                      <StatusBadge domain="review" status={activeDoc.status} />
                    </Inline>
                    {activeDoc.reviewerNote && (
                      <InlineAlert tone="warning" title={content.reviewNotesLabel}>
                        {activeDoc.reviewerNote}
                      </InlineAlert>
                    )}
                    <TextField
                      label={content.writerTitleLabel}
                      value={draftTitle}
                      onChange={setDraftTitle}
                    />
                    <TextField
                      label={content.writerSummaryLabel}
                      value={draftSummary}
                      onChange={setDraftSummary}
                    />
                    {editorSlot ?? (
                      <TextArea
                        label={content.writerBodyLabel}
                        value={draftBody}
                        onChange={setDraftBody}
                      />
                    )}
                    <div className={styles.scheduleGrid}>
                      <DatePicker
                        label={content.writerScheduleDateLabel}
                        value={scheduleDate}
                        onChange={setScheduleDate}
                      />
                      <TimeField
                        label={content.writerScheduleTimeLabel}
                        value={scheduleTime}
                        onChange={setScheduleTime}
                      />
                    </div>
                    <Inline gap="2">
                      <Button
                        variant="secondary"
                        iconStart={iconEdit}
                        onPress={() => onStatusAction?.(activeDoc.id, 'draft')}
                      >
                        {content.writerSaveDraft}
                      </Button>
                      <Button
                        variant="primary"
                        onPress={() => onStatusAction?.(activeDoc.id, 'submitted')}
                      >
                        {content.writerSubmitReview}
                      </Button>
                      <Button
                        variant="secondary"
                        onPress={() => onStatusAction?.(activeDoc.id, 'scheduled')}
                      >
                        {content.writerSchedule}
                      </Button>
                      {activeDoc.status === 'published' ? (
                        <Button
                          variant="ghost"
                          onPress={() => onStatusAction?.(activeDoc.id, 'unpublished')}
                        >
                          {content.writerUnpublish}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          iconStart={iconCheck}
                          onPress={() => onStatusAction?.(activeDoc.id, 'published')}
                        >
                          {content.writerPublish}
                        </Button>
                      )}
                    </Inline>
                  </Stack>
                </Section>
              </Surface>

              {activeDoc.previousBody !== undefined && (
                <Surface>
                  <Section>
                    <Stack gap="3">
                      <Inline gap="3">
                        <Heading level={3}>{content.writerRevisionsHeading}</Heading>
                        {onRestoreRevision && (
                          <Button
                            variant="secondary"
                            onPress={() => onRestoreRevision(activeDoc.id)}
                          >
                            {content.writerRestoreRevision}
                          </Button>
                        )}
                      </Inline>
                      <DiffView
                        before={activeDoc.previousBody}
                        after={draftBody}
                        aria-label={`${content.writerRevisionsHeading}: ${activeDoc.title}`}
                      />
                    </Stack>
                  </Section>
                </Surface>
              )}
            </Stack>
          )}
        </div>
      </Stack>
    </section>
  );
}

export interface ReviewQueueItem {
  id: string;
  title: string;
  authorName: string;
  status: ReviewStatus;
  submittedAt: DateInput;
  beforeText: string;
  afterText: string;
}

export interface ReviewQueueProps {
  items: readonly ReviewQueueItem[];
  onApprove?: ((id: string, note: string) => void) | undefined;
  onRequestChanges?: ((id: string, note: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Editor review queue with item switcher, revision diff, notes to author, and approve/request-changes actions. */
export function ReviewQueue({
  items,
  onApprove,
  onRequestChanges,
  className,
  ref,
}: ReviewQueueProps) {
  const { content } = usePatternMessages();
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [note, setNote] = useState('');
  const active = items.find((i) => i.id === activeId) ?? items[0];

  return (
    <section
      ref={ref}
      data-nds="ReviewQueue"
      aria-label={content.reviewQueueTitle}
      className={className}
    >
      <Stack gap="4">
        <Heading level={2}>{content.reviewQueueTitle}</Heading>
        {items.length === 0 ? (
          <EmptyState icon={iconCheck} title={content.reviewEmptyTitle} />
        ) : (
          <div className={styles.workspaceSplit}>
            <Surface>
              <Section>
                <ul className={styles.workspaceList}>
                  {items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={styles.workspaceItemBtn}
                        aria-current={item.id === active?.id ? 'true' : undefined}
                        onClick={() => {
                          setActiveId(item.id);
                          setNote('');
                        }}
                      >
                        <Text weight="semibold" size="sm">
                          {item.title}
                        </Text>
                        <Inline gap="2">
                          <StatusBadge domain="review" status={item.status} size="sm" />
                          <Text size="xs" tone="subtle">
                            {item.authorName}
                          </Text>
                        </Inline>
                      </button>
                    </li>
                  ))}
                </ul>
              </Section>
            </Surface>

            {active && (
              <Surface>
                <Section>
                  <Stack gap="4">
                    <Inline gap="2">
                      <Heading level={3}>{active.title}</Heading>
                      <StatusBadge domain="review" status={active.status} />
                    </Inline>
                    <Text size="xs" tone="subtle">
                      {`${active.authorName} · ${formatDateTime(active.submittedAt)}`}
                    </Text>
                    <DiffView
                      before={active.beforeText}
                      after={active.afterText}
                      aria-label={`${content.reviewQueueTitle}: ${active.title}`}
                    />
                    <TextArea
                      label={content.reviewNotesLabel}
                      placeholder={content.reviewNotesPlaceholder}
                      value={note}
                      onChange={setNote}
                    />
                    <Inline gap="3">
                      <Button
                        variant="primary"
                        iconStart={iconCheck}
                        onPress={() => onApprove?.(active.id, note)}
                      >
                        {content.reviewApprove}
                      </Button>
                      <Button
                        variant="secondary"
                        isDisabled={note.trim().length === 0}
                        onPress={() => onRequestChanges?.(active.id, note.trim())}
                      >
                        {content.reviewRequestChanges}
                      </Button>
                    </Inline>
                  </Stack>
                </Section>
              </Surface>
            )}
          </div>
        )}
      </Stack>
    </section>
  );
}

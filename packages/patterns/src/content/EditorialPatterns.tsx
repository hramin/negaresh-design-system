import {
  iconArrowEnd,
  iconArrowStart,
  iconBook,
  iconPlay,
  iconShare,
} from '@negaresh/icons';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardMedia,
  Checkbox,
  CheckboxGroup,
  CopyButton,
  Divider,
  EmptyState,
  FilterBar,
  Heading,
  IconButton,
  Image,
  Inline,
  InlineAlert,
  Link,
  LoadMore,
  Radio,
  RadioGroup,
  Section,
  Select,
  SelectItem,
  Stack,
  Surface,
  Text,
  VerifiedBadge,
} from '@negaresh/react';
import { type DateInput, formatDate, formatNumber, formatPercent } from '@negaresh/utils';
import { type Ref, useMemo, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './content.module.css';

/* ── Poll ────────────────────────────────────────────────────────────────────────────── */
export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface PollProps {
  question: string;
  options: readonly PollOption[];
  mode?: 'single' | 'multiple' | undefined;
  status?: 'open' | 'closed' | undefined;
  /** Show vote percentages even before the user votes. Default `false` (shown after vote or when closed). */
  showResultsBeforeVote?: boolean | undefined;
  /** Optional clinical/expert note revealed after voting or when closed. */
  expertNote?: string | undefined;
  defaultVotedOptionIds?: readonly string[] | undefined;
  onVote?: ((optionIds: string[]) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Interactive poll pattern supporting single/multiple choice, open/closed states, and post-vote expert note. */
export function Poll({
  question,
  options,
  mode = 'single',
  status = 'open',
  showResultsBeforeVote = false,
  expertNote,
  defaultVotedOptionIds = [],
  onVote,
  className,
  ref,
}: PollProps) {
  const { content } = usePatternMessages();
  const [selected, setSelected] = useState<string[]>([...defaultVotedOptionIds]);
  const [hasVoted, setHasVoted] = useState(defaultVotedOptionIds.length > 0);
  const [extraVotes, setExtraVotes] = useState<Record<string, number>>({});

  const showResults = status === 'closed' || hasVoted || showResultsBeforeVote;
  const effectiveOptions = options.map((o) => ({
    ...o,
    votes: o.votes + (extraVotes[o.id] ?? 0),
  }));
  const totalVotes = effectiveOptions.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = () => {
    if (selected.length === 0 || status === 'closed') return;
    setExtraVotes((prev) => {
      const next = { ...prev };
      for (const id of selected) next[id] = (next[id] ?? 0) + 1;
      return next;
    });
    setHasVoted(true);
    onVote?.(selected);
  };

  return (
    <Surface ref={ref} data-nds="Poll" className={className}>
      <Section>
        <Stack gap="4">
          <Inline gap="2">
            <Badge tone={status === 'open' ? 'accent' : 'neutral'} size="sm">
              {status === 'open' ? content.pollOpenBadge : content.pollClosedBadge}
            </Badge>
            <Text size="xs" tone="subtle">
              {content.pollTotalVotes(totalVotes)}
            </Text>
          </Inline>
          <Heading level={3}>{question}</Heading>

          {!hasVoted && status === 'open' && (
            <Stack gap="3">
              {mode === 'single' ? (
                <RadioGroup
                  label={question}
                  value={selected[0] ?? ''}
                  onChange={(v) => setSelected([v])}
                >
                  {options.map((o) => (
                    <Radio key={o.id} value={o.id}>
                      {o.label}
                    </Radio>
                  ))}
                </RadioGroup>
              ) : (
                <CheckboxGroup label={question} value={selected} onChange={setSelected}>
                  {options.map((o) => (
                    <Checkbox key={o.id} value={o.id}>
                      {o.label}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
              <Inline gap="2">
                <Button
                  variant="primary"
                  size="sm"
                  isDisabled={selected.length === 0}
                  onPress={handleVote}
                >
                  {content.pollVoteButton}
                </Button>
              </Inline>
            </Stack>
          )}

          {hasVoted && (
            <div role="status" aria-live="polite">
              <Text size="sm" tone="muted">
                {content.pollVotedAnnouncement}
              </Text>
            </div>
          )}

          {showResults && (
            <Stack gap="3">
              {effectiveOptions.map((o) => {
                const ratio = totalVotes > 0 ? o.votes / totalVotes : 0;
                const percent = Math.round(ratio * 100);
                return (
                  <div key={o.id} className={styles.pollResultRow}>
                    <div className={styles.pollResultHead}>
                      <span>{o.label}</span>
                      <span>{formatPercent(percent)}</span>
                    </div>
                    <div className={styles.pollBarTrack}>
                      <div
                        className={styles.pollBarFill}
                        style={{ inlineSize: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </Stack>
          )}

          {expertNote && (hasVoted || status === 'closed') && (
            <InlineAlert tone="info" title={content.pollExpertNoteHeading}>
              {expertNote}
            </InlineAlert>
          )}
        </Stack>
      </Section>
    </Surface>
  );
}

/* ── ContentCard ×4 ──────────────────────────────────────────────────────────────────── */
export type ContentCardVariant = 'article' | 'post' | 'quote' | 'poll';

export interface ArticleCardData {
  id: string;
  variant: 'article';
  title: string;
  summary: string;
  category: string;
  authorName: string;
  publishedAt: DateInput;
  readingMinutes: number;
  imageSrc: string;
  imageAlt: string;
  href?: string | undefined;
}

export interface PostCardData {
  id: string;
  variant: 'post';
  title: string;
  excerpt: string;
  category?: string | undefined;
  authorName: string;
  publishedAt: DateInput;
  imageSrc?: string | undefined;
  imageAlt?: string | undefined;
  href?: string | undefined;
}

export interface QuoteCardData {
  id: string;
  variant: 'quote';
  quote: string;
  source: string;
  category?: string | undefined;
  authorName: string;
}

export interface PollCardData {
  id: string;
  variant: 'poll';
  category?: string | undefined;
  authorName: string;
  poll: Omit<PollProps, 'className' | 'ref'>;
}

export type ContentCardItem = ArticleCardData | PostCardData | QuoteCardData | PollCardData;

export interface ContentCardProps {
  item: ContentCardItem;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Four-variant magazine card: `article`, `post`, `quote` (calm minimal, D-77), and `poll`. */
export function ContentCard({ item, className, ref }: ContentCardProps) {
  const { content } = usePatternMessages();

  if (item.variant === 'quote') {
    return (
      <article ref={ref} data-nds="ContentCard" data-variant="quote" className={cx(styles.quoteCard, className)}>
        <Inline gap="2">
          <Badge tone="neutral" size="sm">
            {content.contentTypes.quote}
          </Badge>
          {item.category && (
            <Badge tone="accent" size="sm">
              {item.category}
            </Badge>
          )}
        </Inline>
        <blockquote className={styles.quoteText}>{item.quote}</blockquote>
        <footer className={styles.quoteSource}>— {item.source}</footer>
      </article>
    );
  }

  if (item.variant === 'poll') {
    return (
      <div ref={ref as Ref<HTMLDivElement>} data-nds="ContentCard" data-variant="poll" className={className}>
        <Poll {...item.poll} />
      </div>
    );
  }

  if (item.variant === 'post') {
    return (
      <Card ref={ref} data-nds="ContentCard" className={className}>
        {item.imageSrc && (
          <CardMedia>
            <Image src={item.imageSrc} alt={item.imageAlt ?? item.title} ratio="16/9" />
          </CardMedia>
        )}
        <CardBody>
          <Stack gap="2">
            <Inline gap="2">
              <Badge tone="neutral" size="sm">
                {content.contentTypes.post}
              </Badge>
              {item.category && (
                <Badge tone="info" size="sm">
                  {item.category}
                </Badge>
              )}
            </Inline>
            <Heading level={3}>
              {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
            </Heading>
            <Text as="p" size="sm" tone="muted" leading="text">
              {item.excerpt}
            </Text>
          </Stack>
        </CardBody>
        <CardFooter tone="sunken">
          <Inline gap="3">
            <Text size="xs" tone="subtle">
              {item.authorName}
            </Text>
            <Text size="xs" tone="subtle">
              {formatDate(item.publishedAt)}
            </Text>
          </Inline>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card ref={ref} data-nds="ContentCard" className={className}>
      <CardMedia>
        <Image src={item.imageSrc} alt={item.imageAlt} ratio="16/9" />
      </CardMedia>
      <CardBody>
        <Stack gap="2">
          <Inline gap="2">
            <Badge tone="accent" size="sm">
              {content.contentTypes.article}
            </Badge>
            <Badge tone="neutral" size="sm">
              {item.category}
            </Badge>
          </Inline>
          <Heading level={3}>
            {item.href ? <Link href={item.href}>{item.title}</Link> : item.title}
          </Heading>
          <Text as="p" size="sm" tone="muted" leading="text">
            {item.summary}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter tone="sunken">
        <Inline gap="3">
          <Text size="xs" tone="subtle">
            {item.authorName}
          </Text>
          <Text size="xs" tone="subtle">
            {formatDate(item.publishedAt)}
          </Text>
          <Text size="xs" tone="subtle">
            {content.readingTime(item.readingMinutes)}
          </Text>
        </Inline>
      </CardFooter>
    </Card>
  );
}

/* ── BlogFeed ────────────────────────────────────────────────────────────────────────── */
export interface FeaturedSlide {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  href?: string | undefined;
}

export interface FeedAuthor {
  id: string;
  name: string;
  avatarSrc?: string | undefined;
  isVerified?: boolean | undefined;
}

export interface BlogFeedProps {
  /** Up to 5 featured slides. */
  featured: readonly FeaturedSlide[];
  authors: readonly FeedAuthor[];
  items: readonly ContentCardItem[];
  hasMore?: boolean | undefined;
  onLoadMore?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Magazine feed with accessible featured slider (≤ 5), authors strip, filters, mixed 4-type cards, and LoadMore. */
export function BlogFeed({
  featured,
  authors,
  items,
  hasMore = false,
  onLoadMore,
  className,
  ref,
}: BlogFeedProps) {
  const { content } = usePatternMessages();
  const slides = featured.slice(0, 5);
  const [slideIndex, setSlideIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');

  const activeSlide = slides[slideIndex] ?? slides[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (selectedType !== 'all' && item.variant !== selectedType) return false;
      if (selectedAuthor !== 'all' && item.authorName !== selectedAuthor) return false;
      if (!q) return true;
      const text =
        item.variant === 'article'
          ? `${item.title} ${item.summary} ${item.authorName}`
          : item.variant === 'post'
            ? `${item.title} ${item.excerpt} ${item.authorName}`
            : item.variant === 'quote'
              ? `${item.quote} ${item.source}`
              : item.poll.question;
      return text.toLowerCase().includes(q);
    });
  }, [items, query, selectedType, selectedAuthor]);

  return (
    <section
      ref={ref}
      data-nds="BlogFeed"
      aria-label={content.featuredSliderLabel}
      className={className}
    >
      <Stack gap="6">
        {activeSlide && (
          <section className={styles.slider} aria-label={content.featuredSliderLabel}>
            <div className={styles.sliderBody}>
              <Image src={activeSlide.imageSrc} alt={activeSlide.imageAlt} ratio="16/9" radius="md" />
              <Stack gap="3">
                <Inline gap="2">
                  <Badge tone="accent" size="sm">
                    {activeSlide.category}
                  </Badge>
                </Inline>
                <Heading level={2}>
                  {activeSlide.href ? (
                    <Link href={activeSlide.href}>{activeSlide.title}</Link>
                  ) : (
                    activeSlide.title
                  )}
                </Heading>
                <Text as="p" tone="muted" leading="text">
                  {activeSlide.summary}
                </Text>
              </Stack>
            </div>

            {slides.length > 1 && (
              <div className={styles.sliderControls}>
                <Inline gap="2">
                  <IconButton
                    variant="secondary"
                    icon={iconArrowStart}
                    aria-label={content.previousSlide}
                    onPress={() =>
                      setSlideIndex((i) => (i - 1 + slides.length) % slides.length)
                    }
                  />
                  <IconButton
                    variant="secondary"
                    icon={iconArrowEnd}
                    aria-label={content.nextSlide}
                    onPress={() => setSlideIndex((i) => (i + 1) % slides.length)}
                  />
                </Inline>
                <div className={styles.sliderDots}>
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      className={styles.sliderDot}
                      aria-pressed={idx === slideIndex}
                      aria-label={content.slideIndicator(idx + 1, slides.length)}
                      onClick={() => setSlideIndex(idx)}
                    >
                      {formatNumber(idx + 1, { maximumFractionDigits: 0 })}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {authors.length > 0 && (
          <Stack gap="2">
            <Text size="sm" weight="semibold" tone="muted">
              {content.authorsStripLabel}
            </Text>
            <ul className={styles.authorsStrip}>
              {authors.map((a) => (
                <li key={a.id} className={styles.authorChip}>
                  <Avatar
                    name={a.name}
                    size="sm"
                    {...(a.avatarSrc !== undefined ? { src: a.avatarSrc } : {})}
                  />
                  <span>{a.name}</span>
                  {a.isVerified && <VerifiedBadge size="sm" />}
                </li>
              ))}
            </ul>
          </Stack>
        )}

        <FilterBar
          aria-label={content.featuredSliderLabel}
          searchValue={query}
          onSearchChange={setQuery}
          onReset={() => {
            setQuery('');
            setSelectedType('all');
            setSelectedAuthor('all');
          }}
          filters={
            <Inline gap="3">
              <Select
                label={content.allTypesLabel}
                value={selectedType}
                onChange={(k) => setSelectedType(String(k ?? 'all'))}
              >
                <SelectItem id="all" textValue={content.allTypesLabel}>
                  {content.allTypesLabel}
                </SelectItem>
                <SelectItem id="article" textValue={content.contentTypes.article}>
                  {content.contentTypes.article}
                </SelectItem>
                <SelectItem id="post" textValue={content.contentTypes.post}>
                  {content.contentTypes.post}
                </SelectItem>
                <SelectItem id="quote" textValue={content.contentTypes.quote}>
                  {content.contentTypes.quote}
                </SelectItem>
                <SelectItem id="poll" textValue={content.contentTypes.poll}>
                  {content.contentTypes.poll}
                </SelectItem>
              </Select>
              <Select
                label={content.authorsStripLabel}
                value={selectedAuthor}
                onChange={(k) => setSelectedAuthor(String(k ?? 'all'))}
              >
                <SelectItem id="all" textValue={content.allOptionLabel}>
                  {content.allOptionLabel}
                </SelectItem>
                {authors.map((a) => (
                  <SelectItem key={a.id} id={a.name} textValue={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </Select>
            </Inline>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={iconBook}
            title={content.feedEmptyTitle}
            description={content.feedEmptyDescription}
          />
        ) : (
          <div className={styles.feedGrid}>
            {filtered.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {hasMore && onLoadMore && (
          <LoadMore
            loaded={filtered.length}
            total={filtered.length + 1}
            onLoadMore={onLoadMore}
          />
        )}
      </Stack>
    </section>
  );
}

/* ── ContentBlocks ───────────────────────────────────────────────────────────────────── */
export type CalloutBoxKind = 'note' | 'tip' | 'warning' | 'important';
export type ContentCalloutKind = 'key-takeaway' | 'pull-quote' | 'linked-card';

export type ContentBlock =
  | { id: string; type: 'paragraph'; text: string }
  | { id: string; type: 'heading'; level: 2 | 3 | 4; text: string; anchor?: string | undefined }
  | { id: string; type: 'image'; src: string; alt: string; caption?: string | undefined }
  | { id: string; type: 'gallery'; images: readonly { id: string; src: string; alt: string }[] }
  | { id: string; type: 'table'; caption: string; headers: readonly string[]; rows: readonly (readonly string[])[] }
  | { id: string; type: 'quote'; text: string; source?: string | undefined }
  | { id: string; type: 'faq'; items: readonly { id: string; question: string; answer: string }[] }
  | { id: string; type: 'video'; posterSrc: string; posterAlt: string; title: string; caption?: string | undefined }
  | { id: string; type: 'callout-box'; kind: CalloutBoxKind; title?: string | undefined; text: string }
  | { id: string; type: 'content-callout'; kind: ContentCalloutKind; title?: string | undefined; text: string; href?: string | undefined }
  | { id: string; type: 'divider' };

export interface ContentBlocksProps {
  blocks: readonly ContentBlock[];
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Structured JSON content block renderer covering all 11 editorial block primitives (incl. CalloutBox ×4 & ContentCallout ×3). */
export function ContentBlocks({ blocks, className, ref }: ContentBlocksProps) {
  const { content } = usePatternMessages();

  return (
    <div ref={ref} data-nds="ContentBlocks" className={cx(styles.blocks, className)}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.id} className={styles.blockParagraph}>
                {block.text}
              </p>
            );
          case 'heading':
            return (
              <Heading
                key={block.id}
                level={block.level}
                {...(block.anchor !== undefined ? { id: block.anchor } : {})}
              >
                {block.text}
              </Heading>
            );
          case 'image':
            return (
              <Image
                key={block.id}
                src={block.src}
                alt={block.alt}
                ratio="16/9"
                radius="md"
                {...(block.caption !== undefined ? { caption: block.caption } : {})}
              />
            );
          case 'gallery':
            return (
              <div key={block.id} className={styles.blockGallery}>
                {block.images.map((img) => (
                  <Image key={img.id} src={img.src} alt={img.alt} ratio="4/3" radius="sm" />
                ))}
              </div>
            );
          case 'table':
            return (
              <div key={block.id} className={styles.blockTableWrap}>
                <table className={styles.blockTable}>
                  <caption>{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.headers.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={`${block.id}-${row.join('|')}`}>
                        {row.map((cell, colIndex) => (
                          <td key={`${block.id}-${block.headers[colIndex] ?? colIndex}-${cell}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'quote':
            return (
              <blockquote key={block.id} className={styles.quoteCard}>
                <p className={styles.quoteText}>{block.text}</p>
                {block.source && <footer className={styles.quoteSource}>— {block.source}</footer>}
              </blockquote>
            );
          case 'faq':
            return (
              <Accordion key={block.id}>
                {block.items.map((faq) => (
                  <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
                    <Text as="p" tone="muted" leading="text">
                      {faq.answer}
                    </Text>
                  </AccordionItem>
                ))}
              </Accordion>
            );
          case 'video':
            return (
              <figure key={block.id} className={styles.videoFrame}>
                <div className={styles.videoPoster}>
                  <Image src={block.posterSrc} alt={block.posterAlt} ratio="16/9" />
                </div>
                <figcaption className={styles.videoCaption}>
                  <Inline gap="2">
                    <Badge tone="neutral" size="sm" icon={iconPlay}>
                      {block.title}
                    </Badge>
                    {block.caption && <span>{block.caption}</span>}
                  </Inline>
                </figcaption>
              </figure>
            );
          case 'callout-box': {
            const tone =
              block.kind === 'warning'
                ? 'warning'
                : block.kind === 'tip'
                  ? 'success'
                  : block.kind === 'important'
                    ? 'danger'
                    : 'info';
            return (
              <InlineAlert
                key={block.id}
                tone={tone}
                title={block.title ?? content.calloutTitles[block.kind]}
              >
                {block.text}
              </InlineAlert>
            );
          }
          case 'content-callout':
            return (
              <aside key={block.id} className={styles.contentCallout}>
                <Badge tone="accent" size="sm">
                  {content.contentCalloutLabels[block.kind]}
                </Badge>
                {block.title && <Heading level={4}>{block.title}</Heading>}
                <Text as="p" leading="text">
                  {block.text}
                </Text>
                {block.href && <Link href={block.href}>{block.title ?? block.text}</Link>}
              </aside>
            );
          case 'divider':
            return <Divider key={block.id} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ── ArticlePage ─────────────────────────────────────────────────────────────────────── */
export interface ArticleAuthor {
  name: string;
  title: string;
  bio: string;
  avatarSrc?: string | undefined;
  isVerified?: boolean | undefined;
}

export interface ArticlePageProps {
  title: string;
  summary: string;
  category: string;
  author: ArticleAuthor;
  coAuthors?: readonly string[] | undefined;
  reviewedBy?: string | undefined;
  publishedAt: DateInput;
  updatedAt?: DateInput | undefined;
  readingMinutes: number;
  shareUrl: string;
  blocks: readonly ContentBlock[];
  disclaimer?: string | undefined;
  related?: readonly ContentCardItem[] | undefined;
  onShare?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Complete editorial article page with clinical byline, TOC, ContentBlocks, disclaimer, author card, share bar, and related items. */
export function ArticlePage({
  title,
  summary,
  category,
  author,
  coAuthors,
  reviewedBy,
  publishedAt,
  updatedAt,
  readingMinutes,
  shareUrl,
  blocks,
  disclaimer,
  related,
  onShare,
  className,
  ref,
}: ArticlePageProps) {
  const { content } = usePatternMessages();
  const headings = blocks.filter(
    (b): b is Extract<ContentBlock, { type: 'heading' }> => b.type === 'heading',
  );

  return (
    <article ref={ref} data-nds="ArticlePage" className={className}>
      <Stack gap="6">
        <Surface>
          <Section>
            <Stack gap="4">
              <Inline gap="2">
                <Badge tone="accent" size="sm">
                  {category}
                </Badge>
                <Text size="xs" tone="subtle">
                  {content.readingTime(readingMinutes)}
                </Text>
              </Inline>
              <Heading level={2}>{title}</Heading>
              <Text as="p" size="lg" tone="muted" leading="text">
                {summary}
              </Text>
              <Inline gap="3">
                <Avatar
                  name={author.name}
                  size="md"
                  {...(author.avatarSrc !== undefined ? { src: author.avatarSrc } : {})}
                />
                <Stack gap="1">
                  <Inline gap="2">
                    <Text weight="semibold">{author.name}</Text>
                    {author.isVerified && <VerifiedBadge size="sm" />}
                  </Inline>
                  <Text size="xs" tone="muted">
                    {author.title}
                  </Text>
                </Stack>
              </Inline>
              <Inline gap="4">
                <Text size="xs" tone="subtle">
                  {`${content.publishedAtLabel}: ${formatDate(publishedAt)}`}
                </Text>
                {updatedAt && (
                  <Text size="xs" tone="subtle">
                    {`${content.updatedAtLabel}: ${formatDate(updatedAt)}`}
                  </Text>
                )}
                {coAuthors && coAuthors.length > 0 && (
                  <Text size="xs" tone="subtle">
                    {`${content.coAuthorsLabel}: ${coAuthors.join('، ')}`}
                  </Text>
                )}
                {reviewedBy && (
                  <Text size="xs" tone="subtle">
                    {`${content.reviewedByLabel}: ${reviewedBy}`}
                  </Text>
                )}
              </Inline>
            </Stack>
          </Section>
        </Surface>

        <div className={styles.articleLayout}>
          {headings.length > 0 && (
            <nav className={styles.tocNav} aria-label={content.tocHeading}>
              <Stack gap="2">
                <Text size="sm" weight="semibold">
                  {content.tocHeading}
                </Text>
                <ul className={styles.tocList}>
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.anchor ?? h.id}`} className={styles.tocLink}>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </Stack>
            </nav>
          )}

          <Stack gap="5">
            <ContentBlocks blocks={blocks} />

            {disclaimer && (
              <InlineAlert tone="info" title={content.disclaimerHeading}>
                {disclaimer}
              </InlineAlert>
            )}

            <Surface>
              <Section>
                <Stack gap="3">
                  <Heading level={3}>{content.authorCardHeading}</Heading>
                  <Inline gap="3">
                    <Avatar
                      name={author.name}
                      size="lg"
                      {...(author.avatarSrc !== undefined ? { src: author.avatarSrc } : {})}
                    />
                    <Stack gap="1">
                      <Inline gap="2">
                        <Text weight="semibold">{author.name}</Text>
                        {author.isVerified && <VerifiedBadge size="sm" />}
                      </Inline>
                      <Text size="sm" tone="muted">
                        {author.title}
                      </Text>
                    </Stack>
                  </Inline>
                  <Text as="p" size="sm" tone="muted" leading="text">
                    {author.bio}
                  </Text>
                </Stack>
              </Section>
            </Surface>

            <Inline gap="3">
              <Text size="sm" weight="semibold">
                {content.shareHeading}
              </Text>
              <CopyButton value={shareUrl} size="sm" variant="secondary">
                {content.copyArticleLink}
              </CopyButton>
              {onShare && (
                <Button size="sm" variant="ghost" iconStart={iconShare} onPress={onShare}>
                  {content.shareHeading}
                </Button>
              )}
            </Inline>
          </Stack>
        </div>

        {related && related.length > 0 && (
          <Stack gap="3">
            <Heading level={3}>{content.relatedHeading}</Heading>
            <div className={styles.feedGrid}>
              {related.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </article>
  );
}

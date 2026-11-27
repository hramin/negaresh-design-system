import {
  iconArrowEnd,
  iconArrowStart,
  iconCheck,
  iconCourse,
  iconLock,
  iconPlay,
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
  EmptyState,
  Heading,
  Icon,
  Image,
  Inline,
  InlineAlert,
  ProgressBar,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  Surface,
  Text,
  ToggleButton,
  VerifiedBadge,
} from '@negaresh/react';
import { formatPercent } from '@negaresh/utils';
import { type ReactNode, type Ref, useState } from 'react';
import { Price } from '../commerce/Price.tsx';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './courses.module.css';

export interface CourseProgressProps {
  completedLessons: number;
  totalLessons: number;
  /** Completion threshold percentage (Negaresh PRD: 90%). Default `90`. */
  completionThreshold?: number | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Course progress indicator implementing the 90% completion threshold rule. */
export function CourseProgress({
  completedLessons,
  totalLessons,
  completionThreshold = 90,
  className,
  ref,
}: CourseProgressProps) {
  const { courses } = usePatternMessages();
  const safeTotal = Math.max(1, totalLessons);
  const safeCompleted = Math.min(Math.max(0, completedLessons), safeTotal);
  const percent = Math.round((safeCompleted / safeTotal) * 100);
  const isCompleted = percent >= completionThreshold;

  return (
    <div ref={ref} data-nds="CourseProgress" className={className}>
      <Stack gap="2">
        <Inline gap="2">
          <Badge tone={isCompleted ? 'success' : 'accent'} size="sm">
            {isCompleted ? courses.completedBadge : courses.inProgressBadge}
          </Badge>
          <Text size="xs" tone="muted">
            {courses.completedLessons(safeCompleted, safeTotal)}
          </Text>
        </Inline>
        <ProgressBar
          label={courses.progressLabel}
          value={percent}
          valueLabel={formatPercent(percent)}
        />
        <Text size="xs" tone="subtle">
          {courses.completionRuleNote(completionThreshold)}
        </Text>
      </Stack>
    </div>
  );
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  isCompleted?: boolean | undefined;
  isPreview?: boolean | undefined;
  isLocked?: boolean | undefined;
}

export interface CourseChapter {
  id: string;
  title: string;
  lessons: readonly CourseLesson[];
}

export interface LessonNavProps {
  chapters: readonly CourseChapter[];
  activeLessonId?: string | undefined;
  onSelectLesson?: ((lessonId: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Syllabus chapter & lesson navigation built on `Accordion` with `aria-current="page"` and explicit status icons/labels. */
export function LessonNav({
  chapters,
  activeLessonId,
  onSelectLesson,
  className,
  ref,
}: LessonNavProps) {
  const { courses } = usePatternMessages();

  return (
    <nav
      ref={ref}
      data-nds="LessonNav"
      aria-label={courses.lessonNavLabel}
      className={className}
    >
      <Accordion allowsMultipleExpanded defaultExpandedKeys={chapters.map((c) => c.id)}>
        {chapters.map((chapter) => (
          <AccordionItem key={chapter.id} id={chapter.id} title={chapter.title}>
            <ul className={styles.lessonList}>
              {chapter.lessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                const statusIcon = lesson.isLocked
                  ? iconLock
                  : lesson.isCompleted
                    ? iconCheck
                    : iconPlay;
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      className={styles.lessonBtn}
                      disabled={lesson.isLocked}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => onSelectLesson?.(lesson.id)}
                    >
                      <span className={styles.lessonTitleRow}>
                        <Icon icon={statusIcon} size="sm" />
                        <span>{lesson.title}</span>
                      </span>
                      <Inline gap="2">
                        {lesson.isPreview && (
                          <Badge tone="info" size="sm">
                            {courses.freePreviewBadge}
                          </Badge>
                        )}
                        {lesson.isCompleted && (
                          <Badge tone="success" size="sm">
                            {courses.completedLessonLabel}
                          </Badge>
                        )}
                        {lesson.isLocked && (
                          <Badge tone="neutral" size="sm">
                            {courses.lockedLessonLabel}
                          </Badge>
                        )}
                        <Text size="xs" tone="subtle">
                          {courses.durationMinutes(lesson.durationMinutes)}
                        </Text>
                      </Inline>
                    </button>
                  </li>
                );
              })}
            </ul>
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  );
}

const SPEED_OPTIONS = ['0.75x', '1x', '1.25x', '1.5x', '2x'] as const;

export interface CoursePlayerProps {
  courseTitle: string;
  lessonTitle: string;
  posterSrc: string;
  posterAlt: string;
  /** Optional custom `<video>` / HLS player node replacing the static poster frame. */
  mediaSlot?: ReactNode | undefined;
  chapters: readonly CourseChapter[];
  activeLessonId: string;
  completedLessons: number;
  totalLessons: number;
  resumeTimestamp?: string | undefined;
  isLessonCompleted?: boolean | undefined;
  onSelectLesson?: ((lessonId: string) => void) | undefined;
  onPreviousLesson?: (() => void) | undefined;
  onNextLesson?: (() => void) | undefined;
  onToggleComplete?: ((completed: boolean) => void) | undefined;
  onResume?: (() => void) | undefined;
  onSpeedChange?: ((speed: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Course player workspace: 16:9 media viewport, playback speed selector, resume notice, prev/next & complete controls, and `LessonNav`. */
export function CoursePlayer({
  courseTitle,
  lessonTitle,
  posterSrc,
  posterAlt,
  mediaSlot,
  chapters,
  activeLessonId,
  completedLessons,
  totalLessons,
  resumeTimestamp,
  isLessonCompleted = false,
  onSelectLesson,
  onPreviousLesson,
  onNextLesson,
  onToggleComplete,
  onResume,
  onSpeedChange,
  className,
  ref,
}: CoursePlayerProps) {
  const { courses } = usePatternMessages();
  const [speed, setSpeed] = useState<string>('1x');

  return (
    <section
      ref={ref}
      data-nds="CoursePlayer"
      aria-label={courseTitle}
      className={className}
    >
      <div className={styles.playerLayout}>
        <Stack gap="4">
          <div className={styles.videoViewport}>
            {mediaSlot ?? (
              <>
                <Image src={posterSrc} alt={posterAlt} ratio="16/9" />
                <div className={styles.videoOverlay}>
                  <Button
                    variant="primary"
                    iconStart={iconPlay}
                    {...(onResume !== undefined ? { onPress: onResume } : {})}
                  >
                    {courses.playLesson}
                  </Button>
                </div>
              </>
            )}
          </div>

          {resumeTimestamp && (
            <InlineAlert
              tone="info"
              title={lessonTitle}
              actions={
                onResume ? (
                  <Button size="sm" variant="secondary" onPress={onResume}>
                    {courses.resumeAction}
                  </Button>
                ) : undefined
              }
            >
              {courses.resumePrompt(resumeTimestamp)}
            </InlineAlert>
          )}

          <Surface>
            <Section>
              <Stack gap="4">
                <Heading level={2}>{lessonTitle}</Heading>
                <div className={styles.playerControls}>
                  <SegmentedControl
                    label={courses.playbackSpeedLabel}
                    size="sm"
                    value={speed}
                    onChange={(k) => {
                      const next = String(k);
                      setSpeed(next);
                      onSpeedChange?.(next);
                    }}
                  >
                    {SPEED_OPTIONS.map((opt) => (
                      <SegmentedControlItem key={opt} id={opt}>
                        <span dir="ltr">{opt}</span>
                      </SegmentedControlItem>
                    ))}
                  </SegmentedControl>

                  <Inline gap="2">
                    {onToggleComplete && (
                      <ToggleButton
                        size="sm"
                        isSelected={isLessonCompleted}
                        onChange={onToggleComplete}
                      >
                        <Icon icon={iconCheck} size="sm" />
                        {isLessonCompleted ? courses.markedComplete : courses.markComplete}
                      </ToggleButton>
                    )}
                    {onPreviousLesson && (
                      <Button
                        size="sm"
                        variant="secondary"
                        iconStart={iconArrowStart}
                        onPress={onPreviousLesson}
                      >
                        {courses.previousLesson}
                      </Button>
                    )}
                    {onNextLesson && (
                      <Button
                        size="sm"
                        variant="primary"
                        iconEnd={iconArrowEnd}
                        onPress={onNextLesson}
                      >
                        {courses.nextLesson}
                      </Button>
                    )}
                  </Inline>
                </div>
              </Stack>
            </Section>
          </Surface>
        </Stack>

        <Stack gap="4">
          <Surface>
            <Section>
              <CourseProgress completedLessons={completedLessons} totalLessons={totalLessons} />
            </Section>
          </Surface>
          <LessonNav
            chapters={chapters}
            activeLessonId={activeLessonId}
            {...(onSelectLesson !== undefined ? { onSelectLesson } : {})}
          />
        </Stack>
      </div>
    </section>
  );
}

export interface CourseInstructor {
  name: string;
  title: string;
  bio: string;
  avatarSrc?: string | undefined;
  isVerified?: boolean | undefined;
}

export interface CoursePageProps {
  title: string;
  summary: string;
  coverSrc: string;
  coverAlt: string;
  price: number;
  originalPrice?: number | undefined;
  instructor: CourseInstructor;
  chapters: readonly CourseChapter[];
  faqs?: readonly { id: string; question: string; answer: string }[] | undefined;
  onEnroll?: (() => void) | undefined;
  onPreviewLesson?: ((lessonId: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Course landing page pattern: hero with instructor & Toman price, preview lessons, full syllabus, and FAQ. */
export function CoursePage({
  title,
  summary,
  coverSrc,
  coverAlt,
  price,
  originalPrice,
  instructor,
  chapters,
  faqs,
  onEnroll,
  onPreviewLesson,
  className,
  ref,
}: CoursePageProps) {
  const { courses } = usePatternMessages();
  const previewLessons = chapters.flatMap((c) => c.lessons.filter((l) => l.isPreview));

  return (
    <article ref={ref} data-nds="CoursePage" className={className}>
      <Stack gap="6">
        <div className={styles.courseHero}>
          <Image src={coverSrc} alt={coverAlt} ratio="16/9" radius="lg" />
          <Surface>
            <Section>
              <Stack gap="4">
                <Heading level={2}>{title}</Heading>
                <Text as="p" tone="muted" leading="text">
                  {summary}
                </Text>
                <Inline gap="3">
                  <Avatar
                    name={instructor.name}
                    size="md"
                    {...(instructor.avatarSrc !== undefined ? { src: instructor.avatarSrc } : {})}
                  />
                  <Stack gap="1">
                    <Inline gap="2">
                      <Text weight="semibold">{instructor.name}</Text>
                      {instructor.isVerified && <VerifiedBadge size="sm" />}
                    </Inline>
                    <Text size="xs" tone="muted">
                      {instructor.title}
                    </Text>
                  </Stack>
                </Inline>
                <Price
                  amount={price}
                  {...(originalPrice !== undefined ? { originalAmount: originalPrice } : {})}
                  size="lg"
                />
                {onEnroll && (
                  <Button variant="primary" size="lg" onPress={onEnroll}>
                    {courses.enrollNow}
                  </Button>
                )}
              </Stack>
            </Section>
          </Surface>
        </div>

        {previewLessons.length > 0 && (
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>{courses.previewLessonsHeading}</Heading>
                <ul className={styles.lessonList}>
                  {previewLessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={styles.lessonBtn}
                        onClick={() => onPreviewLesson?.(lesson.id)}
                      >
                        <span className={styles.lessonTitleRow}>
                          <Icon icon={iconPlay} size="sm" />
                          <span>{lesson.title}</span>
                        </span>
                        <Inline gap="2">
                          <Badge tone="info" size="sm">
                            {courses.freePreviewBadge}
                          </Badge>
                          <Text size="xs" tone="subtle">
                            {courses.durationMinutes(lesson.durationMinutes)}
                          </Text>
                        </Inline>
                      </button>
                    </li>
                  ))}
                </ul>
              </Stack>
            </Section>
          </Surface>
        )}

        <Stack gap="3">
          <Heading level={3}>{courses.syllabusHeading}</Heading>
          <LessonNav
            chapters={chapters}
            {...(onPreviewLesson !== undefined ? { onSelectLesson: onPreviewLesson } : {})}
          />
        </Stack>

        <Surface>
          <Section>
            <Stack gap="3">
              <Heading level={3}>{courses.instructorHeading}</Heading>
              <Text as="p" tone="muted" leading="text">
                {instructor.bio}
              </Text>
            </Stack>
          </Section>
        </Surface>

        {faqs && faqs.length > 0 && (
          <Stack gap="3">
            <Heading level={3}>{courses.faqHeading}</Heading>
            <Accordion>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} id={faq.id} title={faq.question}>
                  <Text as="p" tone="muted" leading="text">
                    {faq.answer}
                  </Text>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>
        )}
      </Stack>
    </article>
  );
}

export interface EnrolledCourseItem {
  id: string;
  title: string;
  instructorName: string;
  coverSrc: string;
  coverAlt: string;
  completedLessons: number;
  totalLessons: number;
  lastLessonTitle?: string | undefined;
}

export interface MyCoursesProps {
  items: readonly EnrolledCourseItem[];
  onResumeCourse?: ((courseId: string) => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Enrolled courses list with 90%-rule completion filter, `CourseProgress`, and resume CTA. */
export function MyCourses({ items, onResumeCourse, className, ref }: MyCoursesProps) {
  const { courses } = usePatternMessages();
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filtered = items.filter((course) => {
    const percent = Math.round((course.completedLessons / Math.max(1, course.totalLessons)) * 100);
    if (filter === 'completed') return percent >= 90;
    if (filter === 'in_progress') return percent < 90;
    return true;
  });

  return (
    <section
      ref={ref}
      data-nds="MyCourses"
      aria-label={courses.myCoursesTitle}
      className={cx(className)}
    >
      <Stack gap="4">
        <div className={styles.playerControls}>
          <Heading level={2}>{courses.myCoursesTitle}</Heading>
          <SegmentedControl
            aria-label={courses.myCoursesTitle}
            size="sm"
            value={filter}
            onChange={(k) => setFilter(k as 'all' | 'in_progress' | 'completed')}
          >
            <SegmentedControlItem id="all">{courses.myCoursesFilterAll}</SegmentedControlItem>
            <SegmentedControlItem id="in_progress">
              {courses.myCoursesFilterInProgress}
            </SegmentedControlItem>
            <SegmentedControlItem id="completed">
              {courses.myCoursesFilterCompleted}
            </SegmentedControlItem>
          </SegmentedControl>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={iconCourse}
            title={courses.myCoursesEmptyTitle}
            description={courses.myCoursesEmptyDescription}
          />
        ) : (
          <div className={styles.courseGrid}>
            {filtered.map((course) => (
              <Card key={course.id}>
                <CardMedia>
                  <Image src={course.coverSrc} alt={course.coverAlt} ratio="16/9" />
                </CardMedia>
                <CardBody>
                  <Stack gap="3">
                    <Heading level={3}>{course.title}</Heading>
                    <Text size="xs" tone="muted">
                      {course.instructorName}
                    </Text>
                    <CourseProgress
                      completedLessons={course.completedLessons}
                      totalLessons={course.totalLessons}
                    />
                  </Stack>
                </CardBody>
                <CardFooter tone="sunken">
                  <Button
                    size="sm"
                    variant="primary"
                    iconStart={iconPlay}
                    onPress={() => onResumeCourse?.(course.id)}
                  >
                    {courses.resumeCourse}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Stack>
    </section>
  );
}

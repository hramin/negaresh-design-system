import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  sampleCourseChapters,
  sampleCourseInstructor,
  sampleEnrolledCourses,
  sampleMedia,
} from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import { CoursePage, CoursePlayer, CourseProgress, LessonNav, MyCourses } from './index.ts';

function wrap(ui: ReactNode) {
  return <ThemeProvider messages={faMessages}>{ui}</ThemeProvider>;
}

describe('Courses patterns', () => {
  it('enforces the 90% completion threshold rule in CourseProgress', async () => {
    const { container } = render(
      wrap(
        <div>
          <CourseProgress completedLessons={8} totalLessons={10} />
          <CourseProgress completedLessons={9} totalLessons={10} />
        </div>,
      ),
    );
    expect(container.textContent).toContain('در حال گذراندن');
    expect(container.textContent).toContain('تکمیل‌شده');
    await expectNoAxeViolations(container);
  });

  it('renders CoursePlayer, CoursePage, LessonNav, and MyCourses cleanly', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(
      wrap(
        <div>
          <CoursePlayer
            courseTitle="کارگاه MMPI-2"
            lessonTitle="درس دوم"
            posterSrc={sampleMedia.courseCover}
            posterAlt="پوستر دوره"
            chapters={sampleCourseChapters}
            activeLessonId="l-2"
            completedLessons={2}
            totalLessons={4}
            resumeTimestamp="۱۲:۴۰"
            onSelectLesson={onSelect}
          />
          <CoursePage
            title="کارگاه MMPI-2"
            summary="آموزش کاربردی"
            coverSrc={sampleMedia.courseCover}
            coverAlt="کاور"
            price={1_850_000}
            instructor={sampleCourseInstructor}
            chapters={sampleCourseChapters}
          />
          <LessonNav chapters={sampleCourseChapters} activeLessonId="l-1" />
          <MyCourses items={sampleEnrolledCourses} />
        </div>,
      ),
    );

    const lockedBtn = screen.getAllByRole('button', {
      name: /نگارش نسخهٔ آرام گزارش برای مراجع و خانواده/,
    })[0] as HTMLButtonElement;
    expect(lockedBtn.disabled).toBe(true);

    const previewBtn = screen.getAllByRole('button', {
      name: /آشنایی با ساختار آزمون/,
    })[0]!;
    await user.click(previewBtn);
    expect(onSelect).toHaveBeenCalledWith('l-1');
    await expectNoAxeViolations(container);
  });
});

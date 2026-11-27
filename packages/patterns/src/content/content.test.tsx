import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  sampleArticleAuthor,
  sampleAuthors,
  sampleContentBlocks,
  sampleContentCards,
  sampleExperts,
  sampleFeaturedSlides,
  samplePollOptions,
  sampleReviewQueue,
  sampleWriterDocs,
} from '../fixtures/index.ts';
import { expectNoAxeViolations } from '../test/axe.ts';
import {
  ArticlePage,
  BlogFeed,
  ExpertDirectory,
  ExpertProfile,
  Poll,
  ReviewQueue,
  WriterWorkspace,
} from './index.ts';

function wrap(ui: ReactNode) {
  return <ThemeProvider messages={faMessages}>{ui}</ThemeProvider>;
}

describe('Content / Magazine patterns', () => {
  it('allows voting in Poll and reveals expert note afterwards', async () => {
    const user = userEvent.setup();
    const onVote = vi.fn();
    const { container } = render(
      wrap(
        <Poll
          question="کدام نسخه را ترجیح می‌دهید؟"
          options={samplePollOptions}
          expertNote="یادداشت علمی پس از رأی نمایش داده می‌شود."
          onVote={onVote}
        />,
      ),
    );

    expect(container.textContent).not.toContain('یادداشت علمی پس از رأی');
    await user.click(screen.getByRole('radio', { name: samplePollOptions[0]!.label }));
    await user.click(screen.getByRole('button', { name: 'ثبت رأی' }));
    expect(onVote).toHaveBeenCalledWith(['p1']);
    expect(container.textContent).toContain('یادداشت علمی پس از رأی');
    await expectNoAxeViolations(container);
  });

  it('renders BlogFeed, ArticlePage with all ContentBlocks, Experts, WriterWorkspace, and ReviewQueue cleanly', async () => {
    const { container } = render(
      wrap(
        <div>
          <BlogFeed
            featured={sampleFeaturedSlides}
            authors={sampleAuthors}
            items={sampleContentCards}
            hasMore
            onLoadMore={() => {}}
          />
          <ArticlePage
            title="گزارش آرام آزمون نوجوانان"
            summary="مرور اصول نگارش آرام"
            category="روان‌سنجی"
            author={sampleArticleAuthor}
            publishedAt="2026-11-15T09:00:00Z"
            readingMinutes={7}
            shareUrl="https://negaresh.ir/mag/calm"
            blocks={sampleContentBlocks}
          />
          <ExpertDirectory experts={sampleExperts} />
          <ExpertProfile
            expert={sampleExperts[0]!}
            about="سوابق تخصصی"
            education={['دکتری روان‌شناسی بالینی']}
            authoredContent={sampleContentCards.slice(0, 2)}
          />
          <WriterWorkspace documents={sampleWriterDocs} />
          <ReviewQueue items={sampleReviewQueue} />
        </div>,
      ),
    );

    expect(container.querySelector('[data-nds="BlogFeed"]')).not.toBeNull();
    expect(container.querySelector('[data-nds="ArticlePage"]')).not.toBeNull();
    expect(container.querySelector('[data-nds="WriterWorkspace"]')).not.toBeNull();
    await expectNoAxeViolations(container);
  });
});

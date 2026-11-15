import { Container, Grid, Inline, Section, Stack, Surface, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

const Box = ({ children }: { children: string }) => (
  <Surface as="div">
    <Section>
      <Text size="sm">{children}</Text>
    </Section>
  </Surface>
);

export const layoutDoc: ComponentDoc = {
  slug: 'layout',
  title: 'چیدمان',
  components: ['Stack', 'Inline', 'Grid', 'Container'],
  summary:
    'محصولات صفحه‌ها را با این چهار جزء می‌چینند، نه با CSS چیدمان؛ فاصله‌ها فقط از توکن‌های فاصله می‌آیند.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Stack gap="5">
      <Inline gap="3" justify="between">
        <Text weight="bold">عنوان بخش</Text>
        <Text size="sm" tone="subtle">
          ۳ مورد
        </Text>
      </Inline>
      <Grid minItemSize="var(--nds-sidenav)" gap="4">
        <Box>کارت ۱</Box>
        <Box>کارت ۲</Box>
        <Box>کارت ۳</Box>
      </Grid>
    </Stack>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="Stack — فاصله‌ها">
        {(['2', '4', '6'] as const).map((g) => (
          <State key={g} label={`gap="${g}"`}>
            <Stack gap={g}>
              <Box>الف</Box>
              <Box>ب</Box>
            </Stack>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="Inline — توزیع">
        {(['start', 'center', 'between'] as const).map((j) => (
          <State key={j} label={`justify="${j}"`}>
            <div style={{ inlineSize: 'calc(var(--nds-space-24) * 2.5)' }}>
              <Inline justify={j}>
                <Box>۱</Box>
                <Box>۲</Box>
              </Inline>
            </div>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="Grid">
        <State label="columns={3}">
          <div style={{ inlineSize: 'calc(var(--nds-space-24) * 3)' }}>
            <Grid columns={3} gap="2">
              <Box>۱</Box>
              <Box>۲</Box>
              <Box>۳</Box>
            </Grid>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="Container — اندازه‌ها">
        <State label='size="narrow" (۶۴۰) · "default" (۱۲۰۰) · "wide" (۱۴۴۰)'>
          <Container size="narrow">
            <Box>کانتینر باریک برای فرم‌ها</Box>
          </Container>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'فاصلهٔ اجزای مرتبط ۸ تا ۱۲، گروه‌ها ۲۰ تا ۲۴، بخش‌ها ۳۲ تا ۴۰ پیکسل.',
      'برای کارت‌ها Grid با minItemSize تا خودش ستون‌ها را بشکند.',
    ],
    dont: ['margin دستی بین اجزا؛ gap را به والد بدهید.', 'left/right یا عرض پیکسلی خام.'],
  },
  api: [
    {
      name: 'Stack',
      props: [
        {
          name: 'gap',
          type: "SpaceStep ('0'…'24')",
          default: "'4'",
          description: 'فاصله بین فرزندان (توکن فاصله).',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'stretch'",
          default: "'stretch'",
          description: 'هم‌ترازی در محور عرضی.',
        },
        { name: 'as', type: 'ElementType', default: "'div'", description: 'عنصر HTML.' },
      ],
    },
    {
      name: 'Inline',
      props: [
        { name: 'gap', type: 'SpaceStep', default: "'2'", description: 'فاصله بین فرزندان.' },
        {
          name: 'align',
          type: "'start' | 'center' | 'end' | 'baseline' | 'stretch'",
          default: "'center'",
          description: 'هم‌ترازی عمودی.',
        },
        {
          name: 'justify',
          type: "'start' | 'center' | 'end' | 'between'",
          default: "'start'",
          description: 'توزیع در جهت خط (start در فارسی سمت راست است).',
        },
        { name: 'wrap', type: 'boolean', default: 'true', description: 'شکستن به خط بعد.' },
      ],
    },
    {
      name: 'Grid',
      props: [
        { name: 'columns', type: 'number', description: 'تعداد ستون ثابت.' },
        {
          name: 'minItemSize',
          type: 'var(--nds-…)',
          description: 'حداقل عرض هر خانه برای auto-fill؛ فقط ارجاع به توکن.',
        },
        { name: 'gap', type: 'SpaceStep', default: "'4'", description: 'فاصلهٔ خانه‌ها.' },
      ],
    },
    {
      name: 'Container',
      props: [
        {
          name: 'size',
          type: "'narrow' | 'default' | 'wide'",
          default: "'default'",
          description: 'بیشینهٔ عرض با حاشیهٔ ۲۴ (۱۶ در موبایل).',
        },
      ],
    },
  ],
  a11y: ['این اجزا معنای دسترس‌پذیری ندارند؛ برای فهرست‌ها as="ul" و برای بخش‌ها as="section" بدهید.'],
  rtl: ['همهٔ جهت‌ها منطقی‌اند: start/end به‌جای left/right؛ در فارسی start سمت راست است.'],
};

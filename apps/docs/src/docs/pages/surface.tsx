import {
  Button,
  ButtonGroup,
  Divider,
  Heading,
  Inline,
  Section,
  Stack,
  Surface,
  Text,
} from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const surfaceDoc: ComponentDoc = {
  slug: 'surface',
  title: 'سطح و جداکننده',
  components: ['Surface', 'Section', 'Divider'],
  summary:
    'سطح با رنگ زمینه، فاصله و یک خط مویی جدا می‌شود؛ بدون سایه و قاب (D-77). سطح تو در تو نمی‌شود؛ داخلش Section است.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Surface aria-labelledby="ex-surface">
      <Section>
        <Stack gap="2">
          <Heading level={2} id="ex-surface">
            سریال را وارد کنید
          </Heading>
          <Text size="sm" tone="muted">
            نام محصول و کد سیستم از برنامه آمده‌اند؛ فقط سریال لازم است.
          </Text>
        </Stack>
      </Section>
      <Section tone="sunken">
        <ButtonGroup>
          <Button variant="primary">ساخت کد فعال‌سازی</Button>
        </ButtonGroup>
      </Section>
    </Surface>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="Surface">
        <State label='variant="default" + Section + Section tone="sunken"'>
          <div style={{ inlineSize: 'calc(var(--nds-space-24) * 3)' }}>
            <Surface as="div">
              <Section>
                <Text size="sm">بدنه</Text>
              </Section>
              <Section>
                <Text size="sm">بخش</Text>
              </Section>
              <Section tone="sunken">
                <Text size="sm">پانویس</Text>
              </Section>
            </Surface>
          </div>
        </State>
        <State label='variant="plain"'>
          <div style={{ inlineSize: 'calc(var(--nds-space-24) * 2)' }}>
            <Surface as="div" variant="plain">
              <Section>
                <Text size="sm">بدون زمینه و مرز</Text>
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="Divider">
        <State label="افقی · default / strong">
          <div style={{ inlineSize: 'calc(var(--nds-space-24) * 2)' }}>
            <Stack gap="3">
              <Divider />
              <Divider tone="strong" />
            </Stack>
          </div>
        </State>
        <State label="عمودی">
          <Inline gap="3">
            <Text size="sm">الف</Text>
            <Divider orientation="vertical" />
            <Text size="sm">ب</Text>
          </Inline>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'یک Surface برای هر وظیفه؛ اقدام‌ها در Section با tone="sunken" در پایین.',
      'برای نام‌گذاری سطح، aria-labelledby به عنوانش بدهید.',
    ],
    dont: ['سایه روی سطح ساکن؛ سایه فقط برای لایه‌های شناور است.', 'Surface داخل Surface.'],
  },
  a11y: [
    'Surface به‌صورت پیش‌فرض section است؛ بدون نام، ناحیه حساب نمی‌شود.',
    'Divider نقش separator دارد.',
  ],
  rtl: ['شعاع گوشه‌ها و حاشیه‌ها منطقی‌اند؛ پانویس sunken شعاع پایینی سطح را می‌گیرد.'],
};

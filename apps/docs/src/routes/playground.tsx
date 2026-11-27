import {
  Badge,
  Button,
  Heading,
  Inline,
  Ltr,
  NumberField,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectItem,
  Stack,
  Switch,
  Text,
  TextField,
} from '@negaresh/react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styles from '../components/Page.module.css';
import {
  findPlaygroundPreset,
  PLAYGROUND_PRESETS,
  type PlaygroundValues,
} from '../docs/playground/presets.tsx';
import { getAutoComponentApi } from '../docs/props.ts';
import { CodeBlock, PropsTable } from '../docs/ui.tsx';
import pg from './playground.module.css';

type CanvasTheme = 'light' | 'dark' | 'split';
type CanvasDensity = 'comfortable' | 'compact';
type CanvasDir = 'rtl' | 'ltr';
type ViewportPreset = 'full' | '768' | '390' | '360';

function parseCanvasTheme(raw: unknown): CanvasTheme {
  return raw === 'light' || raw === 'dark' || raw === 'split' ? raw : 'light';
}
function parseDensity(raw: unknown): CanvasDensity {
  return raw === 'compact' ? 'compact' : 'comfortable';
}
function parseDir(raw: unknown): CanvasDir {
  return raw === 'ltr' ? 'ltr' : 'rtl';
}
function parseViewport(raw: unknown): ViewportPreset {
  return raw === '360' || raw === '390' || raw === '768' || raw === 'full' ? raw : 'full';
}

export const Route = createFileRoute('/playground')({
  validateSearch: (search: Record<string, unknown>) => ({
    preset: typeof search.preset === 'string' ? search.preset : 'button',
    canvasTheme: parseCanvasTheme(search.canvasTheme),
    density: parseDensity(search.density),
    dir: parseDir(search.dir),
    viewport: parseViewport(search.viewport),
  }),
  head: () => ({ meta: [{ title: 'زمین بازی تعاملی (Playground) · دیزاین سیستم نگرش' }] }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const preset = findPlaygroundPreset(search.preset);
  const [values, setValues] = useState<PlaygroundValues>(() => ({ ...preset.defaults }));

  useEffect(() => {
    setValues({ ...preset.defaults });
  }, [preset]);

  const updateSearch = (patch: Partial<typeof search>) => {
    void navigate({
      to: '/playground',
      search: { ...search, ...patch },
      replace: true,
    });
  };

  const setField = (key: string, next: string | boolean | number) => {
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const autoApi = getAutoComponentApi(preset.componentName);
  const modes: readonly ('light' | 'dark')[] =
    search.canvasTheme === 'split' ? ['light', 'dark'] : [search.canvasTheme];

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="accent" size="sm">
            ۵ بستهٔ NDS
          </Badge>
          <Badge tone="neutral" size="sm">
            روشن / تیره / هم‌زمان · تراکم · RTL / LTR
          </Badge>
        </Inline>
        <Heading level={1}>زمین بازی تعاملی (Playground)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          تغییر زندهٔ ویژگی‌های کامپوننت‌ها، مقایسهٔ هم‌زمان تم روشن و تیره، بررسی حالت تراکم
          فشرده، جهت راست‌به‌چپ/چپ‌به‌راست و پیش‌نمایش عرض‌های موبایل و تبلت.
        </Text>
      </header>

      <div data-gallery="playground">
        <Stack gap="6">
          <section className={pg.toolbar} aria-label="تنظیمات محیط زمین بازی">
            <div className={pg.presetSelect}>
              <Select
                label="انتخاب کامپوننت یا الگو"
                value={preset.id}
                onChange={(key) => updateSearch({ preset: String(key) })}
              >
                {PLAYGROUND_PRESETS.map((p) => (
                  <SelectItem key={p.id} id={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <SegmentedControl
              label="تم پیش‌نمایش"
              size="sm"
              value={search.canvasTheme}
              onChange={(k) => updateSearch({ canvasTheme: parseCanvasTheme(k) })}
            >
              <SegmentedControlItem id="light">روشن</SegmentedControlItem>
              <SegmentedControlItem id="dark">تیره</SegmentedControlItem>
              <SegmentedControlItem id="split">هم‌زمان</SegmentedControlItem>
            </SegmentedControl>

            <SegmentedControl
              label="تراکم (density)"
              size="sm"
              value={search.density}
              onChange={(k) => updateSearch({ density: parseDensity(k) })}
            >
              <SegmentedControlItem id="comfortable">راحت</SegmentedControlItem>
              <SegmentedControlItem id="compact">فشرده</SegmentedControlItem>
            </SegmentedControl>

            <SegmentedControl
              label="جهت (dir)"
              size="sm"
              value={search.dir}
              onChange={(k) => updateSearch({ dir: parseDir(k) })}
            >
              <SegmentedControlItem id="rtl">RTL</SegmentedControlItem>
              <SegmentedControlItem id="ltr">LTR</SegmentedControlItem>
            </SegmentedControl>

            <SegmentedControl
              label="عرض قاب"
              size="sm"
              value={search.viewport}
              onChange={(k) => updateSearch({ viewport: parseViewport(k) })}
            >
              <SegmentedControlItem id="full">تمام‌عرض</SegmentedControlItem>
              <SegmentedControlItem id="768">۷۶۸px</SegmentedControlItem>
              <SegmentedControlItem id="390">۳۹۰px</SegmentedControlItem>
              <SegmentedControlItem id="360">۳۶۰px</SegmentedControlItem>
            </SegmentedControl>
          </section>

          <div className={pg.workspace}>
            <div className={pg.stageShell}>
              <Heading level={2}>پیش‌نمایش زنده</Heading>
              <div className={search.canvasTheme === 'split' ? pg.splitGrid : undefined}>
                {modes.map((mode) => (
                  <section
                    key={mode}
                    className={pg.canvasWrap}
                    data-theme={mode}
                    data-density={search.density}
                    dir={search.dir}
                    aria-label={`پیش‌نمایش ${preset.title} در حالت ${mode === 'light' ? 'روشن' : 'تیره'}`}
                    data-testid={`playground-canvas-${mode}`}
                  >
                    <div className={pg.canvasCaption} dir="rtl">
                      <Inline gap="2" align="center">
                        <Badge tone="neutral" size="sm">
                          {mode === 'light' ? 'حالت روشن' : 'حالت تیره'}
                        </Badge>
                        <Badge tone="neutral" size="sm">
                          <Ltr>{preset.packageName}</Ltr>
                        </Badge>
                      </Inline>
                      <span>
                        <Ltr>
                          {search.dir.toUpperCase()} · {search.density} ·{' '}
                          {search.viewport === 'full' ? '100%' : `${search.viewport}px`}
                        </Ltr>
                      </span>
                    </div>
                    <div className={pg.canvasFrame} data-viewport={search.viewport}>
                      {preset.render(values)}
                    </div>
                  </section>
                ))}
              </div>

              <CodeBlock
                code={`import { ${preset.componentName} } from '${preset.packageName}';\n\n${preset.code(values)}`}
                label="کد JSX زنده"
                copyLabel="کپی کد JSX"
              />
            </div>

            <aside className={pg.controlsPanel} aria-label="کنترل‌های ویژگی‌ها">
              <div className={pg.controlsHeader}>
                <Heading level={2}>ویژگی‌ها</Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setValues({ ...preset.defaults })}
                >
                  بازنشانی
                </Button>
              </div>
              <Text size="sm" tone="muted">
                {preset.description}
              </Text>
              <Link to={preset.docsTo} className={styles.link}>
                مشاهدهٔ صفحهٔ کامل مستندات {preset.componentName}
              </Link>

              <Stack gap="4">
                {preset.controls.map((ctrl) => {
                  if (ctrl.type === 'select') {
                    return (
                      <Select
                        key={ctrl.key}
                        label={ctrl.label}
                        size="sm"
                        value={String(values[ctrl.key] ?? preset.defaults[ctrl.key] ?? '')}
                        onChange={(k) => setField(ctrl.key, String(k))}
                      >
                        {ctrl.options.map((opt) => (
                          <SelectItem key={opt.value} id={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  }
                  if (ctrl.type === 'boolean') {
                    return (
                      <Switch
                        key={ctrl.key}
                        isSelected={Boolean(values[ctrl.key])}
                        onChange={(checked) => setField(ctrl.key, checked)}
                      >
                        {ctrl.label}
                      </Switch>
                    );
                  }
                  if (ctrl.type === 'number') {
                    return (
                      <NumberField
                        key={ctrl.key}
                        label={ctrl.label}
                        size="sm"
                        value={Number(values[ctrl.key] ?? 0)}
                        {...(ctrl.min !== undefined ? { minValue: ctrl.min } : {})}
                        {...(ctrl.max !== undefined ? { maxValue: ctrl.max } : {})}
                        {...(ctrl.step !== undefined ? { step: ctrl.step } : {})}
                        onChange={(num) => setField(ctrl.key, Number.isFinite(num) ? num : 0)}
                      />
                    );
                  }
                  return (
                    <TextField
                      key={ctrl.key}
                      label={ctrl.label}
                      size="sm"
                      value={String(values[ctrl.key] ?? '')}
                      onChange={(text) => setField(ctrl.key, text)}
                    />
                  );
                })}
              </Stack>
            </aside>
          </div>
        </Stack>
      </div>

      {autoApi && (
        <section className={styles.section} aria-labelledby="playground-props">
          <Heading level={2} id="playground-props">
            جدول خودکار ویژگی‌های TypeScript
          </Heading>
          <PropsTable
            name={autoApi.name}
            packageName={autoApi.packageName}
            kind={autoApi.kind}
            {...(autoApi.description ? { description: autoApi.description } : {})}
            rows={autoApi.props}
          />
        </section>
      )}
    </article>
  );
}

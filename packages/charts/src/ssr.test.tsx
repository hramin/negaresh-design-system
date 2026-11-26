// @vitest-environment node
import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Band,
  Bar,
  buildBarTable,
  buildGaugeTable,
  buildIntervalBarTable,
  buildProfileLineTable,
  buildRadarTable,
  ChartFrame,
  ChartMessagesProvider,
  Gauge,
  IntervalBar,
  ProfileLine,
  Radar,
  ReferenceLine,
  Sparkline,
} from './index.ts';
import { faChartMessages } from './messages/fa.ts';

describe('@negaresh/charts Node SSR', () => {
  it('renders every exported chart component on the server without window/document access', () => {
    const intervalItems = [
      { id: 'anx', label: 'اضطراب', value: 64, low: 59, high: 69, severity: 'caution' as const },
      { id: 'dep', label: 'خلق', value: 52, low: 47, high: 57, severity: 'ok' as const },
    ];
    const profileCats = [
      { id: 'L', label: 'دروغ‌سنجی', shortLabel: 'L' },
      { id: 'D', label: 'افسردگی', shortLabel: 'D' },
      { id: 'Pt', label: 'اضطراب', shortLabel: 'Pt' },
    ];
    const profileSeries = [{ id: 's1', label: 'ارزیابی', values: [48, 67, 62] }];
    const barCats = [
      { id: 'm1', label: 'فروردین' },
      { id: 'm2', label: 'اردیبهشت' },
    ];
    const barSeries = [{ id: 'b1', label: 'فروش', values: [120, 165] }];
    const radarAxes = [
      { id: 'r1', label: 'تاب‌آوری' },
      { id: 'r2', label: 'خواب' },
      { id: 'r3', label: 'حمایت' },
      { id: 'r4', label: 'تمرکز' },
    ];
    const radarSeries = [{ id: 'rs1', label: 'نمره', values: [72, 60, 80, 68] }];

    const html = renderToString(
      <ThemeProvider messages={faMessages}>
        <ChartMessagesProvider messages={faChartMessages}>
          <ChartFrame
            title="بازه‌ای"
            takeaway="نمره در بازهٔ توجه است."
            table={buildIntervalBarTable(intervalItems)}
          >
            <IntervalBar
              ariaLabel="بازه‌ای"
              items={intervalItems}
              domain={[30, 85]}
              mode="calm"
              bands={[{ from: 40, to: 60 }]}
              referenceLines={[{ value: 50, label: '۵۰' }]}
            />
          </ChartFrame>

          <ChartFrame title="نیمرخ" table={buildProfileLineTable(profileCats, profileSeries)}>
            <ProfileLine
              ariaLabel="نیمرخ"
              categories={profileCats}
              series={profileSeries}
              domain={[30, 85]}
              referenceLines={[{ value: 50, label: '۵۰' }, { value: 65, label: '۶۵' }]}
              dividers={[{ afterCategoryId: 'L', label: 'بالینی' }]}
            />
          </ChartFrame>

          <ChartFrame title="ستونی" table={buildBarTable(barCats, barSeries)}>
            <Bar ariaLabel="ستونی" categories={barCats} series={barSeries} />
            <Bar ariaLabel="افقی" orientation="horizontal" categories={barCats} series={barSeries} />
          </ChartFrame>

          <ChartFrame
            title="رادار"
            tableMode="visible"
            table={buildRadarTable(radarAxes, radarSeries)}
          >
            <Radar ariaLabel="رادار" axes={radarAxes} series={radarSeries} domain={[0, 100]} />
          </ChartFrame>

          <ChartFrame
            title="گیج"
            table={buildGaugeTable('شاخص بهزیستی', 74, [0, 100], 'در بازهٔ معمول')}
          >
            <Gauge
              value={74}
              domain={[0, 100]}
              label="شاخص بهزیستی"
              bandWord="در بازهٔ معمول"
              mode="calm"
            />
          </ChartFrame>

          <svg viewBox="0 0 100 40" role="img" aria-label="پایه">
            <Band orientation="vertical" fromCoord={20} toCoord={60} spanStart={0} spanEnd={40} />
            <ReferenceLine orientation="vertical" position={40} start={0} end={40} />
          </svg>

          <Sparkline values={[10, 15, 13, 21]} baseline={14} summary="روند صعودی" />
        </ChartMessagesProvider>
      </ThemeProvider>,
    );

    expect(html).toContain('data-nds="ChartFrame"');
    expect(html).toContain('data-nds="IntervalBar"');
    expect(html).toContain('data-nds="ProfileLine"');
    expect(html).toContain('data-nds="Bar"');
    expect(html).toContain('data-nds="Radar"');
    expect(html).toContain('data-nds="Gauge"');
    expect(html).toContain('data-nds="Sparkline"');
    expect(html).toContain('data-nds="ReferenceLine"');
    expect(html).toContain('data-nds="Band"');
    expect(html).toContain('<svg');
    expect(html).toContain('<details');
    expect(html).not.toContain('NaN');
  });
});

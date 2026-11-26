import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Form } from '../Form/Form.tsx';
import { expectNoAxeViolations } from '../test/axe.ts';
import { renderNds } from '../test/render.tsx';
import { DropZone } from './DropZone.tsx';
import { FileUpload, type FileUploadItem } from './FileUpload.tsx';

describe('DropZone and FileUpload', () => {
  it('accepts valid files via FileTrigger input and allows removing them', async () => {
    const onSelectFiles = vi.fn();
    const onRemove = vi.fn();
    const { container } = renderNds(
      <FileUpload
        label="فهرست سریال‌ها"
        hint="قالب‌های مجاز: CSV، TXT · حداکثر ۲ مگابایت"
        accept={['.csv', '.txt', 'text/csv']}
        maxFileSize={2 * 1024 * 1024}
        allowsMultiple
        onSelectFiles={onSelectFiles}
        onRemove={onRemove}
      />,
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    const csv = new File(['N25AG-EMV0K\n'], 'serials-1405.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [csv] } });

    expect(onSelectFiles).toHaveBeenCalledTimes(1);
    expect(onSelectFiles.mock.calls[0]?.[0]?.[0]?.name).toBe('serials-1405.csv');
    expect(screen.getByText('serials-1405.csv')).toBeTruthy();

    const removeBtn = screen.getByRole('button', { name: 'حذف پروندهٔ «serials-1405.csv»' });
    await userEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('serials-1405.csv')).toBeNull();
  });

  it('rejects disallowed types, oversized files, and excess file counts with Persian alerts', () => {
    const onReject = vi.fn();
    const { container } = renderNds(
      <FileUpload
        label="بارگذاری پرونده"
        accept={['.csv', 'image/png']}
        maxFileSize={1024}
        maxFiles={1}
        allowsMultiple
        onReject={onReject}
      />,
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    // 1. Disallowed type
    const badType = new File(['hello'], 'notes.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [badType] } });
    expect(screen.getByRole('alert').textContent).toContain('قالب پروندهٔ «notes.pdf» مجاز نیست');
    expect(onReject).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid-type' })]),
    );

    // 2. Oversized file
    const big = new File([new Uint8Array(2048)], 'large.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [big] } });
    expect(screen.getByRole('alert').textContent).toContain(
      'حجم پروندهٔ «large.csv» بیشتر از سقف مجاز',
    );
    expect(onReject).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ code: 'file-too-large' })]),
    );

    // 3. Too many files
    const ok1 = new File(['a'], 'one.csv', { type: 'text/csv' });
    const ok2 = new File(['b'], 'two.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [ok1, ok2] } });
    expect(screen.getByRole('alert').textContent).toContain('حداکثر ۱ پرونده');
    expect(onReject).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining({ code: 'too-many-files' })]),
    );
  });

  it('renders uploading progress, complete, and error file items and Form validationErrors', () => {
    const items: FileUploadItem[] = [
      {
        id: '1',
        name: 'roster.csv',
        size: 128 * 1024,
        type: 'text/csv',
        status: 'uploading',
        progress: 65,
      },
      {
        id: '2',
        name: 'cover.png',
        size: 2 * 1024 * 1024,
        type: 'image/png',
        status: 'complete',
      },
      {
        id: '3',
        name: 'broken.txt',
        size: 512,
        type: 'text/plain',
        status: 'error',
        error: 'اتصال با سرور قطع شد.',
      },
    ];
    renderNds(
      <Form validationErrors={{ attachment: 'دست‌کم یک پرونده پیوست کنید.' }}>
        <FileUpload label="پیوست‌ها" name="attachment" items={items} />
      </Form>,
    );

    expect(screen.getByRole('progressbar', { name: /در حال بارگذاری/ })).toBeTruthy();
    expect(screen.getByText('بارگذاری کامل شد')).toBeTruthy();
    expect(screen.getByText('اتصال با سرور قطع شد.')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain('دست‌کم یک پرونده پیوست کنید.');
  });

  it('passes axe accessibility checks on standalone DropZone and populated FileUpload', async () => {
    const { container } = renderNds(
      <div>
        <DropZone
          aria-label="منطقهٔ رهاسازی پرونده"
          hint="پروندهٔ CSV یا تصویر PNG"
        />
        <FileUpload
          label="فهرست آزمون‌دهندگان"
          description="پرونده را رها کنید یا از دستگاه انتخاب نمایید."
          defaultItems={[
            {
              id: 'a',
              name: 'candidates.csv',
              size: 4096,
              type: 'text/csv',
              status: 'uploading',
              progress: 40,
            },
            {
              id: 'b',
              name: 'logo.png',
              size: 64 * 1024,
              type: 'image/png',
              status: 'complete',
            },
          ]}
        />
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});

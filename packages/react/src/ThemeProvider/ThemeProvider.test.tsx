import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { faMessages } from '../messages/fa.ts';
import {
  readThemeCookie,
  serializeThemeCookie,
  ThemeProvider,
  themeAttribute,
  useNdsMessages,
  useTheme,
} from './ThemeProvider.tsx';

function Switch() {
  const { theme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme(theme === 'dark' ? 'system' : 'dark')}>
      {theme}
    </button>
  );
}

function Probe() {
  return <>{useNdsMessages().copy}</>;
}

describe('ThemeProvider', () => {
  it('syncs data-theme and density on <html> and reports changes', async () => {
    const onThemeChange = vi.fn();
    render(
      <ThemeProvider
        messages={faMessages}
        defaultTheme="light"
        density="compact"
        onThemeChange={onThemeChange}
      >
        <Switch />
      </ThemeProvider>,
    );
    const root = document.documentElement;
    expect(root.dataset.theme).toBe('light');
    expect(root.dataset.density).toBe('compact');
    await userEvent.click(screen.getByRole('button'));
    expect(root.dataset.theme).toBe('dark');
    expect(onThemeChange).toHaveBeenLastCalledWith('dark');
    await userEvent.click(screen.getByRole('button'));
    expect(root.dataset.theme).toBeUndefined();
  });

  it('requires a provider for messages', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(/ThemeProvider/);
  });

  it('reads and writes the theme cookie', () => {
    expect(readThemeCookie('a=1; nds-theme=dark; b=2')).toBe('dark');
    expect(readThemeCookie('nds-theme=purple')).toBeUndefined();
    expect(readThemeCookie(undefined)).toBeUndefined();
    expect(serializeThemeCookie('light')).toContain('nds-theme=light; Path=/; Max-Age=31536000');
    expect(serializeThemeCookie('system')).toContain('Max-Age=0');
    expect(themeAttribute('system')).toBeUndefined();
  });
});

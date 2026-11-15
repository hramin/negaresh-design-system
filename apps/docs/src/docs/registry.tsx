import { a11yHelpersDoc } from './pages/a11y-helpers.tsx';
import { buttonDoc } from './pages/button.tsx';
import { buttonGroupDoc } from './pages/button-group.tsx';
import { copyButtonDoc } from './pages/copy-button.tsx';
import { iconDoc } from './pages/icon.tsx';
import { layoutDoc } from './pages/layout.tsx';
import { linkDoc } from './pages/link.tsx';
import { logoSlotDoc } from './pages/logo-slot.tsx';
import { ltrDoc } from './pages/ltr.tsx';
import { menuDoc } from './pages/menu.tsx';
import { surfaceDoc } from './pages/surface.tsx';
import { themeProviderDoc } from './pages/theme-provider.tsx';
import { toggleButtonDoc } from './pages/toggle-button.tsx';
import { typographyDoc } from './pages/typography.tsx';
import type { ComponentDoc } from './types.ts';

/** Component documentation pages, in navigation order. */
export const COMPONENT_DOCS: readonly ComponentDoc[] = [
  themeProviderDoc,
  layoutDoc,
  surfaceDoc,
  typographyDoc,
  ltrDoc,
  iconDoc,
  logoSlotDoc,
  a11yHelpersDoc,
  buttonDoc,
  linkDoc,
  buttonGroupDoc,
  toggleButtonDoc,
  copyButtonDoc,
  menuDoc,
];

export function findDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((d) => d.slug === slug);
}

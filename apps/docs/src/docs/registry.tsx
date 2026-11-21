import { a11yHelpersDoc } from './pages/a11y-helpers.tsx';
import { accountPillDoc } from './pages/account-pill.tsx';
import { buttonDoc } from './pages/button.tsx';
import { buttonGroupDoc } from './pages/button-group.tsx';
import { checkboxDoc } from './pages/checkbox.tsx';
import { choiceCardDoc } from './pages/choice-card.tsx';
import { comboBoxDoc } from './pages/combobox.tsx';
import { copyButtonDoc } from './pages/copy-button.tsx';
import { formDoc } from './pages/form.tsx';
import { iconDoc } from './pages/icon.tsx';
import { layoutDoc } from './pages/layout.tsx';
import { linkDoc } from './pages/link.tsx';
import { logoSlotDoc } from './pages/logo-slot.tsx';
import { ltrDoc } from './pages/ltr.tsx';
import { menuDoc } from './pages/menu.tsx';
import { passwordFieldDoc } from './pages/password-field.tsx';
import { phoneFieldDoc } from './pages/phone-field.tsx';
import { radioGroupDoc } from './pages/radio-group.tsx';
import { searchFieldDoc } from './pages/search-field.tsx';
import { segmentedControlDoc } from './pages/segmented-control.tsx';
import { selectDoc } from './pages/select.tsx';
import { serialFieldDoc } from './pages/serial-field.tsx';
import { surfaceDoc } from './pages/surface.tsx';
import { switchDoc } from './pages/switch.tsx';
import { tagGroupDoc } from './pages/tag-group.tsx';
import { textAreaDoc } from './pages/text-area.tsx';
import { textFieldDoc } from './pages/text-field.tsx';
import { themeProviderDoc } from './pages/theme-provider.tsx';
import { toggleButtonDoc } from './pages/toggle-button.tsx';
import { topBarDoc } from './pages/top-bar.tsx';
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
  topBarDoc,
  accountPillDoc,
  textFieldDoc,
  textAreaDoc,
  searchFieldDoc,
  phoneFieldDoc,
  serialFieldDoc,
  passwordFieldDoc,
  formDoc,
  selectDoc,
  comboBoxDoc,
  checkboxDoc,
  radioGroupDoc,
  choiceCardDoc,
  segmentedControlDoc,
  switchDoc,
  tagGroupDoc,
];

export function findDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((d) => d.slug === slug);
}

import { a11yHelpersDoc } from './pages/a11y-helpers.tsx';
import { accountPillDoc } from './pages/account-pill.tsx';
import { badgeDoc } from './pages/badge.tsx';
import { bannerDoc } from './pages/banner.tsx';
import { buttonDoc } from './pages/button.tsx';
import { buttonGroupDoc } from './pages/button-group.tsx';
import { checkboxDoc } from './pages/checkbox.tsx';
import { choiceCardDoc } from './pages/choice-card.tsx';
import { comboBoxDoc } from './pages/combobox.tsx';
import { copyButtonDoc } from './pages/copy-button.tsx';
import { datePickerDoc } from './pages/date-picker.tsx';
import { emptyStateDoc } from './pages/empty-state.tsx';
import { errorPageDoc } from './pages/error-page.tsx';
import { fileUploadDoc } from './pages/file-upload.tsx';
import { formDoc } from './pages/form.tsx';
import { iconDoc } from './pages/icon.tsx';
import { inlineAlertDoc } from './pages/inline-alert.tsx';
import { layoutDoc } from './pages/layout.tsx';
import { linkDoc } from './pages/link.tsx';
import { logoSlotDoc } from './pages/logo-slot.tsx';
import { ltrDoc } from './pages/ltr.tsx';
import { menuDoc } from './pages/menu.tsx';
import { numberFieldDoc } from './pages/number-field.tsx';
import { otpFieldDoc } from './pages/otp-field.tsx';
import { passwordFieldDoc } from './pages/password-field.tsx';
import { phoneFieldDoc } from './pages/phone-field.tsx';
import { progressMeterDoc } from './pages/progress-meter.tsx';
import { radioGroupDoc } from './pages/radio-group.tsx';
import { searchFieldDoc } from './pages/search-field.tsx';
import { segmentedControlDoc } from './pages/segmented-control.tsx';
import { selectDoc } from './pages/select.tsx';
import { serialFieldDoc } from './pages/serial-field.tsx';
import { skeletonDoc } from './pages/skeleton.tsx';
import { sliderDoc } from './pages/slider.tsx';
import { spinnerDoc } from './pages/spinner.tsx';
import { statusBadgeDoc } from './pages/status-badge.tsx';
import { surfaceDoc } from './pages/surface.tsx';
import { switchDoc } from './pages/switch.tsx';
import { tagGroupDoc } from './pages/tag-group.tsx';
import { textAreaDoc } from './pages/text-area.tsx';
import { textFieldDoc } from './pages/text-field.tsx';
import { themeProviderDoc } from './pages/theme-provider.tsx';
import { timeFieldDoc } from './pages/time-field.tsx';
import { toastDoc } from './pages/toast.tsx';
import { toggleButtonDoc } from './pages/toggle-button.tsx';
import { topBarDoc } from './pages/top-bar.tsx';
import { typographyDoc } from './pages/typography.tsx';
import { avatarDoc } from './pages/avatar.tsx';
import { breadcrumbsDoc } from './pages/breadcrumbs.tsx';
import { cardDoc } from './pages/card.tsx';
import { contextualHelpDoc } from './pages/contextual-help.tsx';
import { dialogDoc } from './pages/dialog.tsx';
import { disclosureDoc } from './pages/disclosure.tsx';
import { footerDoc } from './pages/footer.tsx';
import { imageDoc } from './pages/image.tsx';
import { keyValueListDoc } from './pages/key-value-list.tsx';
import { paginationDoc } from './pages/pagination.tsx';
import { popoverDoc } from './pages/popover.tsx';
import { sheetDoc } from './pages/sheet.tsx';
import { sideNavDoc } from './pages/side-nav.tsx';
import { stepperDoc } from './pages/stepper.tsx';
import { tabStripDoc } from './pages/tab-strip.tsx';
import { tabsDoc } from './pages/tabs.tsx';
import { tooltipDoc } from './pages/tooltip.tsx';
import { usageMeterDoc } from './pages/usage-meter.tsx';
import { userMenuDoc } from './pages/user-menu.tsx';
import { verifiedBadgeDoc } from './pages/verified-badge.tsx';
import { dataTableDoc } from './pages/data-table.tsx';
import { filterBarDoc } from './pages/filter-bar.tsx';
import { bulkActionBarDoc } from './pages/bulk-action-bar.tsx';
import { listDoc } from './pages/list.tsx';
import { statTileDoc } from './pages/stat-tile.tsx';
import { timelineDoc } from './pages/timeline.tsx';
import { diffViewDoc } from './pages/diff-view.tsx';
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
  numberFieldDoc,
  sliderDoc,
  datePickerDoc,
  timeFieldDoc,
  otpFieldDoc,
  fileUploadDoc,
  inlineAlertDoc,
  bannerDoc,
  toastDoc,
  badgeDoc,
  statusBadgeDoc,
  progressMeterDoc,
  usageMeterDoc,
  spinnerDoc,
  skeletonDoc,
  emptyStateDoc,
  errorPageDoc,
  dialogDoc,
  sheetDoc,
  popoverDoc,
  tooltipDoc,
  contextualHelpDoc,
  avatarDoc,
  verifiedBadgeDoc,
  cardDoc,
  imageDoc,
  keyValueListDoc,
  sideNavDoc,
  tabStripDoc,
  tabsDoc,
  breadcrumbsDoc,
  paginationDoc,
  stepperDoc,
  disclosureDoc,
  userMenuDoc,
  footerDoc,
  dataTableDoc,
  filterBarDoc,
  bulkActionBarDoc,
  listDoc,
  statTileDoc,
  timelineDoc,
  diffViewDoc,
];

export function findDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((d) => d.slug === slug);
}

// @vitest-environment node
import { iconCopy, iconLock, iconUser } from '@negaresh/icons';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  AccountPill,
  Button,
  ButtonGroup,
  Code,
  Container,
  CopyButton,
  Divider,
  Grid,
  Heading,
  Icon,
  IconButton,
  Inline,
  Link,
  LinkButton,
  LogoSlot,
  Ltr,
  Menu,
  MenuItem,
  MenuTrigger,
  ReactAriaLocalizationScript,
  Section,
  SkipLink,
  Stack,
  Surface,
  Text,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavLink,
  VisuallyHidden,
  TextField,
  TextArea,
  SearchField,
  PhoneField,
  SerialField,
  CodeField,
  PasswordField,
  Form,
  FieldGroup,
  FormErrorSummary,
  Select,
  SelectItem,
  ComboBox,
  Autocomplete,
  ComboBoxItem,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  ChoiceCard,
  SegmentedControl,
  SegmentedControlItem,
  Switch,
  TagGroup,
  Tag,
  TagField,
  NumberField,
  Slider,
  RangeSlider,
  Calendar,
  RangeCalendar,
  DatePicker,
  DateRangePicker,
  TimeField,
  OTPField,
  DropZone,
  FileUpload,
  InlineAlert,
  Banner,
  Toast,
  ToastProvider,
  Badge,
  StatusBadge,
  ProgressBar,
  Meter,
  UsageMeter,
  Spinner,
  GlobalLoadingBar,
  Skeleton,
  EmptyState,
  ErrorState,
  ErrorPage,
  DialogTrigger,
  Dialog,
  AlertDialog,
  Sheet,
  Drawer,
  PopoverTrigger,
  Popover,
  TooltipTrigger,
  Tooltip,
  ContextualHelp,
  Avatar,
  AvatarGroup,
  VerifiedBadge,
  Card,
  CardMedia,
  CardBody,
  CardFooter,
  Image,
  KeyValueList,
  KeyValueItem,
} from './index.ts';
import { faMessages } from './messages/fa.ts';

describe('server rendering', () => {
  it('renders every component without window or document', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(
      <>
        <ReactAriaLocalizationScript nonce="ssr-nonce" />
        <ThemeProvider messages={faMessages}>
          <SkipLink />
          <TopBar
            brand={
              <TopBarBrand href="/" aria-label="رجیستری نگارش برتر">
                <LogoSlot name="نگارش برتر" product="رجیستری" />
              </TopBarBrand>
            }
            nav={
              <TopBarNav aria-label="بخش‌های رجیستری">
                <TopBarNavLink href="#main" isCurrent>
                  فعال‌سازی
                </TopBarNavLink>
              </TopBarNav>
            }
            actions={
              <AccountPill label="۰۹۱۲ ••• ۴۵۶۷" ltr aria-label="حساب کاربری ۰۹۱۲ ••• ۴۵۶۷" />
            }
          />
          <Container>
            <Stack>
              <LogoSlot name="نگارش برتر" product="رجیستری" />
              <Heading level={1}>عنوان</Heading>
              <Text tone="muted">متن</Text>
              <Inline>
                <Ltr>a@b.ir</Ltr>
                <Code>N25AG-EMV0K</Code>
                <Icon icon={iconCopy} />
                <VisuallyHidden>پنهان</VisuallyHidden>
              </Inline>
              <Grid columns={2}>
                <Surface>
                  <Section>بدنه</Section>
                  <Section tone="sunken">
                    <ButtonGroup>
                      <Button variant="primary" iconStart={iconLock} isPending>
                        پرداخت
                      </Button>
                      <LinkButton href="/a">پیوند</LinkButton>
                      <IconButton icon={iconUser} aria-label="حساب" />
                      <CopyButton value="123" />
                    </ButtonGroup>
                  </Section>
                </Surface>
              </Grid>
              <Divider />
              <Form validationErrors={{ email: 'نشانی را بررسی کنید' }}>
                <FormErrorSummary errors={[{ id: 'ssr-email', message: 'نشانی را بررسی کنید' }]} />
                <FieldGroup label="مشخصات تماس" description="راه ارتباطی">
                  <TextField
                    id="ssr-email"
                    name="email"
                    label="ایمیل"
                    type="email"
                    showCharacterCount
                  />
                  <TextArea label="پیام" defaultValue="درخواست راهنمایی" />
                  <PhoneField label="تلفن" name="phone" defaultValue="۰۹۱۲۱۲۳۴۵۶۷" />
                </FieldGroup>
                <SearchField label="جست‌وجو" defaultValue="نگرش" />
                <SerialField label="سریال" defaultValue="n25ag emv0k" />
                <CodeField label="کد سیستم" defaultValue="882859354" />
                <PasswordField label="گذرواژه" />
                <Select label="استان" defaultValue="tehran">
                  <SelectItem id="tehran">تهران</SelectItem>
                </Select>
                <ComboBox label="آزمون">
                  <ComboBoxItem id="neo">نئو</ComboBoxItem>
                </ComboBox>
                <Autocomplete label="تخصص">
                  <ComboBoxItem id="cbt">شناختی</ComboBoxItem>
                </Autocomplete>
                <CheckboxGroup label="کانال" defaultValue={['sms']}>
                  <Checkbox value="sms">پیامک</Checkbox>
                </CheckboxGroup>
                <RadioGroup label="بسته" defaultValue="pro">
                  <Radio value="base">پایه</Radio>
                  <ChoiceCard value="pro" title="کلینیک" price={250000} />
                </RadioGroup>
                <SegmentedControl label="نما" defaultValue="pro">
                  <SegmentedControlItem id="pro">حرفه‌ای</SegmentedControlItem>
                  <SegmentedControlItem id="calm">آرام</SegmentedControlItem>
                </SegmentedControl>
                <Switch defaultSelected>ارسال خودکار</Switch>
                <TagGroup label="برچسب‌ها">
                  <Tag id="t1">روان‌سنجی</Tag>
                </TagGroup>
                <TagField label="کلیدواژه" defaultValue={['آزمون']} />
                <NumberField label="ظرفیت" defaultValue={12} suffix="نفر" />
                <Slider label="میزان" defaultValue={40} ticks={[0, 50, 100]} />
                <RangeSlider label="بازهٔ قیمت" defaultValue={[20, 80]} />
                <Calendar aria-label="تقویم جلسه" defaultValue="2026-11-13" />
                <RangeCalendar
                  aria-label="بازهٔ تقویم"
                  defaultValue={{ start: '2026-11-11', end: '2026-11-15' }}
                />
                <DatePicker label="تاریخ شروع" defaultValue="2026-11-13" />
                <DateRangePicker
                  label="بازهٔ برگزاری"
                  defaultValue={{ start: '2026-11-11', end: '2026-11-17' }}
                />
                <TimeField label="ساعت جلسه" defaultValue="14:30" />
                <OTPField label="کد تأیید" defaultValue="۴۸۲۹۱۶" resendSecondsRemaining={30} />
                <DropZone aria-label="منطقهٔ رهاسازی" />
                <FileUpload
                  label="فهرست سریال‌ها"
                  defaultItems={[
                    {
                      id: 'ssr-file-1',
                      name: 'serials.csv',
                      size: 4096,
                      type: 'text/csv',
                      status: 'uploading',
                      progress: 60,
                    },
                  ]}
                />
              </Form>
              <Link href="https://negaresh.ir" external>
                نگارش
              </Link>
              <Toolbar aria-label="ابزار">
                <ToggleButton>پررنگ</ToggleButton>
              </Toolbar>
              <ToggleButtonGroup aria-label="نما">
                <ToggleButton id="a">الف</ToggleButton>
              </ToggleButtonGroup>
              <MenuTrigger>
                <Button>منو</Button>
                <Menu>
                  <MenuItem id="x">گزینه</MenuItem>
                </Menu>
              </MenuTrigger>
              <ToastProvider>
                <InlineAlert tone="success" title="موفق" isDismissible>
                  کد فعال‌سازی ساخته شد.
                </InlineAlert>
                <Banner tone="info" title="اطلاعیه" isDismissible>
                  به‌روزرسانی سامانه انجام شد.
                </Banner>
                <Toast title="پیوند کپی شد" tone="neutral" />
                <Badge tone="accent">باز شده از برنامه</Badge>
                <StatusBadge domain="serial" status="limit_reached" />
                <ProgressBar label="بارگذاری" value={64} />
                <Meter label="مصرف حافظه" value={72} />
                <UsageMeter
                  label="رایانه‌های فعال‌شده"
                  used={1}
                  limit={1}
                  sourceNote="سقف پیش‌فرض محصول"
                />
                <Spinner size="md" />
                <GlobalLoadingBar isLoading position="static" />
                <Skeleton variant="table" rows={2} columns={3} />
                <EmptyState
                  icon={iconLock}
                  title="موردی وجود ندارد"
                  description="هنوز داده‌ای ثبت نشده است."
                />
                <ErrorState status={404} actionHref="/" />
                <ErrorPage status="maintenance" embedded headingLevel={2} />
                <DialogTrigger>
                  <Button>باز کردن پنجره</Button>
                  <Dialog title="پنجرهٔ نمونه">متن پنجره</Dialog>
                </DialogTrigger>
                <DialogTrigger>
                  <Button variant="danger">حذف</Button>
                  <AlertDialog title="تأیید حذف" tone="danger">
                    آیا مطمئن هستید؟
                  </AlertDialog>
                </DialogTrigger>
                <DialogTrigger>
                  <Button>کشو</Button>
                  <Sheet title="کشوی نمونه" side="start">
                    محتوای کشو
                  </Sheet>
                </DialogTrigger>
                <DialogTrigger>
                  <Button>کشو ۲</Button>
                  <Drawer title="کشوی دوم" side="end">
                    محتوای کشوی دوم
                  </Drawer>
                </DialogTrigger>
                <PopoverTrigger>
                  <Button>پاپ‌اور</Button>
                  <Popover title="جزئیات">متن پاپ‌اور</Popover>
                </PopoverTrigger>
                <TooltipTrigger>
                  <Button>تولتیپ</Button>
                  <Tooltip>راهنمای کوتاه</Tooltip>
                </TooltipTrigger>
                <ContextualHelp title="راهنمای کد سیستم">توضیح کوتاه راهنما</ContextualHelp>
                <AvatarGroup max={2} aria-label="اعضای تیم">
                  <Avatar name="دکتر سارا رضایی" />
                  <Avatar name="آرش نادری" />
                  <Avatar name="مریم کاظمی" />
                </AvatarGroup>
                <VerifiedBadge licenceNumber="12485" />
                <Card>
                  <CardMedia>
                    <Image
                      src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"
                      alt="تصویر نمونه"
                      ratio="16/9"
                    />
                  </CardMedia>
                  <CardBody>بدنهٔ کارت</CardBody>
                  <CardFooter tone="sunken">پاورقی کارت</CardFooter>
                </Card>
                <KeyValueList aria-label="مشخصات">
                  <KeyValueItem
                    label="شمارهٔ سریال"
                    value="NGR-4920-8814"
                    code
                    copyValue="NGR49208814"
                  />
                </KeyValueList>
              </ToastProvider>
            </Stack>
          </Container>
        </ThemeProvider>
      </>,
    );
    for (const name of [
      'SkipLink',
      'TopBar',
      'TopBarBrand',
      'TopBarNav',
      'TopBarNavLink',
      'AccountPill',
      'LogoSlot',
      'Code',
      'Icon',
      'Surface',
      'Button',
      'LinkButton',
      'IconButton',
      'Link',
      'Toolbar',
      'ToggleButtonGroup',
      'TextField',
      'TextArea',
      'SearchField',
      'PhoneField',
      'SerialField',
      'CodeField',
      'PasswordField',
      'Form',
      'FieldGroup',
      'FormErrorSummary',
      'Select',
      'ComboBox',
      'Checkbox',
      'CheckboxGroup',
      'RadioGroup',
      'Radio',
      'ChoiceCard',
      'SegmentedControl',
      'SegmentedControlItem',
      'Switch',
      'TagGroup',
      'Tag',
      'TagField',
      'NumberField',
      'Slider',
      'RangeSlider',
      'Calendar',
      'RangeCalendar',
      'DatePicker',
      'DateRangePicker',
      'TimeField',
      'OTPField',
      'DropZone',
      'FileUpload',
      'InlineAlert',
      'Banner',
      'Toast',
      'Badge',
      'ProgressBar',
      'Meter',
      'UsageMeter',
      'Spinner',
      'GlobalLoadingBar',
      'Skeleton',
      'EmptyState',
      'ErrorState',
      'ErrorPage',
      'ContextualHelp',
      'Avatar',
      'AvatarGroup',
      'VerifiedBadge',
      'Card',
      'CardMedia',
      'CardBody',
      'CardFooter',
      'Image',
      'KeyValueList',
      'KeyValueItem',
    ]) {
      expect(html, name).toContain(`data-nds="${name}"`);
    }
    expect(html).toContain('N25AG-EMV0K');
    expect(html).toContain('۲۵۰٬۰۰۰ تومان');
    expect(html).toContain('آبان ۱۴۰۵');
    expect(html).toContain('افزایش ظرفیت');
    expect(html).toContain('کاهش ظرفیت');
    expect(html).toContain('رقم ۱ از ۶');
    expect(html).toContain('ارسال دوباره تا ۳۰ ثانیهٔ دیگر');
    expect(html).toContain('serials.csv');
    expect(html).toContain('سقف پر شده');
    expect(html).toContain('۱ از ۱');
    expect(html).toContain('صفحهٔ مورد نظر پیدا نشد');
    expect(html).toContain('سامانه در حال به‌روزرسانی است');
    expect(html).toContain('پروانهٔ تأییدشده');
    expect(html).toContain('۱۲۴۸۵');
    expect(html).toContain('س ر');
    expect(html).toContain('+۱');
    expect(html).toContain('nonce="ssr-nonce"');
    expect(html).toContain('react-aria.i18n.strings');
    expect(html).toContain('بستن');
  });
});

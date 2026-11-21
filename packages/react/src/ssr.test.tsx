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
    ]) {
      expect(html, name).toContain(`data-nds="${name}"`);
    }
    expect(html).toContain('N25AG-EMV0K');
    expect(html).toContain('۲۵۰٬۰۰۰ تومان');
    expect(html).toContain('nonce="ssr-nonce"');
    expect(html).toContain('react-aria.i18n.strings');
    expect(html).toContain('بستن');
  });
});

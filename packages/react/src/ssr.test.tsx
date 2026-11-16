// @vitest-environment node
import { iconCopy, iconLock, iconUser } from '@negaresh/icons';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
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
  Section,
  SkipLink,
  Stack,
  Surface,
  Text,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
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
} from './index.ts';
import { faMessages } from './messages/fa.ts';

describe('server rendering', () => {
  it('renders every component without window or document', () => {
    expect(typeof window).toBe('undefined');
    const html = renderToString(
      <ThemeProvider messages={faMessages}>
        <SkipLink />
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
      </ThemeProvider>,
    );
    for (const name of [
      'SkipLink',
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
    ]) {
      expect(html, name).toContain(`data-nds="${name}"`);
    }
    expect(html).toContain('N25AG-EMV0K');
  });
});

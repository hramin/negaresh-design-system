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
    ]) {
      expect(html, name).toContain(`data-nds="${name}"`);
    }
    expect(html).toContain('N25AG-EMV0K');
  });
});

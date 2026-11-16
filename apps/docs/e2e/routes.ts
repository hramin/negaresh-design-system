/** Every docs route covered by smoke, axe and visual tests. */
export const COMPONENT_SLUGS = [
  'theme-provider',
  'layout',
  'surface',
  'typography',
  'ltr-code',
  'icon',
  'logo-slot',
  'a11y-helpers',
  'button',
  'link',
  'button-group',
  'toggle-button',
  'copy-button',
  'menu',
  'text-field',
  'text-area',
  'search-field',
  'phone-field',
  'serial-field',
  'password-field',
  'form',
] as const;

export const ROUTES = [
  '/',
  '/tokens',
  '/foundations/color',
  '/foundations/icons',
  '/components',
  ...COMPONENT_SLUGS.map((s) => `/components/${s}`),
  '/reference/registry-activation',
  '/reference/registry-activation?state=success',
  '/reference/registry-activation?state=limit',
] as const;

export const THEMES = ['light', 'dark'] as const;

/** Adds `theme` to a route that may already have a query. */
export const withTheme = (route: string, theme: string) =>
  `${route}${route.includes('?') ? '&' : '?'}theme=${theme}`;

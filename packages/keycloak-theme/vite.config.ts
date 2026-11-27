import viteReact from '@vitejs/plugin-react';
import { keycloakify } from 'keycloakify/vite-plugin';
import { defaultClientConditions, defineConfig } from 'vite';

// Keycloakify login theme Vite build (consumed by `vite build` and `keycloakify build`).
// Outputs the self-contained web bundle into `dist-theme/` (tokens, Vazirmatn subset, NDS CSS)
// and packages `dist_keycloak/negaresh-keycloak-theme.jar` for Keycloak 26+ when `build:jar` runs.
export default defineConfig({
  plugins: [
    viteReact(),
    keycloakify({
      themeName: 'negaresh',
      accountThemeImplementation: 'none',
      artifactId: 'negaresh-keycloak-theme',
      groupId: 'ir.negaresh.nds',
      keycloakifyBuildDirPath: 'dist_keycloak',
      keycloakVersionTargets: {
        '22-to-25': false,
        'all-other-versions': 'negaresh-keycloak-theme.jar',
      },
    }),
  ],
  resolve: {
    conditions: ['@negaresh/source', ...defaultClientConditions],
  },
  css: {
    modules: {
      generateScopedName: 'nds-kc-[local]-[hash:base64:5]',
    },
  },
  build: {
    outDir: 'dist-theme',
    emptyOutDir: true,
    sourcemap: false,
  },
});

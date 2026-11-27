import { lazy, Suspense } from 'react';
import { useI18n } from './i18n.ts';
import type { KcContext } from './KcContext.ts';

const DefaultPage = lazy(() => import('keycloakify/login/DefaultPage'));
const Template = lazy(() => import('keycloakify/login/Template'));
const UserProfileFormFields = lazy(() => import('keycloakify/login/UserProfileFormFields'));

/**
 * Lazy-loaded Keycloakify fallback for unmapped `pageId`s.
 * Kept isolated from `KcPage.tsx` because `keycloakify/login/i18n`'s `i18nBuilder.build()`
 * accesses `document` at module evaluation time and must not run during Node SSR.
 */
export default function DefaultFallback({
  kcContext,
}: {
  kcContext: Extract<KcContext, { pageId: Parameters<typeof DefaultPage>[0]['kcContext']['pageId'] }>;
}) {
  const { i18n } = useI18n({ kcContext });
  return (
    <Suspense>
      <DefaultPage
        kcContext={kcContext}
        i18n={i18n}
        classes={{}}
        Template={Template}
        doUseDefaultCss={false}
        UserProfileFormFields={UserProfileFormFields}
        doMakeUserConfirmPassword={true}
      />
    </Suspense>
  );
}

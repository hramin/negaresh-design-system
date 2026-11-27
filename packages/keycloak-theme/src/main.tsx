import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { KcPage } from './kc.gen.tsx';

const rootEl = document.getElementById('root');

if (rootEl && window.kcContext) {
  createRoot(rootEl).render(
    <StrictMode>
      <KcPage kcContext={window.kcContext} />
    </StrictMode>,
  );
}

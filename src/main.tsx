import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Static Inter registers the plain 'Inter' family the mk-styleguide tokens ask for.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import Root from './Root.tsx';
import 'antd/dist/reset.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

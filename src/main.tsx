import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
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

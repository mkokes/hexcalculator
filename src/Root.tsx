import { ConfigProvider } from 'antd';
import App from './App';
import { themeConfig } from './theme';
import { useThemeMode } from './useThemeMode';

export default function Root() {
  const { mode, pref, setPref } = useThemeMode();
  return (
    <ConfigProvider theme={themeConfig(mode)}>
      <App themePref={pref} onThemePrefChange={setPref} />
    </ConfigProvider>
  );
}

import { theme, type ThemeConfig } from 'antd';

export type Mode = 'light' | 'dark';
export type ThemePref = Mode | 'system';

// Also read by the inline script in index.html, which sets the theme before first paint.
export const THEME_KEY = 'hexcalc_theme';

// Hex mirror of the mk-styleguide role tokens (styleguide/tailwind.css). antd needs real colours to
// derive hover/active shades, so it can't read the CSS variables; keep these in step with the tokens.
export const palette = {
  light: {
    link: '#476700', // --color-link (primary-700)
    bg: '#FFFFFF', // --color-bg
    surface: '#F7F7F7', // --color-surface (neutral-50)
    text: '#242424', // --color-text (neutral-950)
    textMuted: '#6E6E6E', // --color-text-muted (neutral-600)
    border: '#D9D9D9', // --color-border (neutral-200)
  },
  dark: {
    link: '#BAFF39', // primary-100
    bg: '#242424', // neutral-950
    surface: '#383838', // neutral-900
    text: '#F7F7F7', // neutral-50
    textMuted: '#C1C1C1', // neutral-300
    border: '#484848', // neutral-800
  },
};

// The lime fill is the same in both modes: --color-primary (primary-100) with --color-on-primary text.
export const lime = {
  fill: '#BAFF39',
  hover: '#B0F22F', // primary-200
  active: '#9AD816', // primary-300
  onFill: '#242424',
};

export function themeConfig(mode: Mode): ThemeConfig {
  const c = palette[mode];
  return {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // antd's "primary" drives links, focus and selected states: the link role.
      colorPrimary: c.link,
      colorLink: c.link,
      colorTextLightSolid: mode === 'dark' ? lime.onFill : '#FFFFFF',
      colorBgLayout: c.bg,
      colorBgContainer: c.bg,
      colorBgElevated: mode === 'dark' ? c.surface : c.bg,
      colorText: c.text,
      colorTextSecondary: c.textMuted,
      colorBorder: c.border,
      colorBorderSecondary: c.border,
      borderRadius: 10, // --radius-md
      borderRadiusLG: 16, // --radius-lg
      borderRadiusSM: 6, // --radius-sm
      fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
    },
    components: {
      // Primary buttons are a lime fill with dark text, and every button is a pill.
      Button: {
        colorPrimary: lime.fill,
        colorPrimaryHover: lime.hover,
        colorPrimaryActive: lime.active,
        primaryColor: lime.onFill,
        primaryShadow: 'none',
        borderRadius: 9999,
        borderRadiusLG: 9999,
        borderRadiusSM: 9999,
      },
      // Cards sit on the surface colour with a 1px border instead of a shadow.
      Card: { colorBgContainer: c.surface },
      Layout: { headerBg: c.bg, bodyBg: c.bg },
      // The selected segment uses the lime fill, like the primary action.
      Segmented: {
        itemSelectedBg: lime.fill,
        itemSelectedColor: lime.onFill,
        trackBg: c.surface,
      },
    },
  };
}

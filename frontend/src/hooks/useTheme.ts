import { useEffect, useState } from 'react';
import { ThemeData } from '@/lib/themeTypes';
import { useDynamicFonts, initializeFontPreloading } from './useDynamicFonts';

/**
 * Themes are static JSON files in design-system/themes/ (served at /static/themes/{name}.json).
 * Pick one with VITE_FRONTEND_THEME in .env. To add a theme, drop a JSON in design-system/themes/.
 */

const FALLBACK_THEME: ThemeData = {
  name: 'fallback',
  display_name: 'Fallback',
  css_vars: {
    theme: {
      'font-sans': 'system-ui, sans-serif',
      'font-serif': 'Georgia, serif',
      'font-mono': 'monospace',
      radius: '0.375rem',
    },
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.15 0 0)',
      primary: 'oklch(0.6231 0.188 259.8145)',
      secondary: 'oklch(0.967 0.0029 264.5419)',
      accent: 'oklch(0.9514 0.025 236.8242)',
      muted: 'oklch(0.9608 0.0155 264.538)',
      card: 'oklch(1 0 0)',
      border: 'oklch(0.9216 0.0266 264.5312)',
    },
    dark: {
      background: 'oklch(0.0902 0 0)',
      foreground: 'oklch(0.9216 0.0266 264.5312)',
      primary: 'oklch(0.6231 0.188 259.8145)',
      secondary: 'oklch(0.1725 0.0118 264.5419)',
      accent: 'oklch(0.1686 0.0157 236.8242)',
      muted: 'oklch(0.1412 0.0166 264.538)',
      card: 'oklch(0.0902 0 0)',
      border: 'oklch(0.1725 0.0118 264.5419)',
    },
  },
};

async function fetchTheme(name: string): Promise<ThemeData> {
  const response = await fetch(`/static/themes/${name}.json`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  return {
    name: json.theme_name,
    display_name: json.display_name,
    css_vars: {
      theme: json.cssVars.theme,
      light: json.cssVars.light,
      dark: json.cssVars.dark,
    },
  };
}

export const useTheme = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightMode, setLightMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('theme-mode');
    if (stored) return stored === 'light';
    return !window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const fontVariables = themeSettings?.css_vars?.theme || {};
  const { fontsReady, loadedFonts } = useDynamicFonts(fontVariables);

  useEffect(() => {
    const themeName = import.meta.env.VITE_FRONTEND_THEME || 'vercel';
    (async () => {
      try {
        const theme = await fetchTheme(themeName);
        await initializeFontPreloading(theme.css_vars.theme);
        applyThemeToDOM(theme);
        setThemeSettings(theme);
      } catch {
        await initializeFontPreloading(FALLBACK_THEME.css_vars.theme);
        applyThemeToDOM(FALLBACK_THEME);
        setThemeSettings(FALLBACK_THEME);
        setError(`Failed to load theme "${themeName}", using fallback`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (lightMode) root.classList.remove('dark');
    else root.classList.add('dark');
    localStorage.setItem('theme-mode', lightMode ? 'light' : 'dark');
  }, [lightMode]);

  const toggleLightMode = () => setLightMode((prev) => !prev);

  return {
    themeSettings,
    isLoading: isLoading || !fontsReady,
    error,
    loadedFonts,
    fontsReady,
    lightMode,
    toggleLightMode,
  };
};

function applyThemeToDOM(theme: ThemeData) {
  const root = document.documentElement;

  Object.entries(theme.css_vars.theme).forEach(([property, value]) => {
    root.style.setProperty(`--${property}`, String(value));
    if (property === 'font-size') {
      document.documentElement.style.fontSize = String(value);
    }
  });

  const styleId = 'app-theme-styles';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  // OKLCH values are stored bare (without the oklch() wrapper) so Tailwind opacity modifiers work.
  const processColorValue = (value: string): string => {
    const match = value.match(/oklch\(([^)]+)\)/);
    return match ? match[1] : value;
  };

  const block = (selector: string, vars: Record<string, string>) =>
    `${selector} {\n  ${Object.entries(vars)
      .map(([k, v]) => `--${k}: ${processColorValue(String(v))};`)
      .join('\n  ')}\n}`;

  styleEl.textContent = `${block(':root', theme.css_vars.light)}\n\n${block('.dark', theme.css_vars.dark)}`;
}

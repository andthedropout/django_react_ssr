// Static theme JSON shape (one file per theme in design-system/themes/).
export interface TweakcnTheme {
  theme_name: string;
  display_name: string;
  cssVars: {
    theme: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  success: boolean;
}

// Normalised shape used everywhere in the app.
export interface ThemeData {
  name: string;
  display_name: string;
  description?: string;
  css_vars: {
    theme: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  version?: string;
}

export function legacyThemeToThemeData(t: TweakcnTheme): ThemeData {
  return {
    name: t.theme_name,
    display_name: t.display_name,
    css_vars: t.cssVars,
    version: '1.0.0',
  };
}

import { useState } from 'react';

export interface ThemeTokens {
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentSoft: string;
}

const read = (): ThemeTokens => {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return {
    text: token('--text-primary'),
    muted: token('--text-muted'),
    border: token('--border-strong'),
    accent: token('--accent'),
    accentSoft: token('--accent-soft'),
  };
};

/** Shared ECharts axis styling (grid line, labels, axis name). */
export const axisStyle = (themeTokens: ThemeTokens) => {
  return {
    nameTextStyle: { color: themeTokens.muted },
    axisLine: { lineStyle: { color: themeTokens.border } },
    axisLabel: { color: themeTokens.muted },
    splitLine: { lineStyle: { color: themeTokens.border, opacity: 0.4 } },
  };
};

/** Design-token color for charts, read once from the (dark-only) theme. */
export const useThemeTokens = (): ThemeTokens => {
  const [tokens] = useState<ThemeTokens>(read);
  return tokens;
};

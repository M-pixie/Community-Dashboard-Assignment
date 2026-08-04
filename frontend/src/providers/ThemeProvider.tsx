'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from '@wrksz/themes';
import { type ThemeProviderProps } from '@wrksz/themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { WeatherProvider } from '@/context/WeatherContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WeatherProvider>
        {children}
      </WeatherProvider>
    </ThemeProvider>
  );
}
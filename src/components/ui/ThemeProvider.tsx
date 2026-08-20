'use client';
import { ThemeProvider as NTP } from 'next-themes';
import { ReactNode } from 'react';
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NTP attribute="class" defaultTheme="light" enableSystem={false} storageKey="wda-theme">
      {children}
    </NTP>
  );
}

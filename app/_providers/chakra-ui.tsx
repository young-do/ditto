'use client';

// ref: https://v2.chakra-ui.com/getting-started/nextjs-app-guide
import Fonts from '@/styles/Font';
import theme from '@/styles/theme';
import { ChakraProvider } from '@chakra-ui/react';

export function ChakraUiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme} resetCSS cssVarsRoot="#app">
      <Fonts />
      {children}
    </ChakraProvider>
  );
}

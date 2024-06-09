'use client';

import { ChakraUiProvider } from './chakra-ui';
import { QueryProvider } from './react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ChakraUiProvider>{children}</ChakraUiProvider>
    </QueryProvider>
  );
}

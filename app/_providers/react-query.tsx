'use client';

// ref: https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-suspense-streaming

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
// import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            useErrorBoundary: true,
            retry: 0,
            refetchOnMount: false,
            keepPreviousData: true,
          },
          mutations: {
            useErrorBoundary: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryStreamedHydration>{props.children}</ReactQueryStreamedHydration> */}
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

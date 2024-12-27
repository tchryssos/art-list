/* eslint-disable react/jsx-props-no-spreading */
import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';

import { AUTH_PROPS_KEY } from '~/constants/auth';
import { AuthContextProvider } from '~/logic/contexts/authContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function Page({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider authorized={pageProps[AUTH_PROPS_KEY]}>
        <Component {...pageProps} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default Page;

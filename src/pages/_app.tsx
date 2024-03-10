/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps /* , AppContext */ } from 'next/app';

import { AuthContextProvider } from '~/logic/contexts/authContext';

function Page({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default Page;

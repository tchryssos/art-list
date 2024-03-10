/* eslint-disable react/jsx-props-no-spreading */
import '../global.css';

import type { AppProps } from 'next/app';

import { AuthContextProvider } from '~/logic/contexts/authContext';

function Page({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default Page;

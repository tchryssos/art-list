/* eslint-disable react/jsx-props-no-spreading */
import '../global.css';

import type { AppProps } from 'next/app';

import { AUTH_PROPS_KEY } from '~/constants/auth';
import { AuthContextProvider } from '~/logic/contexts/authContext';

function Page({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider authorized={pageProps[AUTH_PROPS_KEY]}>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default Page;

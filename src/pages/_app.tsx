/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps /* , AppContext */ } from 'next/app';
import { useEffect, useState } from 'react';

import { themes } from '~/constants/theme';
import { AuthContext } from '~/logic/contexts/authContext';
import { ColorMode } from '~/typings/colorMode';
import { BreakpointsContext } from '~/logic/contexts/breakpointsContext';

function Page({ Component, pageProps }: AppProps) {
  const [colorMode] = useState<ColorMode>('standard');
  const theme = themes[colorMode];

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (globalThis.document?.cookie) {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && !globalThis.document?.cookie) {
      globalThis.document.cookie = 'isAuthorized=true';
    }
  }, [isAuthorized]);

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default Page;

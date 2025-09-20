import type { PropsWithChildren } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

import { AUTH_ME_ROUTE } from '~/constants/routing';

type AuthContextType = {
  isAuthorized: boolean | null;
  setIsAuthorized: (isAuthorized: boolean) => void;
  spotifyAuthorizationCode: string | null | undefined;
  setSpotifyAuthorizationCode: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthorized: null,
  setIsAuthorized: () => null,
  spotifyAuthorizationCode: null,
  setSpotifyAuthorizationCode: () => null,
});

interface AuthContextProviderProps {
  authorized?: boolean;
}

export function AuthContextProvider({
  children,
  authorized: _authorized,
}: PropsWithChildren<AuthContextProviderProps>) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(
    _authorized === undefined ? null : _authorized
  );
  const [spotifyAuthorizationCode, setSpotifyAuthorizationCode] = useState<
    string | null | undefined
  >(undefined);

  useEffect(() => {
    const checkMe = async () => {
      const resp = await fetch(AUTH_ME_ROUTE);
      const { authorized } = await resp.json();
      setIsAuthorized(Boolean(authorized || false));
    };
    checkMe();
  }, []);

  const providerValue = useMemo(
    () => ({
      isAuthorized,
      setIsAuthorized,
      spotifyAuthorizationCode,
      setSpotifyAuthorizationCode,
    }),
    [isAuthorized, spotifyAuthorizationCode]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

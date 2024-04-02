import { useRouter } from 'next/router';
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AUTH_ME_ROUTE } from '~/constants/routing';

type AuthContextType = {
  isAuthorized: boolean | null;
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthorized: null,
  setIsAuthorized: () => null,
});

export function AuthContextProvider({ children }: PropsWithChildren<unknown>) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { pathname } = useRouter();

  useEffect(() => {
    const checkMe = async () => {
      const resp = await fetch(AUTH_ME_ROUTE);
      const { authorized } = await resp.json();
      setIsAuthorized(Boolean(authorized || false));
    };
    checkMe();
  }, [pathname]);

  const providerValue = useMemo(
    () => ({ isAuthorized, setIsAuthorized }),
    [isAuthorized]
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

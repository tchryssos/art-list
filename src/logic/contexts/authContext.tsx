import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthContextType = {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthorized: false,
  setIsAuthorized: () => null,
});

export function AuthContextProvider({ children }: PropsWithChildren<unknown>) {
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

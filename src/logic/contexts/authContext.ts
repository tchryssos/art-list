import { createContext } from 'react';

type AuthContextType = {
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthorized: false,
  setIsAuthorized: () => null,
});

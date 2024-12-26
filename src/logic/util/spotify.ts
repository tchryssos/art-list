import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import { SPOTIFY_CODE_STATE_KEY } from '~/constants/localStorage';
import { ART_ADD_ROUTE, createSpotifyOauthRoute } from '~/constants/routing';

import { AuthContext } from '../contexts/authContext';
import { getUnsafeRandomString } from './getUnsafeRandomString';

interface SpotifyParams {
  code?: string;
  error?: string;
  state: string;
}

export const useSpotifyAuth = (spotifyId: string) => {
  const { push, query } = useRouter();
  const { code, error, state } = query as Partial<SpotifyParams>;
  const { spotifyToken } = useContext(AuthContext);

  useEffect(() => {
    if (spotifyToken === null && !(code || error)) {
      const freshState = getUnsafeRandomString(16);
      localStorage.setItem(SPOTIFY_CODE_STATE_KEY, freshState);
      const redirect = createSpotifyOauthRoute({
        state: freshState,
        redirect_uri: `${window.location.origin}${ART_ADD_ROUTE}`,
        client_id: spotifyId || '',
      });
      push(redirect);
    }
  }, [spotifyToken, push, code, error, spotifyId]);

  return {
    spotifyToken,
  };
};

import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { SPOTIFY_CODE_STATE_KEY } from '~/constants/localStorage';
import {
  ART_ADD_ROUTE,
  createSpotifyOauthRoute,
  getSpotifyRedirectUri,
} from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { getUnsafeRandomString } from '~/logic/util/getUnsafeRandomString';

interface SpotifyParams {
  code?: string;
  error?: string;
  state: string;
}

interface UseSpotifyAuthReturn {
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook that manages Spotify OAuth flow.
 *
 * Handles:
 * - Initiating OAuth when enabled and no auth code exists
 * - Processing OAuth callback with CSRF state validation
 * - Error handling for OAuth failures
 *
 * @param enabled - Whether the now playing feature is enabled
 * @param spotifyId - Spotify client ID for OAuth
 */
export function useSpotifyAuth(
  enabled: boolean,
  spotifyId: string
): UseSpotifyAuthReturn {
  const { push, query } = useRouter();
  const { code, error: paramError, state } = query as Partial<SpotifyParams>;
  const { spotifyAuthorizationCode, setSpotifyAuthorizationCode } =
    useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  const stateMatches =
    state === globalThis.localStorage?.getItem(SPOTIFY_CODE_STATE_KEY);

  /**
   * Initiates Spotify OAuth flow when:
   * - Feature is enabled
   * - No authorization code exists
   * - Not currently processing OAuth callback
   * - Spotify client ID is available
   *
   * Creates a CSRF state token, stores it locally, and redirects to Spotify OAuth
   */
  useEffect(() => {
    if (
      enabled &&
      spotifyAuthorizationCode === undefined &&
      !(code || paramError) &&
      spotifyId
    ) {
      const freshState = getUnsafeRandomString(16);
      localStorage.setItem(SPOTIFY_CODE_STATE_KEY, freshState);
      const redirect = createSpotifyOauthRoute({
        state: freshState,
        redirect_uri: getSpotifyRedirectUri(),
        client_id: spotifyId,
      });
      push(redirect);
    }
  }, [enabled, spotifyAuthorizationCode, push, code, paramError, spotifyId]);

  /**
   * Handles OAuth callback from Spotify:
   * - Validates CSRF state token matches stored value
   * - On error: clears auth state, sets error
   * - On success: stores authorization code, clears errors
   * - Cleans up state token and redirects back to art add page
   */
  useEffect(() => {
    if (stateMatches && (code || paramError)) {
      if (paramError) {
        setError(paramError);
        setSpotifyAuthorizationCode(null);
      } else if (code) {
        setSpotifyAuthorizationCode(code);
        setError(null);
      }
      localStorage.removeItem(SPOTIFY_CODE_STATE_KEY);
      push(ART_ADD_ROUTE, undefined, { shallow: true });
    }
  }, [code, stateMatches, setSpotifyAuthorizationCode, push, paramError]);

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    clearError,
  };
}

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { ListeningToProviders } from '~/constants/listeningTo';
import {
  SPOTIFY_CODE_STATE_KEY,
  USE_NOW_PLAYING_PREFERENCE_KEY,
} from '~/constants/localStorage';
import {
  ART_ADD_ROUTE,
  createSpotifyOauthRoute,
  getSpotifyRedirectUri,
  NOW_PLAYING_ROUTE,
} from '~/constants/routing';
import type { ListeningToResp } from '~/pages/api/listening-to';
import {
  NOW_PLAYING_ACCESS_TOKEN_QUERY,
  NOW_PLAYING_AUTH_CODE_QUERY,
  NOW_PLAYING_REFRESH_TOKEN_QUERY,
} from '~/pages/api/listening-to';
import type { ArtSubmitData } from '~/typings/art';

import { getUnsafeRandomString } from '../util/getUnsafeRandomString';
import { AuthContext } from './authContext';

interface SpotifyParams {
  code?: string;
  error?: string;
  state: string;
}

interface NowPlayingContextType {
  // Preference
  enabled: boolean;
  setEnabled: (value: boolean) => void;

  // Data
  nowPlaying: ArtSubmitData['listeningTo'] | null | undefined;
  loading: boolean;
  error: string | null;

  // Actions
  clearError: () => void;
  refetch: () => void;
}

const NowPlayingContext = createContext<NowPlayingContextType>({
  enabled: false,
  setEnabled: () => null,
  nowPlaying: undefined,
  loading: false,
  error: null,
  clearError: () => null,
  refetch: () => null,
});

interface NowPlayingProviderProps {
  spotifyId: string;
}

const nowPlayingKey = 'now-playing-query';

export function NowPlayingProvider({
  children,
  spotifyId,
}: PropsWithChildren<NowPlayingProviderProps>) {
  const { push, query } = useRouter();

  // Preference state with localStorage persistence
  const [enabled, setEnabledState] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(USE_NOW_PLAYING_PREFERENCE_KEY) === 'true';
  });

  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    localStorage.setItem(USE_NOW_PLAYING_PREFERENCE_KEY, String(value));
  };

  // Spotify OAuth state
  const { code, error: paramError, state } = query as Partial<SpotifyParams>;
  const [access, setAccess] = useState<ListeningToResp['access'] | null>(null);
  const { spotifyAuthorizationCode, setSpotifyAuthorizationCode } =
    useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<
    ArtSubmitData['listeningTo'] | null | undefined
  >(undefined);

  const stateMatches =
    state === globalThis.localStorage?.getItem(SPOTIFY_CODE_STATE_KEY);

  // OAuth flow initiation
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

  // Handle OAuth callback
  useEffect(() => {
    if (stateMatches && (code || paramError)) {
      if (paramError) {
        setError(paramError);
        setSpotifyAuthorizationCode(null);
        setNowPlaying(null);
      } else if (code) {
        setSpotifyAuthorizationCode(code);
        setError(null);
      }
      localStorage.removeItem(SPOTIFY_CODE_STATE_KEY);
      push(ART_ADD_ROUTE, undefined, { shallow: true });
    }
  }, [code, stateMatches, setSpotifyAuthorizationCode, push, paramError]);

  // Fetch now playing data
  const {
    error: queryError,
    data,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<ListeningToResp | null>({
    queryKey: [
      nowPlayingKey,
      spotifyAuthorizationCode,
      access?.access_token,
      access?.refresh_token,
    ],
    queryFn: async () => {
      if (!spotifyAuthorizationCode) {
        throw new Error('No Spotify authorization code available');
      }

      const accessQuery = access?.access_token
        ? `&${NOW_PLAYING_ACCESS_TOKEN_QUERY}=${access.access_token}`
        : '';
      const refreshQuery = access?.refresh_token
        ? `&${NOW_PLAYING_REFRESH_TOKEN_QUERY}=${access.refresh_token}`
        : '';

      const resp = await fetch(
        `${NOW_PLAYING_ROUTE}?${NOW_PLAYING_AUTH_CODE_QUERY}=${spotifyAuthorizationCode}${accessQuery}${refreshQuery}`,
        {
          method: 'GET',
        }
      );

      if (resp.ok) {
        if (resp.status === 204) {
          return null; // No music playing
        }
        return resp.json();
      }

      let errorMessage = 'Failed to fetch now playing';
      try {
        const errorData = await resp.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${resp.statusText}`;
      }

      throw new Error(errorMessage);
    },
    enabled: enabled && Boolean(spotifyAuthorizationCode) && !error,
    retry: (failureCount, retryError) => {
      if (
        retryError.message.includes('Authorization') ||
        retryError.message.includes('expired')
      ) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Process query data
  useEffect(() => {
    if (data === null) {
      setNowPlaying(null);
    } else if (data?.nowPlaying?.item) {
      const {
        artists,
        album,
        name,
        id,
        duration_ms: duration,
        external_urls: externalUrls,
      } = data.nowPlaying.item;
      setNowPlaying({
        artistName: artists.map((a) => a.name).join(', '),
        albumName: album.name,
        trackName: name,
        externalId: id,
        duration,
        externalProvider: ListeningToProviders.Spotify,
        externalUrl: externalUrls.spotify,
        imageUrl: album.images[0]?.url || '',
      });
    }

    if (data?.access) {
      setAccess(data.access);
    }
  }, [data]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      console.error('Spotify query error:', queryError);
      setError(queryError.message);
      setNowPlaying(null);
    }
  }, [queryError]);

  const clearError = () => {
    setError(null);
    setNowPlaying(null);
  };

  const contextValue = useMemo(
    () => ({
      enabled,
      setEnabled,
      nowPlaying: error ? null : nowPlaying,
      loading: isLoading || isRefetching,
      error,
      clearError,
      refetch,
    }),
    [enabled, nowPlaying, isLoading, isRefetching, error, refetch]
  );

  return (
    <NowPlayingContext.Provider value={contextValue}>
      {children}
    </NowPlayingContext.Provider>
  );
}

export const useNowPlaying = () => {
  const context = useContext(NowPlayingContext);
  if (!context) {
    throw new Error('useNowPlaying must be used within a NowPlayingProvider');
  }
  return context;
};

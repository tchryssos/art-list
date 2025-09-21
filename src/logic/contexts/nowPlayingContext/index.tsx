import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import type { ArtSubmitData } from '~/typings/art';

import { useNowPlayingPreference } from './hooks/useNowPlayingPreference';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifyQuery } from './hooks/useSpotifyQuery';

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

export function NowPlayingProvider({
  children,
  spotifyId,
}: PropsWithChildren<NowPlayingProviderProps>) {
  // Preference state with localStorage persistence
  const [enabled, setEnabled] = useNowPlayingPreference();

  // Spotify OAuth management
  const { error: authError, clearError: clearAuthError } = useSpotifyAuth(
    enabled,
    spotifyId
  );

  // Spotify data fetching and processing
  const {
    nowPlaying,
    loading,
    error: queryError,
    refetch,
    clearError: clearQueryError,
  } = useSpotifyQuery(enabled, authError);

  // Combined error handling
  const error = authError || queryError;
  const clearError = useCallback(() => {
    clearAuthError();
    clearQueryError();
  }, [clearAuthError, clearQueryError]);

  const contextValue = useMemo(
    () => ({
      enabled,
      setEnabled,
      nowPlaying: error ? null : nowPlaying,
      loading,
      error,
      clearError,
      refetch,
    }),
    [enabled, setEnabled, nowPlaying, loading, error, refetch, clearError]
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

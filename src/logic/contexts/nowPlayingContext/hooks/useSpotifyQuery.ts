import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';

import { ListeningToProviders } from '~/constants/listeningTo';
import { NOW_PLAYING_ROUTE } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import type { ListeningToResp } from '~/pages/api/listening-to';
import {
  NOW_PLAYING_ACCESS_TOKEN_QUERY,
  NOW_PLAYING_AUTH_CODE_QUERY,
  NOW_PLAYING_REFRESH_TOKEN_QUERY,
} from '~/pages/api/listening-to';
import type { ArtSubmitData } from '~/typings/art';

const nowPlayingKey = 'now-playing-query';

interface UseSpotifyQueryReturn {
  nowPlaying: ArtSubmitData['listeningTo'] | null | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  clearError: () => void;
}

/**
 * Custom hook that manages Spotify now playing data fetching and processing.
 *
 * Handles:
 * - React Query configuration for fetching current playback
 * - Token management (access/refresh tokens)
 * - Data transformation from Spotify API to internal format
 * - Error handling and retry logic
 *
 * @param enabled - Whether queries should be enabled
 * @param authError - Any auth-related error that should disable queries
 */
export function useSpotifyQuery(
  enabled: boolean,
  authError: string | null
): UseSpotifyQueryReturn {
  const { spotifyAuthorizationCode } = useContext(AuthContext);
  const [access, setAccess] = useState<ListeningToResp['access'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<
    ArtSubmitData['listeningTo'] | null | undefined
  >(undefined);

  /**
   * React Query hook to fetch current Spotify playback data.
   *
   * Query function:
   * - Requires authorization code from OAuth flow
   * - Builds request with auth code and optional access/refresh tokens
   * - Handles 204 (no music playing) vs 200 (has data) responses
   * - Transforms API errors into readable error messages
   *
   * Configuration:
   * - Only runs when enabled, has auth code, and no current errors
   * - Retries up to 2 times unless auth/token errors (which need re-auth)
   * - Caches for 30s (stale) / 5min (garbage collection)
   */
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
    enabled: enabled && Boolean(spotifyAuthorizationCode) && !authError,
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

  /**
   * Processes React Query data and updates local state:
   * - null data = no music playing (sets nowPlaying to null)
   * - Valid track data = transforms Spotify API response to internal format
   *   - Combines multiple artists into comma-separated string
   *   - Extracts album art, track metadata, and external links
   * - Updates access tokens when provided (for token refresh)
   */
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

  /**
   * Handles React Query errors:
   * - Logs error details for debugging
   * - Sets user-facing error message
   * - Clears nowPlaying data to prevent stale state
   */
  useEffect(() => {
    if (queryError) {
      console.error('Spotify query error:', queryError);
      setError(queryError.message);
      setNowPlaying(null);
    }
  }, [queryError]);

  /**
   * Clears error state and nowPlaying data.
   * Used when user dismisses errors or wants to retry.
   */
  const clearError = () => {
    setError(null);
    setNowPlaying(null);
  };

  return {
    nowPlaying,
    loading: isLoading || isRefetching,
    error,
    refetch,
    clearError,
  };
}

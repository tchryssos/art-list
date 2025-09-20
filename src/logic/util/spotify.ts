/* eslint-disable camelcase */
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { ListeningToProviders } from '~/constants/listeningTo';
import { SPOTIFY_CODE_STATE_KEY } from '~/constants/localStorage';
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

import { AuthContext } from '../contexts/authContext';
import { getUnsafeRandomString } from './getUnsafeRandomString';

interface SpotifyParams {
  code?: string;
  error?: string;
  state: string;
}

const nowPlayingKey = 'now-playing-query';

export const useSpotify = (spotifyId: string) => {
  const { push, query } = useRouter();
  /**
   * Okay, since this is confusing:
   * - `code` is the code returned from Spotify's OAuth flow verifying my user, also known as an "Authorization Code" in their docs
   * - `spotifyAuthorizationCode` is ALSO that code, but just saved to a context rather than the url bar
   * - `access` is an object containing the "Access Token" we get back from Spotify (by providing the Authorization Code), as well as a refresh token and some meta data about that "Access Token"
   */
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

  // If we haven't already stored the auth code, and we don't have a code nor an error
  // in the url, start the Spotify OAuth flow
  useEffect(() => {
    if (
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
  }, [spotifyAuthorizationCode, push, code, paramError, spotifyId]);

  useEffect(() => {
    // If we have a legitimate code or error in the url (validated by state),
    // set the code/error in state and remove the crazy params from the url bar just so
    // it looks nice
    if (stateMatches && (code || paramError)) {
      if (paramError) {
        setError(paramError);
        setSpotifyAuthorizationCode(null);
        setNowPlaying(null); // Clear now playing on error
      } else if (code) {
        setSpotifyAuthorizationCode(code);
        setError(null); // Clear any previous errors
      }
      localStorage.removeItem(SPOTIFY_CODE_STATE_KEY);
      push(ART_ADD_ROUTE, undefined, { shallow: true });
    }
  }, [code, stateMatches, setSpotifyAuthorizationCode, push, paramError]);

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
    enabled: Boolean(spotifyAuthorizationCode) && !error,
    retry: (failureCount, retryError) => {
      // Don't retry on auth errors
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

  // Process the query data and update local state
  useEffect(() => {
    if (data === null) {
      // No music playing
      setNowPlaying(null);
    } else if (data?.nowPlaying?.item) {
      const { artists, album, name, id, duration_ms, external_urls } =
        data.nowPlaying.item;
      setNowPlaying({
        artistName: artists.map((a) => a.name).join(', '),
        albumName: album.name,
        trackName: name,
        externalId: id,
        duration: duration_ms,
        externalProvider: ListeningToProviders.Spotify,
        externalUrl: external_urls.spotify,
        imageUrl: album.images[0]?.url || '',
      });
    }

    // Update access token if we got a new one
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

  return {
    spotifyAuthorizationCode,
    nowPlaying,
    error,
    clearError: () => {
      setError(null);
      setNowPlaying(null);
    },
    refetchQuery: refetch,
    nowPlayingLoading: isLoading || isRefetching,
  };
};

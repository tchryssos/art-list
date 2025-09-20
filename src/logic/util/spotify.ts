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
    ArtSubmitData['listeningTo'] | null
  >();

  const stateMatches =
    state === globalThis.localStorage?.getItem(SPOTIFY_CODE_STATE_KEY);

  // If we haven't already stored the auth code, and we don't have a code nor an error
  // in the url, start the Spotify OAuth flow
  useEffect(() => {
    if (spotifyAuthorizationCode === undefined && !(code || paramError)) {
      const freshState = getUnsafeRandomString(16);
      localStorage.setItem(SPOTIFY_CODE_STATE_KEY, freshState);
      const redirect = createSpotifyOauthRoute({
        state: freshState,
        redirect_uri: getSpotifyRedirectUri(),
        client_id: spotifyId || '',
      });
      push(redirect);
    }
  }, [spotifyAuthorizationCode, push, code, paramError, spotifyId]);

  useEffect(() => {
    // If we have a legitimate code or error in the url (validated by state),
    // set the code/error in state and remove the crazy params from the url bar just so
    // it looks nice
    // (TBH we might want to keep the code in the url bar for debugging purposes)
    if (stateMatches) {
      if (paramError) {
        setError(paramError);
        setSpotifyAuthorizationCode(null);
      } else if (code) {
        setSpotifyAuthorizationCode(code);
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
          return null;
        }
        return resp.json();
      }
      const { error: respError } = await resp.json();
      throw new Error(respError);
    },
    enabled: Boolean(spotifyAuthorizationCode),
  });

  useEffect(() => {
    // If we don't have any now playing data, set it to null
    // so that we know we TRIED but either got nothing or failed
    if (data === null || data?.nowPlaying === null) {
      setNowPlaying(null);
    } else if (data?.nowPlaying) {
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

    if (data?.access) {
      setAccess(data.access);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return {
    spotifyAuthorizationCode,
    nowPlaying,
    error,
    clearError: () => setError(null),
    refetchQuery: refetch,
    nowPlayingLoading: isLoading || isRefetching,
  };
};

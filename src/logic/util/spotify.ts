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
import {
  ListeningToResp,
  NOW_PLAYING_TOKEN_QUERY,
} from '~/pages/api/listening-to';
import { ArtSubmitData } from '~/typings/art';
import { SpotifyNowPlayingResp } from '~/typings/spotify';

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
   * - `spotifyAuthorizationCode` is ALSO that code, but just saved to state rather than the url bar
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

  useEffect(() => {
    if (spotifyAuthorizationCode === undefined && !(code || error)) {
      const freshState = getUnsafeRandomString(16);
      localStorage.setItem(SPOTIFY_CODE_STATE_KEY, freshState);
      const redirect = createSpotifyOauthRoute({
        state: freshState,
        redirect_uri: getSpotifyRedirectUri(),
        client_id: spotifyId || '',
      });
      push(redirect);
    }
  }, [spotifyAuthorizationCode, push, code, error, spotifyId]);

  useEffect(() => {
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
    queryKey: [nowPlayingKey, spotifyAuthorizationCode],
    queryFn: async () => {
      console.log('running query');
      const resp = await fetch(
        `${NOW_PLAYING_ROUTE}?${NOW_PLAYING_TOKEN_QUERY}=${spotifyAuthorizationCode}`,
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
    console.log(data);
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
        imageUrl: album.images[0].url,
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
    isLoading: isLoading || isRefetching,
  };
};

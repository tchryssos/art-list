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
import { NOW_PLAYING_TOKEN_QUERY } from '~/pages/api/listening-to';
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
  const { code, error: paramError, state } = query as Partial<SpotifyParams>;
  const { spotifyToken, setSpotifyToken } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<
    ArtSubmitData['listeningTo'] | null
  >();

  const stateMatches =
    state === globalThis.localStorage?.getItem(SPOTIFY_CODE_STATE_KEY);

  useEffect(() => {
    if (spotifyToken === undefined && !(code || error)) {
      const freshState = getUnsafeRandomString(16);
      localStorage.setItem(SPOTIFY_CODE_STATE_KEY, freshState);
      const redirect = createSpotifyOauthRoute({
        state: freshState,
        redirect_uri: getSpotifyRedirectUri(),
        client_id: spotifyId || '',
      });
      push(redirect);
    }
  }, [spotifyToken, push, code, error, spotifyId]);

  useEffect(() => {
    if (stateMatches) {
      if (paramError) {
        setError(paramError);
        setSpotifyToken(null);
      } else if (code) {
        setSpotifyToken(code);
      }
      localStorage.removeItem(SPOTIFY_CODE_STATE_KEY);
      push(ART_ADD_ROUTE, undefined, { shallow: true });
    }
  }, [code, stateMatches, setSpotifyToken, push, paramError]);

  const {
    error: queryError,
    data,
    isLoading,
    refetch,
  } = useQuery<SpotifyNowPlayingResp | null>({
    queryKey: [nowPlayingKey, spotifyToken],
    queryFn: async () => {
      const resp = await fetch(
        `${NOW_PLAYING_ROUTE}?${NOW_PLAYING_TOKEN_QUERY}=${spotifyToken}`,
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
    enabled: Boolean(spotifyToken),
  });

  useEffect(() => {
    if (data === null) {
      setNowPlaying(null);
    } else if (data) {
      setNowPlaying({
        artistName: data.item.artists.map((a) => a.name).join(', '),
        albumName: data.item.album.name,
        trackName: data.item.name,
        externalId: data.item.id,
        duration: data.item.duration_ms,
        externalProvider: ListeningToProviders.Spotify,
        externalUrl: data.item.external_urls.spotify,
        imageUrl: data.item.album.images[0].url,
      });
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
    spotifyToken,
    nowPlaying,
    error,
    clearError: () => setError(null),
    refetchQuery: refetch,
  };
};

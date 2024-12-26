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

const fetchNowPlaying = async (
  token: string,
  callback: (data: SpotifyNowPlayingResp | null) => void,
  setError: (error: string) => void
) => {
  const resp = await fetch(
    `${NOW_PLAYING_ROUTE}?${NOW_PLAYING_TOKEN_QUERY}=${token}`,
    {
      method: 'GET',
    }
  );
  if (resp.ok) {
    if (resp.status === 204) {
      callback(null);
    } else {
      const data: SpotifyNowPlayingResp = await resp.json();
      callback(data);
    }
  } else {
    const { error } = await resp.json();
    setError(error);
  }
};

export const useSpotify = (spotifyId: string) => {
  const { push, query } = useRouter();
  const { code, error: queryError, state } = query as Partial<SpotifyParams>;
  const { spotifyToken, setSpotifyToken } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [nowPlaying, setNowPlaying] = useState<
    ArtSubmitData['listeningTo'] | null
  >();

  const stateMatches =
    state === globalThis.localStorage?.getItem(SPOTIFY_CODE_STATE_KEY);

  useEffect(() => {
    if (spotifyToken === null && !(code || error)) {
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
      if (queryError) {
        setError(queryError);
        setSpotifyToken('');
      } else if (code) {
        setSpotifyToken(code);
      }
      localStorage.removeItem(SPOTIFY_CODE_STATE_KEY);
      push(ART_ADD_ROUTE, undefined, { shallow: true });
    }
  }, [code, stateMatches, setSpotifyToken, push, queryError]);

  useEffect(() => {
    if (spotifyToken) {
      fetchNowPlaying(
        spotifyToken,
        (data) => {
          if (!data) {
            setNowPlaying(null);
          } else {
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
        },
        setError
      );
    }
  }, [spotifyToken]);

  useEffect(() => {
    if (error) {
      console.error(error);
      // eslint-disable-next-line no-alert
      window.alert(error);
      setError(null);
    }
  }, [error]);

  return {
    spotifyToken,
    nowPlaying,
  };
};

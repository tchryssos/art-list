import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { getSpotifyRedirectUri } from '~/constants/routing';
import type { SpotifyNowPlayingResp } from '~/typings/spotify';

export const NOW_PLAYING_AUTH_CODE_QUERY = 'auth_code';
export const NOW_PLAYING_ACCESS_TOKEN_QUERY = 'access_token';
export const NOW_PLAYING_REFRESH_TOKEN_QUERY = 'refresh_token';

const spotifyOrigin = 'https://api.spotify.com/v1';

const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
const spotifyNowPlayingUrl = `${spotifyOrigin}/me/player/currently-playing`;

// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
interface SpotifyAccessTokenBody {
  grant_type: string;
  code: string;
  redirect_uri: string;
}

interface SpotifyAccessTokenResp {
  access_token: string;
  token_type?: 'Bearer';
  expires_in?: 3600;
  refresh_token: string;
  scope?: 'user-read-currently-playing';
}

export interface ListeningToResp {
  access: SpotifyAccessTokenResp;
  nowPlaying: SpotifyNowPlayingResp;
}

const fetchSpotifyAccessToken = async (code: string, origin: string) => {
  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: getSpotifyRedirectUri(origin),
  } satisfies SpotifyAccessTokenBody;

  return fetch(spotifyTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: new URLSearchParams(body).toString(),
  });
};

// eslint-disable-next-line consistent-return
const getToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query[NOW_PLAYING_AUTH_CODE_QUERY];
  if (!code) {
    res.status(400).json({ error: 'No code provided' });
    res.end();
  }
  const rawOrigin = req.headers.origin || req.headers.referer;

  if (!rawOrigin) {
    res.status(400).json({ error: 'Bad origin' });
    res.end();
  }

  const tokenResp = await fetchSpotifyAccessToken(
    code as string,
    new URL(rawOrigin!).origin
  );

  if (!tokenResp.ok) {
    const err = await tokenResp.json();
    if (err.error_description) {
      if (err.error_description === 'Authorization code expired') {
        res.status(401).json({ error: 'Authorization code expired' });
        res.end();
      }
    }
    console.error(tokenResp.status, '\n', tokenResp.statusText, '\n', err);
    res.status(tokenResp.status).json({
      error: `Failed to fetch token: ${tokenResp.statusText}\n${err.error_description || ''}`,
    });
  } else {
    const data: SpotifyAccessTokenResp = await tokenResp.json();
    return data;
  }
};

const getHandler: NextApiHandler = async (req, res) => {
  const { query } = req;
  let spotifyAccessToken = query[NOW_PLAYING_ACCESS_TOKEN_QUERY] as
    | string
    | undefined;
  let accessTokenResp: SpotifyAccessTokenResp = {
    access_token: spotifyAccessToken || '',
    refresh_token:
      (query[NOW_PLAYING_REFRESH_TOKEN_QUERY] as string | undefined) || '',
  };

  try {
    if (!spotifyAccessToken) {
      const spotifyAccessTokenResp = await getToken(req, res);
      if (!spotifyAccessTokenResp) {
        // In general, we shouldn't reach this if, because the `res` object
        // is .end()'ed in getToken() if there's an error
        res.status(500).json({ error: 'Failed to fetch token' });
        res.end();
      } else {
        spotifyAccessToken = spotifyAccessTokenResp.access_token;
        accessTokenResp = spotifyAccessTokenResp;
      }
    }

    const resp = await fetch(spotifyNowPlayingUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    if (resp.ok) {
      if (resp.status === 204) {
        res.status(204).end();
      } else {
        const data: SpotifyNowPlayingResp = await resp.json();
        res.status(200).json({
          access: accessTokenResp,
          nowPlaying: data,
        });
      }
    } else {
      const whyNotOk = await resp.text();
      res
        .status(resp.status)
        .json({ error: `Failed to fetch now playing: ${whyNotOk}` });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: `Failed to fetch now playing: ${(e as Error).message || JSON.stringify(e)}`,
    });
  }
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET': {
      await getHandler(req, res);
      break;
    }
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handleRequest;

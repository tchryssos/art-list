import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { getSpotifyRedirectUri } from '~/constants/routing';
import { SpotifyNowPlayingResp } from '~/typings/spotify';

export const NOW_PLAYING_TOKEN_QUERY = 'token';

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
  token_type: 'Bearer';
  expires_in: 3600;
  refresh_token: string;
  scope: 'user-read-currently-playing';
}

const fetchSpotifyToken = async (code: string, origin: string) => {
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

const getToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query[NOW_PLAYING_TOKEN_QUERY];
  if (!code) {
    res.status(400).json({ error: 'No code provided' });
    res.end();
  }
  const rawOrigin = req.headers.origin || req.headers.referer;

  if (!rawOrigin) {
    res.status(400).json({ error: 'Bad origin' });
    res.end();
  }

  const tokenResp = await fetchSpotifyToken(
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
    res.end();
  }

  const data: SpotifyAccessTokenResp = await tokenResp.json();
  return data;
};

const getHandler: NextApiHandler = async (req, res) => {
  try {
    const spotifyAccessToken = await getToken(req, res);
    if (!spotifyAccessToken) {
      res.status(500).json({ error: 'Failed to fetch token' });
      res.end();
    } else {
      const resp = await fetch(spotifyNowPlayingUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${spotifyAccessToken.access_token}`,
        },
      });

      if (resp.ok) {
        if (resp.status === 204) {
          res.status(204).json('Nothing playing');
          res.end();
        }
        const data: SpotifyNowPlayingResp = await resp.json();
        res.status(200).json(data);
      } else {
        res.status(resp.status).json({ error: 'Failed to fetch now playing' });
      }
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

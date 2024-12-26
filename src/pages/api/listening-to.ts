import { NextApiHandler } from 'next';

import { SpotifyTokenResponse } from '~/typings/spotify';

const spotifyTokenUrl = 'https://accounts.spotify.com/api/token';

interface ListeningToBody {
  token?: string;
}

const fetchSpotifyToken = async () =>
  fetch(spotifyTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'your-client-id',
      client_secret: 'your-client-secret',
    }),
  });

const getHandler: NextApiHandler = async (req, res) => {
  const { token: bodyToken } = req.body as ListeningToBody;
  let token = bodyToken;
  let fresh = false;

  if (!token) {
    const resp = await fetchSpotifyToken();
    if (resp.ok) {
      const data: SpotifyTokenResponse = await resp.json();
      token = data.access_token;
      fresh = true;
    } else {
      res.status(500).json({ error: 'Failed to get token' });
    }
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

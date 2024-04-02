import { serialize } from 'cookie';
import { NextApiHandler } from 'next';

import { AUTH_COOKIE_KEY } from '~/constants/auth';

export type AuthData = {
  username: string;
  password: string;
};

const authorize: NextApiHandler = async (req, res) => {
  const body: AuthData = await JSON.parse(req.body);

  try {
    if (
      body.password === process.env.PASSWORD &&
      body.username === process.env.USERNAME
    ) {
      const cookie = serialize(AUTH_COOKIE_KEY, 'true', {
        sameSite: 'lax',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });

      res.setHeader('Set-Cookie', cookie).status(200).json('Authorized');
    } else {
      res.status(401).json('Unauthorized');
    }
  } catch (e) {
    res.status(401).json('Unauthorized');
  }
};

export default authorize;

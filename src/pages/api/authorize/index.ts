import { serialize } from 'cookie';
import { NextApiHandler } from 'next';

import { AUTH_COOKIE_KEY } from '~/constants/auth';
import { HOME_ROUTE } from '~/constants/routing';

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
        sameSite: 'strict',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        path: HOME_ROUTE,
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

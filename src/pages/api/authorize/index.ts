import argon2 from 'argon2';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextApiHandler } from 'next';

import type { JwtBody } from '~/constants/auth';
import { AUTH_COOKIE_KEY } from '~/constants/auth';
import { HOME_ROUTE } from '~/constants/routing';

export type AuthData = {
  username: string;
  password: string;
};

const authorize: NextApiHandler = async (req, res) => {
  const body: AuthData = await JSON.parse(req.body);

  try {
    const pwVerified = await argon2.verify(
      process.env.PASSWORD || '',
      body.password
    );
    if (pwVerified && body.username === process.env.USERNAME) {
      const token = jwt.sign(
        {
          username: body.username,
        } as JwtBody,
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '1d' }
      );

      const cookie = serialize(AUTH_COOKIE_KEY, token, {
        sameSite: 'strict',
        httpOnly: true,
        secure: true,
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

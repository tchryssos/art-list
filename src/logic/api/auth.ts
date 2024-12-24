import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';

import { AUTH_COOKIE_KEY, JwtBody } from '~/constants/auth';

export const isCookieAuthorized = (req: GetServerSidePropsContext['req']) => {
  const token = req.cookies?.[AUTH_COOKIE_KEY];

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bad_secret');
    return Boolean((decoded as JwtBody).username === process.env.USERNAME);
  } catch {
    return false;
  }
};

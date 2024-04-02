import { GetServerSidePropsContext } from 'next';

import { AUTH_COOKIE_KEY } from '~/constants/auth';

export const isCookieAuthorized = (req: GetServerSidePropsContext['req']) =>
  req.cookies?.[AUTH_COOKIE_KEY] === 'true';

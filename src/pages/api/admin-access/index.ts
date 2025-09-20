import argon2 from 'argon2';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import type { NextApiHandler, NextApiRequest } from 'next';

import type { JwtBody } from '~/constants/auth';
import { AUTH_COOKIE_KEY } from '~/constants/auth';
import { HOME_ROUTE } from '~/constants/routing';

export type AuthData = {
  username: string;
  password: string;
  website?: string; // honey pot field
};

// In-memory rate limiting (resets on server restart, which is fine for a personal app)
const loginAttempts = new Map<
  string,
  { count: number; lastAttempt: number; nextAllowedAttempt: number }
>();

const getClientIP = (req: NextApiRequest): string =>
  req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
  req.headers['x-real-ip']?.toString() ||
  req.connection?.remoteAddress ||
  req.socket?.remoteAddress ||
  'unknown';

const authorize: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  /**
   * Origin validation - Prevents requests from random domains/bots
   *
   * Headers explained:
   * - origin: Set by browsers for cross-origin requests (CORS)
   * - referer: Shows which page initiated the request
   * - host: The domain name from the request URL
   *
   * This stops bots from external sites hitting your login endpoint
   */
  const { origin, referer, host } = req.headers;

  // Allow requests from your domain or localhost (for development)
  const allowedOrigins = [`https://${host}`, 'http://localhost:3000'];

  const isValidOrigin =
    origin && allowedOrigins.some((allowed) => origin.startsWith(allowed));
  const isValidReferer =
    referer && allowedOrigins.some((allowed) => referer.startsWith(allowed));

  if (!isValidOrigin && !isValidReferer) {
    return res.status(403).json('Forbidden');
  }

  const clientIP = getClientIP(req);
  const now = Date.now();
  const attempts = loginAttempts.get(clientIP) || {
    count: 0,
    lastAttempt: 0,
    nextAllowedAttempt: 0,
  };

  // Check if client is still rate limited
  if (now < attempts.nextAllowedAttempt) {
    const remainingSeconds = Math.ceil(
      (attempts.nextAllowedAttempt - now) / 1000
    );
    return res
      .status(429)
      .json(`Too many attempts. Try again in ${remainingSeconds} seconds.`);
  }

  const body: AuthData = await JSON.parse(req.body);

  // Honey pot detection - if the "website" field is filled, it's likely a bot
  if (body.website && body.website.trim() !== '') {
    // Update rate limiting but don't reveal it's a honey pot
    attempts.count += 1;
    attempts.lastAttempt = now;
    attempts.nextAllowedAttempt =
      now + 60000 * 2 ** Math.min(attempts.count - 1, 6); // Max ~1 hour
    loginAttempts.set(clientIP, attempts);

    return res.status(401).json('Unauthorized');
  }

  try {
    const pwVerified = await argon2.verify(
      process.env.PASSWORD || '',
      body.password
    );

    if (pwVerified && body.username === process.env.USERNAME) {
      // Success - clear rate limiting for this IP
      loginAttempts.delete(clientIP);

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
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        path: HOME_ROUTE,
      });

      return res.setHeader('Set-Cookie', cookie).status(200).json('Authorized');
    }

    // Failed login - update rate limiting
    attempts.count += 1;
    attempts.lastAttempt = now;

    // Progressive delays: 1min, 2min, 4min, 8min, 16min, 32min (max ~30min)
    const delayMinutes = Math.min(2 ** (attempts.count - 1), 32);
    attempts.nextAllowedAttempt = now + delayMinutes * 60000;

    loginAttempts.set(clientIP, attempts);

    return res.status(401).json('Unauthorized');
  } catch (e) {
    // Error during verification - update rate limiting
    attempts.count += 1;
    attempts.lastAttempt = now;
    attempts.nextAllowedAttempt =
      now + 60000 * 2 ** Math.min(attempts.count - 1, 6);
    loginAttempts.set(clientIP, attempts);

    return res.status(401).json('Unauthorized');
  }
};

export default authorize;

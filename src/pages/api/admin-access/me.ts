import jwt from 'jsonwebtoken';
import type { NextApiHandler } from 'next';

import { AUTH_COOKIE_KEY } from '~/constants/auth';

const meHandler: NextApiHandler = async (req, res) => {
  const token = req.cookies?.[AUTH_COOKIE_KEY];

  if (!token) {
    res.status(401).json({ authorized: false });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bad_secret');
      res.status(200).json({ authorized: true, user: decoded });
    } catch (e) {
      res.status(401).json({ authorized: false });
    }
  }
};

export default meHandler;

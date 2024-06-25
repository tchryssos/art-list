import { NextApiHandler } from 'next';

import { AUTH_COOKIE_KEY } from '~/constants/auth';

const meHandler: NextApiHandler = async (req, res) => {
  const authorized = req.cookies?.[AUTH_COOKIE_KEY] === 'true';
  res.status(200).json({ authorized });
};

export default meHandler;

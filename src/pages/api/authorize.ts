import { NextApiHandler } from 'next';

export type AuthData = {
  username: string;
  password: string;
};

const authorize: NextApiHandler = async (req, res) => {
  const body: AuthData = await JSON.parse(req.body);

  if (
    body.password === process.env.PASSWORD &&
    body.username === process.env.USERNAME
  ) {
    res
      .setHeader(
        'Set-Cookie',
        'authorized=true; sameSite=strict; httpOnly=true; maxAge=60*60*24'
      )
      .status(200)
      .json('Authorized');
  } else {
    res.status(401).json('Unauthorized');
  }
};

export default authorize;

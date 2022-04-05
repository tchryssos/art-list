import { NextApiHandler } from 'next';

type AuthData = {
  password: string;
};

const authorize: NextApiHandler = async (req, res) => {
  const body: AuthData = await JSON.parse(req.body);

  if (body.password === process.env.PASSWORD) {
    res.status(200).json('Authorized');
  } else {
    res.status(401).json('Unauthorized');
  }
};

export default authorize;

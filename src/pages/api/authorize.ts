import { NextApiHandler } from 'next';

export type AuthData = {
  username: string;
  password: string;
};

const authorize: NextApiHandler = async (req, res) => {
  const body: AuthData = await JSON.parse(req.body);

  // This whole thing is completely fake sessions and logging in
  try {
    if (
      body.password === process.env.PASSWORD &&
      body.username === process.env.USERNAME
    ) {
      const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const sessionDates = {
        expires: new Date(tomorrow),
        loggedIn: new Date(),
      };

      const userId = btoa(body.username);
      const session = await prisma.session.findFirst({
        where: { userId },
      });
      if (session) {
        await prisma.session.update({
          where: { id: session.id },
          data: sessionDates,
        });
      } else {
        await prisma.session.create({
          data: {
            userId,
            ...sessionDates,
          },
        });
      }
      res
        .setHeader(
          'Set-Cookie',
          'authorized=true; sameSite=Lax; httpOnly=true; maxAge=60*60*24'
        )
        .status(200)
        .json('Authorized');
    } else {
      res.status(401).json('Unauthorized');
    }
  } catch (e) {
    res.status(401).json('Unauthorized');
  }
};

export default authorize;

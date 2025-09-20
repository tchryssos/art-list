import type { NextApiHandler } from 'next';

import { isCookieAuthorized } from '~/logic/api/auth';
import { prisma } from '~/logic/util/prisma';
import type { LocationSubmitData } from '~/typings/location';

const getLocation: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    const location = await prisma.location.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(location);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const patchLocation: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    const body: LocationSubmitData = await JSON.parse(req.body);
    const now = new Date();

    const updatedLocation = await prisma.location.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        lastModifiedOn: now,
      },
    });
    res.status(200).json(updatedLocation);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method === 'PATCH') {
    if (isCookieAuthorized(req)) {
      await patchLocation(req, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    await getLocation(req, res);
  }
};

export default handleRequest;

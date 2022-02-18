import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';

const getLocations: NextApiHandler = async (_req, res) => {
  try {
    const locationList = await prisma.location.findMany({
      orderBy: [
        {
          name: 'asc',
        },
      ],
    });
    res.status(200).json(locationList);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getLocations;

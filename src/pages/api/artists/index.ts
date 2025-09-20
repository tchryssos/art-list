import type { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';

const getArtists: NextApiHandler = async (_req, res) => {
  try {
    const artistList = await prisma.artist.findMany({
      orderBy: [
        {
          name: 'asc',
        },
      ],
    });
    res.status(200).json(artistList);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getArtists;

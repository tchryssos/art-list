import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';

const getArtList: NextApiHandler = async (_req, res) => {
  try {
    const artList = await prisma.art.findMany({
      orderBy: [
        {
          createdOn: 'desc',
        },
      ],
      include: {
        Artist: true,
        Location: true,
      },
    });

    res.status(200).json(artList);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default getArtList;

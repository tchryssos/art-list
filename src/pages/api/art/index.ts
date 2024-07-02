import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';

export const PAGE_SIZE = 25;

const getArtList: NextApiHandler = async (req, res) => {
  const { page } = req.query;
  try {
    const artList = await prisma.art.findMany({
      take: PAGE_SIZE,
      skip: (Number(page) || 0) * PAGE_SIZE,

      orderBy: [
        {
          createdOn: 'desc',
        },
        {
          dateSeen: 'desc',
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

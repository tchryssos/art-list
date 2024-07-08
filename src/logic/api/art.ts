import { prisma } from '~/logic/util/prisma';

import { isOnClient } from '../util/service';

export const PAGE_SIZE = 24;

export const getArtList = async (queryPageNumber: number) => {
  if (isOnClient()) {
    throw new Error('This function should only be called on the server');
  }

  try {
    const page = Math.max(0, queryPageNumber ? queryPageNumber - 1 : 0);

    const [artList, count] = await Promise.all([
      prisma.art.findMany({
        take: PAGE_SIZE,
        skip: page * PAGE_SIZE,

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
      }),
      prisma.art.count(),
    ]);

    return {
      artList,
      count,
    };
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

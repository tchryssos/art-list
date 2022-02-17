import { prisma } from '../util/prisma';

export const artistFindOrCreate = async (artistName: string) => {
  const now = new Date();

  let artist = await prisma.artist.findUnique({
    where: {
      name: artistName,
    },
  });

  if (!artist) {
    artist = await prisma.artist.create({
      data: {
        name: artistName,
        createdOn: now,
        lastModifiedOn: now,
      },
    });
  }

  return artist;
};

import { prisma } from '.';

export const locationFindOrCreate = async (locationName: string) => {
  const now = new Date();

  let location = await prisma.location.findUnique({
    where: {
      name: locationName,
    },
  });

  if (!location) {
    location = await prisma.location.create({
      data: {
        name: locationName,
        createdOn: now,
        lastModifiedOn: now,
      },
    });
  }

  return location;
};

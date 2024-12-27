import { ArtSubmitData } from '~/typings/art';

import { isOnClient } from '../util/service';

export function listeningToFindOrCreate(data: ArtSubmitData['listeningTo']) {
  if (isOnClient()) {
    throw new Error('This function should only be called on the server');
  }

  if (!data) {
    return undefined;
  }

  try {
    const now = new Date();

    let listeningTo = prisma.listeningTo.findFirst({
      where: {
        externalProvider: data.externalProvider,
        externalId: data.externalId,
      },
    });

    if (!listeningTo) {
      listeningTo = prisma.listeningTo.create({
        data: {
          ...data,
          createdOn: now,
        },
      });
    }

    return listeningTo;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

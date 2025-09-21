import type { ArtSubmitData } from '~/typings/art';

import { prisma } from '../util/prisma';
import { isOnClient } from '../util/service';

export async function listeningToFindOrCreate(
  data: ArtSubmitData['listeningTo']
) {
  if (isOnClient()) {
    throw new Error('This function should only be called on the server');
  }

  if (!data) {
    return undefined;
  }

  try {
    const now = new Date();

    let listeningTo = await prisma.listeningTo.findFirst({
      where: {
        externalProvider: data.externalProvider,
        externalId: data.externalId,
      },
    });

    if (!listeningTo) {
      listeningTo = await prisma.listeningTo.create({
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

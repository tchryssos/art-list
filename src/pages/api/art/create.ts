import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';
import { ArtCreateData } from '~/typings/art';

const createArt: NextApiHandler = async (req, res) => {
  try {
    const body: ArtCreateData = await JSON.parse(req.body);

    const now = new Date();

    // Find or create artist by name
    let artist = await prisma.artist.findUnique({
      where: {
        name: body.artist,
      },
    });

    if (!artist) {
      artist = await prisma.artist.create({
        data: {
          name: body.artist,
          createdOn: now,
          lastModifiedOn: now,
        },
      });
    }

    // Find or create location by name
    let location = await prisma.location.findUnique({
      where: {
        name: body.location,
      },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: body.location,
          createdOn: now,
          lastModifiedOn: now,
        },
      });
    }

    const newArt = await prisma.art.create({
      data: {
        name: body.name,
        artistId: artist.id,
        locationId: location.id,
        dateSeen: body.dateSeen,
        createdOn: now,
        lastModifiedOn: now,
      },
    });

    res.status(200).json(newArt);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default createArt;

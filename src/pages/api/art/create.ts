import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';
import { artistFindOrCreate } from '~/logic/util/prisma/artists';
import { locationFindOrCreate } from '~/logic/util/prisma/location';
import { ArtistSubmitData } from '~/typings/art';

const createArt: NextApiHandler = async (req, res) => {
  try {
    const body: ArtistSubmitData = await JSON.parse(req.body);

    const now = new Date();

    const artist = await artistFindOrCreate(body.artist);
    const location = await locationFindOrCreate(body.location);

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

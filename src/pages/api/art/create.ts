import { NextApiHandler } from 'next';

import { artistFindOrCreate } from '~/logic/api/artists';
import { locationFindOrCreate } from '~/logic/api/location';
import { prisma } from '~/logic/util/prisma';
import { ArtSubmitData } from '~/typings/art';

const createArt: NextApiHandler = async (req, res) => {
  try {
    const body: ArtSubmitData = await JSON.parse(req.body);

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
        imgSrc: body.imgSrc || '',
      },
    });

    res.status(200).json(newArt);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default createArt;

import { NextApiHandler } from 'next';

import { artistFindOrCreate } from '~/logic/api/artists';
import { locationFindOrCreate } from '~/logic/api/location';
import { prisma } from '~/logic/util/prisma';
import { ArtSubmitData } from '~/typings/art';

const getArt: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: `${number}` };

    const art = await prisma.art.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json(art);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const patchArt: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: `${number}` };

    const body: ArtSubmitData = await JSON.parse(req.body);
    const now = new Date();

    const artist = await artistFindOrCreate(body.artist);
    const location = await locationFindOrCreate(body.location);

    const updatedArt = await prisma.art.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name: body.name,
        lastModifiedOn: now,
        dateSeen: body.dateSeen,
        url: body.url,
        artistId: artist.id,
        locationId: location.id,
      },
    });
    res.status(200).json(updatedArt);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method === 'PATCH') {
    await patchArt(req, res);
  } else {
    await getArt(req, res);
  }
};

export default handleRequest;

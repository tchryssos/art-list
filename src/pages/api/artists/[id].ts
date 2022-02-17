import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';
import { ArtistSubmitData } from '~/typings/artist';

const getArtist: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: `${number}` };

    const artist = await prisma.artist.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json(artist);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const patchArtist: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: `${number}` };

    const body: ArtistSubmitData = await JSON.parse(req.body);
    const now = new Date();

    const updatedArtist = await prisma.artist.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name: body.name,
        lastModifiedOn: now,
      },
    });
    res.status(200).json(updatedArtist);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method === 'PATCH') {
    await patchArtist(req, res);
  } else {
    await getArtist(req, res);
  }
};

export default handleRequest;

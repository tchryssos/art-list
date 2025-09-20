import type { NextApiHandler } from 'next';

import { isCookieAuthorized } from '~/logic/api/auth';
import { prisma } from '~/logic/util/prisma';
import type { ArtistSubmitData } from '~/typings/artist';

const getArtist: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    const artist = await prisma.artist.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(artist);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const patchArtist: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    const body: ArtistSubmitData = await JSON.parse(req.body);
    const now = new Date();

    const updatedArtist = await prisma.artist.update({
      where: {
        id,
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
    if (isCookieAuthorized(req)) {
      await patchArtist(req, res);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    await getArtist(req, res);
  }
};

export default handleRequest;

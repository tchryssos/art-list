import { parseISO } from 'date-fns';
import { NextApiHandler } from 'next';

import { artistFindOrCreate } from '~/logic/api/artists';
import { isCookieAuthorized } from '~/logic/api/auth';
import { locationFindOrCreate } from '~/logic/api/location';
import { prisma } from '~/logic/util/prisma';
import { ArtSubmitData } from '~/typings/art';

const getArt: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    const art = await prisma.art.findUnique({
      where: {
        id,
      },
      include: {
        Artist: true,
        Location: true,
      },
    });

    res.status(200).json(art);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const patchArt: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    const body: ArtSubmitData = await JSON.parse(req.body);
    const now = new Date();

    const artist = await artistFindOrCreate(body.artist);
    const location = await locationFindOrCreate(body.location);

    const updatedArt = await prisma.art.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        lastModifiedOn: now,
        dateSeen: parseISO(body.dateSeen),
        imgSrc: body.imgSrc,
        artistId: artist.id,
        locationId: location.id,
      },
    });
    res.status(200).json(updatedArt);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const deleteArt: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: string };

    await prisma.art.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'PATCH': {
      if (isCookieAuthorized(req)) {
        await patchArt(req, res);
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
      break;
    }

    case 'GET':
      await getArt(req, res);
      break;

    case 'DELETE': {
      if (isCookieAuthorized(req)) {
        await deleteArt(req, res);
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
      break;
    }

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handleRequest;

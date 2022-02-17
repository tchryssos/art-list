import { NextApiHandler } from 'next';

import { prisma } from '~/logic/util/prisma';
import { LocationSubmitData } from '~/typings/location';

const getLocation: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: `${number}` };

    const location = await prisma.location.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json(location);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const patchLocation: NextApiHandler = async (req, res) => {
  try {
    const { id } = req.query as { id: `${number}` };

    const body: LocationSubmitData = await JSON.parse(req.body);
    const now = new Date();

    const updatedLocation = await prisma.location.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        name: body.name,
        lastModifiedOn: now,
      },
    });
    res.status(200).json(updatedLocation);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  if (method === 'PATCH') {
    await patchLocation(req, res);
  } else {
    await getLocation(req, res);
  }
};

export default handleRequest;

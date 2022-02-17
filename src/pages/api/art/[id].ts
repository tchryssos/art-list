import { NextApiHandler, NextApiResponse } from 'next';

import { prisma } from '~/logic/util/prisma';
import { ArtPatchData } from '~/typings/art';

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

// const patchArt: NextApiHandler = async (req, res) => {
//   try {
//     const { id } = req.query as { id: `${number}`}

//     const currentArt = await prisma.art.findUnique({
//       where: {
//         id: parseInt(id, 10)
//       }
//     })

//     const body: ArtPatchData = await JSON.parse(req.body)

//     const updatedArt = await
//   } catch (e) {
//     res.status(500).json({ error: (e as Error).message });
//   }
// }

const handleRequest: NextApiHandler = async (req, res) => {
  const { method } = req;

  await getArt(req, res);
};

export default handleRequest;

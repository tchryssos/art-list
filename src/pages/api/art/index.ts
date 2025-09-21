import type { NextApiHandler } from 'next';

import { PAGE_QUERY_PARAM } from '~/constants/queryParams';
import { getArtList } from '~/logic/api/art';

const handleGetArtList: NextApiHandler = async (req, res) => {
  const pageQuery = req.query?.[PAGE_QUERY_PARAM];
  const numberQuery = Number(pageQuery);

  try {
    const artList = await getArtList(numberQuery);

    res.status(200).json(artList);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default handleGetArtList;

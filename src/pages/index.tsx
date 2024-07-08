import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { ArtListItem } from '~/components/ArtListItem';
import { Layout } from '~/components/meta/Layout';
import { Pagination } from '~/components/Pagination';
import { PAGE_QUERY_PARAM } from '~/constants/queryParams';
import { getArtList, PAGE_SIZE } from '~/logic/api/art';
import { CompleteArt } from '~/typings/art';
import { PrismaError } from '~/typings/util';

type ArtList = CompleteArt[] | PrismaError | undefined;

interface ListContentsProps {
  artList: ArtList;
}

function ListContents({ artList }: ListContentsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {(artList as CompleteArt[]).map((a) => (
        <ArtListItem art={a} key={a.id} />
      ))}
    </div>
  );
}

interface ListProps {
  artList: ArtList;
  count: number;
}

function List({ artList, count }: ListProps) {
  const router = useRouter();
  return (
    <Layout nav="art" title="Troy's Art List">
      <ListContents artList={artList} />
      <Pagination
        count={count}
        currentPage={Number(router.query[PAGE_QUERY_PARAM] || 1)}
        pageSize={PAGE_SIZE}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ListProps> = async ({
  query,
}) => {
  let artList: ArtList = [];
  let count = 0;

  try {
    const pageNumber = Number((query || {})[PAGE_QUERY_PARAM]) || 1;

    const { artList: reqList, count: reqCount } = await getArtList(pageNumber);

    if (reqList) {
      artList = reqList as CompleteArt[];
      count = reqCount || 0;
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      artList,
      count,
    },
  };
};

export default List;

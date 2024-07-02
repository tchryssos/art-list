import { GetServerSideProps } from 'next';

import { ArtListItem } from '~/components/ArtListItem';
import { Layout } from '~/components/meta/Layout';
import { PAGE_QUERY_PARAM } from '~/constants/queryParams';
import { ART_LIST_ROUTE } from '~/constants/routing';
import { getArtList } from '~/logic/api/art';
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
}

function List({ artList }: ListProps) {
  return (
    <Layout nav="art" title="Troy's Art List">
      <ListContents artList={artList} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ListProps> = async ({
  params,
}) => {
  let artList: ArtList = [];

  try {
    const pageNumber = Number((params || {})[PAGE_QUERY_PARAM]) || 1;
    const reqList = (await getArtList(pageNumber)) as CompleteArt[];

    if (reqList) {
      artList = reqList;
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      artList,
    },
  };
};

export default List;

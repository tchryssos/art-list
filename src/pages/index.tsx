import { times } from 'lodash';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { ArtListItem } from '~/components/ArtListItem';
import { Link } from '~/components/Link';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { PAGE_QUERY_PARAM } from '~/constants/queryParams';
import { ART_LIST_ROUTE } from '~/constants/routing';
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

interface PaginationProps {
  count: number;
}

interface PaginationLinkProps {
  page: number;
}

function PaginationLink({ page }: PaginationLinkProps) {
  return (
    <Link href={`${ART_LIST_ROUTE}?${PAGE_QUERY_PARAM}=${page}`}>
      <Body>{page}</Body>
    </Link>
  );
}

function Pagination({ count }: PaginationProps) {
  const router = useRouter();
  const pages = count / PAGE_SIZE;
  const currentPage = Number(router.query[PAGE_QUERY_PARAM] || 1);
  const lastPage = Math.ceil(pages);

  return (
    <div className="flex gap-2 mt-4 w-full justify-center">
      <PaginationLink page={1} />
      <PaginationLink page={lastPage} />
    </div>
  );
}

interface ListProps {
  artList: ArtList;
  count: number;
}

function List({ artList, count }: ListProps) {
  return (
    <Layout nav="art" title="Troy's Art List">
      <ListContents artList={artList} />
      <Pagination count={count} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<ListProps> = async ({
  params,
}) => {
  let artList: ArtList = [];
  let count = 0;

  try {
    const pageNumber = Number((params || {})[PAGE_QUERY_PARAM]) || 1;
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

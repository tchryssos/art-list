import { useEffect, useState } from 'react';

import { ArtListItem } from '~/components/ArtListItem';
import { GridBox } from '~/components/box/GridBox';
import { LoadingPageSpinner } from '~/components/LoadingSpinner';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { ART_LIST_ROUTE } from '~/constants/routing';
import {
  useBreakpointsAtLeast,
  useBreakpointsLessThan,
} from '~/logic/hooks/useBreakpoints';
import { CompleteArt } from '~/typings/art';
import { PrismaError } from '~/typings/util';

type ArtList = CompleteArt[] | PrismaError | undefined;

interface ListContentsProps {
  artList: ArtList;
}

const ListContents: React.FC<ListContentsProps> = ({ artList }) => {
  const lessThanSm = useBreakpointsLessThan('sm');
  const isXlOrGreater = useBreakpointsAtLeast('xl');

  if (!artList) {
    return (
      <LoadingPageSpinner title="List loading" titleId="list-loading-spinner" />
    );
  }

  if ((artList as PrismaError).error) {
    return <Body>Something went wrong fetching the art list!</Body>;
  }

  let columns: 1 | 2 | 3 = 2;
  if (lessThanSm) {
    columns = 1;
  }
  if (isXlOrGreater) {
    columns = 3;
  }

  return (
    <GridBox columnGap={16} columns={columns} rowGap={16}>
      {(artList as CompleteArt[]).map((a) => (
        <ArtListItem art={a} key={a.id} />
      ))}
    </GridBox>
  );
};

const listNav: NavVariant[] = ['art'];

const List: React.FC = () => {
  const [artList, setArtList] = useState<ArtList>();

  useEffect(() => {
    const fetchArt = async () => {
      const resp = await fetch(ART_LIST_ROUTE, {
        method: 'GET',
      });
      const list: CompleteArt[] = await resp.json();
      setArtList(list);
    };
    fetchArt();
  }, []);

  return (
    <Layout nav={listNav} pageTitle="Art List">
      <ListContents artList={artList} />
    </Layout>
  );
};

export default List;

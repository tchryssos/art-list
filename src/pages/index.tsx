import { useEffect, useState } from 'react';

import { ArtListItem } from '~/components/ArtListItem';
import { GridBox } from '~/components/box/GridBox';
import { LoadingPageSpinner } from '~/components/LoadingSpinner';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { ART_LIST_ROUTE } from '~/constants/routing';
import { useBreakpointsLessThan } from '~/logic/hooks/useBreakpoints';
import { CompleteArt } from '~/typings/art';

const listNav: NavVariant[] = ['art'];

const List: React.FC = () => {
  const [artList, setArtList] = useState<CompleteArt[]>();
  const lessThanSm = useBreakpointsLessThan('sm');

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
      {artList ? (
        <GridBox columnGap={16} columns={lessThanSm ? 1 : 2} rowGap={16}>
          {artList.map((a) => (
            <ArtListItem art={a} key={a.id} />
          ))}
        </GridBox>
      ) : (
        <LoadingPageSpinner
          title="List loading"
          titleId="list-loading-spinner"
        />
      )}
    </Layout>
  );
};

export default List;

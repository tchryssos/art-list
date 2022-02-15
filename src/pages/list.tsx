import { useEffect, useState } from 'react';

import { ArtListItem } from '~/components/ArtListItem';
import { GridBox } from '~/components/box/GridBox';
import { LoadingPageSpinner } from '~/components/LoadingSpinner';
import { Layout } from '~/components/meta/Layout';
import { Title } from '~/components/typography/Title';
import { useBreakpointsLessThan } from '~/logic/hooks/useBreakpoints';
import { TEMPart } from '~/typings/art';

const List: React.FC = () => {
  const [artList, setArtList] = useState<TEMPart[]>();
  const lessThanSm = useBreakpointsLessThan('sm');

  useEffect(() => {
    const fetchArt = async () => {
      const resp = await fetch('/artlist.json');
      const list: TEMPart[] = await resp.json();
      setArtList(list);
    };
    fetchArt();
  }, []);

  return (
    <Layout>
      <Title>Art List</Title>
      {artList ? (
        <GridBox columnGap={16} columns={lessThanSm ? 1 : 2} rowGap={16}>
          {artList.map((a) => (
            <ArtListItem art={a} key={`${a.name}-${a.artist}`} />
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

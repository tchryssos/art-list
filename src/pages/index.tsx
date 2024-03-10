import { useEffect, useState } from 'react';

import { ArtListItem } from '~/components/ArtListItem';
import { LoadingPageSpinner } from '~/components/LoadingSpinner';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { ART_LIST_ROUTE } from '~/constants/routing';
import { CompleteArt } from '~/typings/art';
import { PrismaError } from '~/typings/util';

type ArtList = CompleteArt[] | PrismaError | undefined;

interface ListContentsProps {
  artList: ArtList;
}

function ListContents({ artList }: ListContentsProps) {
  if (!artList) {
    return <LoadingPageSpinner />;
  }

  if ((artList as PrismaError).error) {
    return <Body>Something went wrong fetching the art list!</Body>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {(artList as CompleteArt[]).map((a) => (
        <ArtListItem art={a} key={a.id} />
      ))}
    </div>
  );
}

const listNav: NavVariant[] = ['art'];

function List() {
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
    <Layout nav={listNav} title="Troy's Art List">
      <ListContents artList={artList} />
    </Layout>
  );
}

export default List;

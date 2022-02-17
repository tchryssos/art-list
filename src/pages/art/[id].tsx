import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ArtForm } from '~/components/form/ArtForm';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { createArtApiRoute } from '~/constants/routing';
import { formatDate } from '~/logic/util/date';
import { CompleteArt } from '~/typings/art';

const artDetailNav: NavVariant[] = ['art'];

const ArtDetail: React.FC = () => {
  const [art, setArt] = useState<CompleteArt | null>(null);

  const {
    query: { id },
  } = useRouter();

  useEffect(() => {
    if (id) {
      const fetchArt = async () => {
        const resp = await fetch(createArtApiRoute(id as `${number}`), {
          method: 'GET',
        });
        const artwork: CompleteArt = await resp.json();
        setArt(artwork);
      };
      fetchArt();
    }
  }, [id]);

  const onSubmit = () => {
    const test = '';
  };

  return (
    <Layout nav={artDetailNav}>
      {art && (
        <ArtForm
          defaultValues={{
            name: art.name,
            artist: art.Artist.name,
            dateSeen: formatDate(art.dateSeen, 'yyyy-MM-dd'),
            location: art.Location.name,
            imgSrc: art.imgSrc || '',
          }}
          formTitle={art.name}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
};

export default ArtDetail;

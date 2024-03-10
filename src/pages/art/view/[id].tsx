import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

import { ArtForm } from '~/components/form/ArtForm';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { createArtApiRoute, LIST_ROUTE } from '~/constants/routing';
import { formatDate } from '~/logic/util/date';
import { formDataToJson } from '~/logic/util/forms';
import { CompleteArt } from '~/typings/art';

const artDetailNav: NavVariant[] = ['art'];

function ArtDetail() {
  const [art, setArt] = useState<CompleteArt | null>(null);

  const {
    query: { id },
    push,
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

  const onSubmit = async (e: FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const resp = await fetch(createArtApiRoute(id as `${number}`), {
      method: 'PATCH',
      body: formDataToJson(formData),
    });

    if (resp.status === 200) {
      push(LIST_ROUTE);
    }
  };

  return (
    <Layout
      nav={artDetailNav}
      pageTitle={`Edit '${art?.name || 'Art'}'`}
      title={`${art?.name || 'Art'} - ${art?.Artist.name || 'Unknown'}`}
    >
      {art && (
        <ArtForm
          defaultValues={{
            name: art.name,
            artist: art.Artist.name,
            dateSeen: formatDate(art.dateSeen, 'yyyy-MM-dd'),
            location: art.Location.name,
            imgSrc: art.imgSrc || '',
          }}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
}

export default ArtDetail;

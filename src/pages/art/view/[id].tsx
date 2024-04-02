import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';

import { ArtForm } from '~/components/form/ArtForm';
import { Layout } from '~/components/meta/Layout';
import { createArtApiRoute, HOME_ROUTE } from '~/constants/routing';
import { formatDate } from '~/logic/util/date';
import { formDataToJson } from '~/logic/util/forms';
import { prisma } from '~/logic/util/prisma';
import { CompleteArt } from '~/typings/art';

interface ArtDetailProps {
  art: CompleteArt;
}

function ArtDetail({ art }: ArtDetailProps) {
  console.log(art);
  const {
    query: { id },
    push,
  } = useRouter();

  const onSubmit = async (e: FormEvent) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const resp = await fetch(createArtApiRoute(id as `${number}`), {
        method: 'PATCH',
        body: formDataToJson(formData),
      });

      if (resp.status === 200) {
        push(HOME_ROUTE);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout
      nav="art"
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params || {};

  try {
    const art = await prisma.art.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!art) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        art,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

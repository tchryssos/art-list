import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useContext } from 'react';

import { ArtForm } from '~/components/form/ArtForm';
import { Layout } from '~/components/meta/Layout';
import { AUTH_PROPS_KEY } from '~/constants/auth';
import { createArtApiRoute, HOME_ROUTE } from '~/constants/routing';
import { isCookieAuthorized } from '~/logic/api/auth';
import { AuthContext } from '~/logic/contexts/authContext';
import { formatDate } from '~/logic/util/date';
import { formDataToJson } from '~/logic/util/forms';
import { prisma } from '~/logic/util/prisma';
import { CompleteArt } from '~/typings/art';

interface ArtDetailProps {
  art: CompleteArt;
}

function ArtDetail({ art }: ArtDetailProps) {
  const {
    query: { id },
    push,
  } = useRouter();

  const { isAuthorized } = useContext(AuthContext);

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
      pageTitle={`Edit "${art?.name || 'Art'}"`}
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
          readOnly={!isAuthorized}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
}

export default ArtDetail;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params || {};

  try {
    const art = await prisma.art.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Artist: true,
        Location: true,
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
        [AUTH_PROPS_KEY]: isCookieAuthorized(req),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

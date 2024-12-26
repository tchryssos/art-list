import { padStart } from 'lodash';
import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';

import { Button } from '~/components/buttons/Button';
import { ArtForm } from '~/components/form/ArtForm';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { ART_CREATE_ROUTE, LOGIN_ROUTE } from '~/constants/routing';
import { isCookieAuthorized } from '~/logic/api/auth';
import { formDataToJson } from '~/logic/util/forms';
import { prisma } from '~/logic/util/prisma';
import { useSpotifyAuth } from '~/logic/util/spotify';

interface AddArtPageProps {
  lastLocation: string;
  spotifyId: string | null;
}

function AddArtPage({ lastLocation, spotifyId }: AddArtPageProps) {
  const [submitSuccessful, setSubmitSuccessful] = useState<boolean | null>(
    null
  );

  const spotifyToken = useSpotifyAuth(spotifyId || '');

  const onSubmit = async (e: FormEvent) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const resp = await fetch(ART_CREATE_ROUTE, {
        method: 'POST',
        body: formDataToJson(formData),
      });

      if (resp.status === 200) {
        setSubmitSuccessful(true);
      } else {
        setSubmitSuccessful(false);
      }
    } catch (error) {
      console.error(error);
      setSubmitSuccessful(false);
    }
  };

  const getTodayDefaultValue = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = padStart(String(d.getMonth() + 1), 2, '0');
    const day = padStart(String(d.getDate()), 2, '0');

    return `${year}-${month}-${day}`;
  };

  if (spotifyToken === null) {
    return null;
  }

  return (
    <Layout nav="list" pageTitle="Add New Artwork" title="Add New Artwork">
      {submitSuccessful ? (
        <>
          <Body className="mb-4">Submit Successful!</Body>
          <Button
            className="p-2 h-12"
            onClick={() => setSubmitSuccessful(null)}
          >
            <Body>Submit Another?</Body>
          </Button>
        </>
      ) : (
        <ArtForm
          defaultValues={{
            dateSeen: getTodayDefaultValue(),
            location: lastLocation,
          }}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
}

export default AddArtPage;

export const getServerSideProps: GetServerSideProps<AddArtPageProps> = async ({
  req,
}) => {
  const isAuthorized = isCookieAuthorized(req);

  if (!isAuthorized) {
    return {
      redirect: {
        destination: LOGIN_ROUTE,
        permanent: false,
      },
    };
  }

  let lastLocation: string = '';

  try {
    const art = await prisma.art.findMany({
      take: 1,
      orderBy: [
        {
          createdOn: 'desc',
        },
        {
          dateSeen: 'desc',
        },
      ],
      include: {
        Location: true,
      },
    });
    if (art.length) {
      lastLocation = art[0].Location?.name || '';
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      lastLocation,
      spotifyId: process.env.SPOTIFY_CLIENT_ID || null,
    },
  };
};

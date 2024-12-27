import { padStart } from 'lodash';
import { GetServerSideProps } from 'next';
import { FormEvent, useEffect, useState } from 'react';

import { Button } from '~/components/buttons/Button';
import { ArtForm } from '~/components/form/ArtForm';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { ART_CREATE_ROUTE, LOGIN_ROUTE } from '~/constants/routing';
import { isCookieAuthorized } from '~/logic/api/auth';
import { formDataToJson } from '~/logic/util/forms';
import { prisma } from '~/logic/util/prisma';
import { useSpotify } from '~/logic/util/spotify';
import { ArtSubmitData } from '~/typings/art';

interface AddArtPageProps {
  lastLocation: string;
  spotifyId: string | null;
}

interface ConditionalArtFormProps {
  loading: boolean;
  lastLocation: string;
  nowPlaying: ArtSubmitData['listeningTo'] | null;
  setSubmitSuccessful: (success: boolean) => void;
}

const getTodayDefaultValue = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = padStart(String(d.getMonth() + 1), 2, '0');
  const day = padStart(String(d.getDate()), 2, '0');

  return `${year}-${month}-${day}`;
};

function ConditionalArtForm({
  loading,
  lastLocation,
  nowPlaying,
  setSubmitSuccessful,
}: ConditionalArtFormProps) {
  const onSubmit = async (e: FormEvent) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const includeListeningTo = formData.get('listeningTo') !== null;

      const resp = await fetch(ART_CREATE_ROUTE, {
        method: 'POST',
        body: formDataToJson(
          formData,
          includeListeningTo ? nowPlaying || undefined : undefined
        ),
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

  if (loading) {
    return null;
  }

  return (
    <ArtForm
      defaultValues={{
        dateSeen: getTodayDefaultValue(),
        location: lastLocation,
        listeningTo: nowPlaying || undefined,
      }}
      onSubmit={onSubmit}
    />
  );
}

function AddArtPage({ lastLocation, spotifyId }: AddArtPageProps) {
  const [submitSuccessful, setSubmitSuccessful] = useState<boolean | null>(
    null
  );

  const { spotifyToken, nowPlaying, error, clearError } = useSpotify(
    spotifyId || ''
  );

  useEffect(() => {
    if (error && submitSuccessful !== null) {
      clearError();
    }
  }, [submitSuccessful, error, clearError]);

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
        <>
          {error && <span className="text-danger text-sm">{error}</span>}
          <ConditionalArtForm
            lastLocation={lastLocation}
            loading={spotifyToken === undefined || nowPlaying === undefined}
            nowPlaying={error ? null : nowPlaying}
            setSubmitSuccessful={setSubmitSuccessful}
          />
        </>
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

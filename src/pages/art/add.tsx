import { padStart } from 'lodash';
import type { GetServerSideProps } from 'next';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/buttons/Button';
import { ArtForm } from '~/components/form/ArtForm';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { ART_CREATE_ROUTE, LOGIN_ROUTE } from '~/constants/routing';
import { isCookieAuthorized } from '~/logic/api/auth';
import {
  NowPlayingProvider,
  useNowPlaying,
} from '~/logic/contexts/nowPlayingContext';
import { formDataToJson } from '~/logic/util/forms';
import { prisma } from '~/logic/util/prisma';

interface AddArtPageProps {
  lastLocation: string;
  spotifyId: string | null;
}

interface ConditionalArtFormProps {
  lastLocation: string;
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
  lastLocation,
  setSubmitSuccessful,
}: ConditionalArtFormProps) {
  const { nowPlaying } = useNowPlaying();

  const onSubmit = async (e: FormEvent) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);

      const includeListeningTo = formData.get('listeningTo') !== null;

      const resp = await fetch(ART_CREATE_ROUTE, {
        method: 'POST',
        body: formDataToJson(
          formData,
          includeListeningTo && nowPlaying
            ? {
                listeningTo: nowPlaying,
              }
            : undefined
        ),
      });

      if (resp.status === 200) {
        setSubmitSuccessful(true);
      } else {
        console.error('Art creation failed:', resp.status, resp.statusText);
        setSubmitSuccessful(false);
      }
    } catch (error) {
      console.error('Art creation error:', error);
      setSubmitSuccessful(false);
    }
  };

  return (
    <ArtForm
      defaultValues={{
        dateSeen: getTodayDefaultValue(),
        location: lastLocation,
      }}
      onSubmit={onSubmit}
    />
  );
}

function ArtFormWithErrorHandling({
  lastLocation,
  setSubmitSuccessful,
  submitSuccessful,
}: ConditionalArtFormProps & {
  submitSuccessful?: boolean | null | undefined;
}) {
  const { error, clearError, refetch } = useNowPlaying();

  useEffect(() => {
    if (submitSuccessful === null) {
      refetch();
    }
  }, [submitSuccessful, refetch]);

  useEffect(() => {
    if (error && submitSuccessful !== null) {
      clearError();
    }
  }, [submitSuccessful, error, clearError]);

  return (
    <>
      {error && (
        <div className="mb-4 p-3 border">
          <span className="text-danger text-sm">
            Spotify connection failed: {error}
          </span>
          <button
            className="ml-2 underline text-sm cursor-pointer"
            type="button"
            onClick={clearError}
          >
            Continue without Spotify
          </button>
        </div>
      )}
      <ConditionalArtForm
        lastLocation={lastLocation}
        setSubmitSuccessful={setSubmitSuccessful}
      />
    </>
  );
}

function AddArtPage({ lastLocation, spotifyId }: AddArtPageProps) {
  const [submitSuccessful, setSubmitSuccessful] = useState<
    boolean | null | undefined
  >(undefined);

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
        <NowPlayingProvider spotifyId={spotifyId || ''}>
          <ArtFormWithErrorHandling
            lastLocation={lastLocation}
            setSubmitSuccessful={setSubmitSuccessful}
            submitSuccessful={submitSuccessful}
          />
        </NowPlayingProvider>
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
      lastLocation = art[0]?.Location?.name || '';
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

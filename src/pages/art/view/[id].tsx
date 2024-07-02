import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';

import { Button } from '~/components/buttons/Button';
import { submitButtonSizeClassName } from '~/components/buttons/SubmitButton';
import { ArtForm } from '~/components/form/ArtForm';
import { LoadingSpinner } from '~/components/LoadingSpinner';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
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

interface DeleteButtonProps {
  art: CompleteArt;
}

function DeleteButton({ art }: DeleteButtonProps) {
  const [areYouSure, setAreYouSure] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { push } = useRouter();

  const onDeleteOne = () => {
    setAreYouSure(true);
  };

  const onDeleteTwo = async () => {
    setIsDeleting(true);
    try {
      const resp = await fetch(createArtApiRoute(art.id), {
        method: 'DELETE',
      });

      if (resp.status === 200) {
        push(HOME_ROUTE);
      }
    } catch (e) {
      console.error(e);
    }
    setIsDeleting(false);
  };

  return (
    <Button
      className={clsx(
        submitButtonSizeClassName,
        'bg-danger border-none mt-4 hover:brightness-90'
      )}
      type="button"
      onClick={areYouSure ? onDeleteTwo : onDeleteOne}
    >
      {isDeleting ? (
        <div className="flex justify-center">
          <LoadingSpinner size={1} />
        </div>
      ) : (
        <Body className="text-textContrast">
          {areYouSure ? 'Are You Sure?' : 'Delete'}
        </Body>
      )}
    </Button>
  );
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
        <>
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
          {isAuthorized && <DeleteButton art={art} />}
        </>
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
        id: id as string,
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

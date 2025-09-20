import clsx from 'clsx';
import { useContext } from 'react';

import { IS_URL } from '~/constants/regex';
import { createArtDetailRoute } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { formatDate } from '~/logic/util/date';
import { CompleteArt } from '~/typings/art';

import { ArtImg } from './ArtImg';
import { Link } from './Link';
import { ListeningToCard } from './ListeningToCard';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: CompleteArt;
}

interface ListItemWrapperProps {
  children: React.ReactNode;
  isAuthorized: boolean;
  artId: string;
}

function ListItemWrapper({
  children,
  isAuthorized,
  artId,
}: ListItemWrapperProps) {
  return isAuthorized ? (
    <Link className="h-full" href={createArtDetailRoute(artId)}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
}

export function ArtListItem({ art }: ArtListItemProps) {
  const {
    name,
    dateSeen,
    Artist: { name: artistName },
    Location: { name: locationName },
    imgSrc,
    artistId,
    ListeningTo,
  } = art;

  const { isAuthorized } = useContext(AuthContext);

  if (!(name && artistId)) {
    return null;
  }

  return (
    <ListItemWrapper artId={art.id} isAuthorized={Boolean(isAuthorized)}>
      <div
        className={clsx(
          'flex flex-col border border-solid border-accent-light p-3 gap-1 h-full',
          isAuthorized &&
            'hover:border-accent-heavy hover:bg-smudge active:border-accent-heavy  active:bg-smudge'
        )}
      >
        {imgSrc?.match(IS_URL) && (
          <ArtImg
            alt={`Artwork: ${name} by ${artistName}`}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEXo6Og4/a9sAAAAC0lEQVQI12MYYQAAAPAAAU6V2N8AAAAASUVORK5CYII=
            "
            fill
            placeholder="blur"
            src={imgSrc}
            style={{
              objectPosition: 'left center',
              objectFit: 'scale-down',
            }}
          />
        )}
        <Body>{name}</Body>
        <Body>{artistName}</Body>

        <Body className="text-xs leading-2 font-medium">
          {locationName || 'Unknown'}
        </Body>
        <Body className="text-xs leading-2 font-medium">
          {formatDate(dateSeen) || 'Unknown'}
        </Body>
        <ListeningToCard listeningTo={ListeningTo} size="sm" />
      </div>
    </ListItemWrapper>
  );
}

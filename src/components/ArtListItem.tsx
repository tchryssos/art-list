import clsx from 'clsx';
import { useContext } from 'react';

import { IS_URL } from '~/constants/regex';
import { createArtDetailRoute } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { formatDate } from '~/logic/util/date';
import { CompleteArt } from '~/typings/art';

import { ArtImg } from './ArtImg';
import { Link } from './Link';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: CompleteArt;
}

interface ListItemWrapperProps {
  children: React.ReactNode;
  isAuthorized: boolean;
  artId: number;
}

function ListItemWrapper({
  children,
  isAuthorized,
  artId,
}: ListItemWrapperProps) {
  return isAuthorized ? (
    <Link href={createArtDetailRoute(`${artId}`)}>{children}</Link>
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
  } = art;

  const { isAuthorized } = useContext(AuthContext);

  if (!(name && artistId)) {
    return null;
  }

  return (
    <ListItemWrapper artId={art.id} isAuthorized={isAuthorized}>
      <div
        className={clsx(
          'flex flex-col- border border-solid border-accentHeavy p-4 gap-2',
          isAuthorized &&
            'hover:border-text hover:bg-smudge active:border-text  active:bg-smudge'
        )}
      >
        <Body>{name}</Body>
        <Body>{artistName}</Body>
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
        <Body>{locationName || '???'}</Body>
        <Body>{formatDate(dateSeen) || '???'}</Body>
      </div>
    </ListItemWrapper>
  );
}

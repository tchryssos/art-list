import styled from '@emotion/styled';
import { useContext } from 'react';

import { IS_URL } from '~/constants/regex';
import { createArtDetailRoute } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { formatDate } from '~/logic/util/date';
import { CompleteArt } from '~/typings/art';

import { ArtImg } from './ArtImg';
import { FlexBox } from './box/FlexBox';
import { Link } from './Link';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: CompleteArt;
}

const Frame = styled(FlexBox)<{ isAuthorized: boolean }>(
  ({ theme, isAuthorized }) => ({
    border: `${theme.border.borderWidth[1]} solid ${theme.colors.accentHeavy}`,
    padding: theme.spacing[16],
    gap: theme.spacing[8],
    ...(isAuthorized && {
      '&:hover, &:active': {
        borderColor: theme.colors.text,
        backgroundColor: theme.colors.smudge,
      },
    }),
  })
);

interface ListItemWrapperProps {
  children: React.ReactNode;
  isAuthorized: boolean;
  artId: number;
}

const ListItemWrapper: React.FC<ListItemWrapperProps> = ({
  children,
  isAuthorized,
  artId,
}) =>
  isAuthorized ? (
    <Link darkenOnHover={false} href={createArtDetailRoute(`${artId}`)}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

export const ArtListItem: React.FC<ArtListItemProps> = ({ art }) => {
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
      <Frame column isAuthorized={isAuthorized}>
        <Body>{name}</Body>
        <Body>{artistName}</Body>
        {imgSrc?.match(IS_URL) && (
          <ArtImg
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEXo6Og4/a9sAAAAC0lEQVQI12MYYQAAAPAAAU6V2N8AAAAASUVORK5CYII=
            "
            layout="fill"
            objectFit="scale-down"
            objectPosition="left center"
            placeholder="blur"
            src={imgSrc}
          />
        )}
        <Body>{locationName || '???'}</Body>
        <Body>{formatDate(dateSeen) || '???'}</Body>
      </Frame>
    </ListItemWrapper>
  );
};

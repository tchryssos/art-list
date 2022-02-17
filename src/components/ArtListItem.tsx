import styled from '@emotion/styled';

import { IS_URL } from '~/constants/regex';
import { createArtDetailRoute } from '~/constants/routing';
import { formatDate } from '~/logic/util/date';
import { CompleteArt } from '~/typings/art';

import { ArtImg } from './ArtImg';
import { FlexBox } from './box/FlexBox';
import { Link } from './Link';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: CompleteArt;
}

const Frame = styled(FlexBox)(({ theme }) => ({
  border: `${theme.border.borderWidth[1]} solid ${theme.colors.accentHeavy}`,
  padding: theme.spacing[16],
  gap: theme.spacing[8],
  '&:hover, &:active': {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.smudge,
  },
}));

export const ArtListItem: React.FC<ArtListItemProps> = ({ art }) => {
  const {
    name,
    dateSeen,
    Artist: { name: artistName },
    Location: { name: locationName },
    imgSrc,
    artistId,
  } = art;

  if (!(name && artistId)) {
    return null;
  }

  return (
    <Link darkenOnHover={false} href={createArtDetailRoute(`${art.id}`)}>
      <Frame column>
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
    </Link>
  );
};

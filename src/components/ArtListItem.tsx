import styled from '@emotion/styled';

import { IS_URL } from '~/constants/regex';
import { createArtDetailRoute } from '~/constants/routing';
import { pxToRem } from '~/logic/util/styles';
import { TEMPart } from '~/typings/art';

import { FlexBox } from './box/FlexBox';
import { Image } from './Image';
import { Link } from './Link';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: TEMPart;
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

const ArtImg = styled(Image)`
  width: 100%;
  min-height: ${pxToRem(240)};
  position: relative;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  ${({ theme }) => theme.breakpoints.sm} {
    min-height: ${pxToRem(400)};
  }
`;

export const ArtListItem: React.FC<ArtListItemProps> = ({ art }) => {
  const { name, artist, location, date, imgSrc } = art;

  return (
    <Link darkenOnHover={false} href={createArtDetailRoute('1000')}>
      <Frame column>
        <Body>{name}</Body>
        <Body>{artist}</Body>
        {imgSrc?.match(IS_URL) && (
          <ArtImg
            layout="fill"
            objectFit="scale-down"
            objectPosition="left center"
            src={imgSrc}
          />
        )}
        <Body>{location}</Body>
        <Body>{date}</Body>
      </Frame>
    </Link>
  );
};

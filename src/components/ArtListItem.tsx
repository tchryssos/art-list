import styled from '@emotion/styled';
import { SyntheticEvent, useState } from 'react';

import { IS_URL } from '~/constants/regex';
import { pxToRem } from '~/logic/util/styles';
import { TEMPart } from '~/typings/art';

import { FlexBox } from './box/FlexBox';
import { Image } from './Image';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: TEMPart;
}

const Frame = styled(FlexBox)(({ theme }) => ({
  border: `${theme.border.borderWidth[1]} solid ${theme.colors.text}`,
  padding: theme.spacing[16],
  gap: theme.spacing[8],
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
  const [imageElement, setImageElement] = useState<HTMLImageElement>();

  const onLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (target.complete) {
      setImageElement(e.target as HTMLImageElement);
    }
  };

  const { name, artist, location, date, imgSrc } = art;

  return (
    <Frame column>
      <Body>{name}</Body>
      <Body>{artist}</Body>
      {imgSrc?.match(IS_URL) && (
        <ArtImg
          layout="fill"
          objectFit="scale-down"
          objectPosition="left center"
          src={imgSrc}
          onLoad={onLoad}
        />
      )}
      <Body>{location}</Body>
      <Body>{date}</Body>
    </Frame>
  );
};

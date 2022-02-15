import styled from '@emotion/styled';

import { TEMPart } from '~/typings/art';

import { FlexBox } from './box/FlexBox';
import { Body } from './typography/Body';

interface ArtListItemProps {
  art: TEMPart;
}

const Frame = styled(FlexBox)(({ theme }) => ({
  border: `${theme.border.borderWidth[1]} solid ${theme.colors.text}`,
  padding: theme.spacing[16],
  gap: theme.spacing[8],
}));

export const ArtListItem: React.FC<ArtListItemProps> = ({ art }) => {
  const { name, artist, location, date, imgSrc } = art;

  return (
    <Frame column>
      <Body>{name}</Body>
      <Body>{artist}</Body>
      <img src={imgSrc} />
      <Body>{location}</Body>
      <Body>{date}</Body>
    </Frame>
  );
};

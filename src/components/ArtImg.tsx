import styled from '@emotion/styled';

import { pxToRem } from '~/logic/util/styles';

import { Image } from './Image';

export const ArtImg = styled(Image)`
  width: 100%;
  min-height: ${pxToRem(320)};
  position: relative;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  ${({ theme }) => theme.breakpoints.sm} {
    min-height: ${pxToRem(400)};
  }
`;

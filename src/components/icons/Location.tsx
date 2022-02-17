import styled from '@emotion/styled';

import { Icon } from './Icon';
import { IconProps } from './types';

const Path = styled.path<Pick<IconProps, 'color'>>`
  fill: ${({ color = 'text', theme }) => theme.colors[color]};
`;

export const Location: React.FC<IconProps> = ({
  className,
  color,
  title = 'Add Location',
  titleId = 'add-location-icon',
}) => (
  <Icon className={className} title={title} titleId={titleId}>
    <Path
      color={color}
      d="M9 11.5A2.5 2.5 0 0 0 11.5 9 2.5 2.5 0 0 0 9 6.5 2.5 2.5 0 0 0 6.5 9 2.5 2.5 0 0 0 9 11.5M9 2c3.86 0 7 3.13 7 7 0 5.25-7 13-7 13S2 14.25 2 9a7 7 0 0 1 7-7m6 15h3v-3h2v3h3v2h-3v3h-2v-3h-3v-2Z"
    />
  </Icon>
);

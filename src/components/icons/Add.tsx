import styled from '@emotion/styled';

import { Icon } from './Icon';
import { IconProps } from './types';

const Path = styled.path<Pick<IconProps, 'color'>>`
  fill: ${({ color = 'text', theme }) => theme.colors[color]};
`;

export const Add: React.FC<IconProps> = ({
  className,
  color,
  title = 'Add Artwork',
  titleId = 'add-artwork-icon',
}) => (
  <Icon className={className} title={title} titleId={titleId}>
    <Path color={color} d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />
  </Icon>
);

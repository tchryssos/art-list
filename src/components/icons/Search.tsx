import styled from '@emotion/styled';

import { Icon } from './Icon';
import { IconProps } from './types';

const Path = styled.path<Pick<IconProps, 'color'>>`
  fill: ${({ color = 'text', theme }) => theme.colors[color]};
`;

export const Search: React.FC<IconProps> = ({
  className,
  color,
  title,
  titleId,
}) => (
  <Icon className={className} title={title} titleId={titleId}>
    <Path
      color={color}
      d="M11.5 9a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-3.21 14.21-2.91-2.91c-.69.44-1.51.7-2.38.7C9 16 7 14 7 11.5S9 7 11.5 7a4.481 4.481 0 0 1 3.8 6.89l2.91 2.9-1.42 1.42Z"
    />
  </Icon>
);

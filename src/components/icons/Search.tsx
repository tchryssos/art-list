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
      d="M11.5 16c.87 0 1.69-.26 2.38-.7l2.44 2.44 1.42-1.42-2.44-2.43A4.481 4.481 0 0 0 11.5 7C9 7 7 9 7 11.5S9 16 11.5 16m0-7a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V6h16v12Z"
    />
  </Icon>
);

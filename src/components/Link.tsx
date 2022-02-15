import styled from '@emotion/styled';
import NextLink from 'next/link';

interface LinkProps {
  href: string;
  isInternal?: boolean;
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
  darkenOnHover?: boolean;
}

interface StyledProps extends Pick<LinkProps, 'underline' | 'darkenOnHover'> {}

const StyledLink = styled.a<StyledProps>`
  color: ${({ theme }) => theme.colors.text};
  display: inline-block;
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'none')};
  :hover {
    filter: brightness(
      ${({ theme, darkenOnHover }) =>
        darkenOnHover ? theme.filters.brightnessMod : ''}
    );
  }
`;

export const Link: React.FC<LinkProps> = ({
  href,
  isInternal = true,
  children,
  className,
  darkenOnHover = true,
}) => (
  <NextLink href={href} passHref>
    <StyledLink
      className={className}
      darkenOnHover={darkenOnHover}
      rel="noopener noreferrer"
      target={isInternal ? '_self' : '_blank'}
    >
      {children}
    </StyledLink>
  </NextLink>
);

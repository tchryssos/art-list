import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import {
  ART_ADD_ROUTE,
  AUTH_ROUTE_PATTERNS,
  HOME_ROUTE,
} from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { useBreakpointsAtLeast } from '~/logic/hooks/useBreakpoints';
import { pxToRem } from '~/logic/util/styles';

import { FlexBox } from '../box/FlexBox';
import { Button } from '../buttons/Button';
import { Add } from '../icons/Add';
import { Search } from '../icons/Search';
import { IconProps } from '../icons/types';
import { Link } from '../Link';
import { Title } from '../typography/Title';
import { Unauthorized } from '../Unauthorized';
import { Head } from './Head';

export type NavVariant = 'art' | 'list';

type LayoutProps = {
  children?: React.ReactNode;
  title?: string;
  nav?: NavVariant[];
  pageTitle: string;
};

const PageWrapper = styled(FlexBox)`
  max-width: ${({ theme }) => theme.breakpointValues.md}px;
  width: 100%;
  height: 100%;
  position: relative;
`;

const NavWrapper = styled(FlexBox)`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: ${({ theme }) => theme.spacing[20]};
  gap: ${({ theme }) => theme.spacing[16]};
`;

const NavButton = styled(Button)(({ theme }) => ({
  width: theme.spacing[64],
  height: theme.spacing[64],
  padding: theme.spacing[16],
  borderRadius: theme.border.borderRadius.round,
  boxShadow: `${pxToRem(1)} ${pxToRem(1)} ${pxToRem(1)} ${
    theme.colors.accentHeavy
  }`,
}));

const Nav: React.FC<Pick<LayoutProps, 'nav'>> = ({ nav }) => {
  if (nav) {
    return (
      <NavWrapper>
        {nav.map((n) => {
          let route: string;
          let Icon: React.FC<IconProps>;

          switch (n) {
            case 'list':
              route = HOME_ROUTE;
              Icon = Search;
              break;
            default:
              route = ART_ADD_ROUTE;
              Icon = Add;
              break;
          }
          return (
            <Link href={route} key={n}>
              <NavButton buttonLike>
                <Icon />
              </NavButton>
            </Link>
          );
        })}
      </NavWrapper>
    );
  }
  return null;
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  nav,
  pageTitle,
}) => {
  const isAtLeastXs = useBreakpointsAtLeast('xs');
  const { pathname } = useRouter();

  const { isAuthorized } = useContext(AuthContext);

  const unauthorizedPage = AUTH_ROUTE_PATTERNS.some(
    (p) => pathname.match(p) && !isAuthorized
  );

  return (
    <>
      <Head title={title} />
      <FlexBox flex={1} justifyContent="center" p={isAtLeastXs ? 32 : 16}>
        <PageWrapper column>
          {unauthorizedPage ? (
            <Unauthorized />
          ) : (
            <>
              <Title mb={16}>{pageTitle}</Title>
              {children}
              <Nav nav={nav} />
            </>
          )}
        </PageWrapper>
      </FlexBox>
    </>
  );
};

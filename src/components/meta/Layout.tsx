import styled from '@emotion/styled';

import { HOME_ROUTE, LIST_ROUTE } from '~/constants/routing';
import { useBreakpointsAtLeast } from '~/logic/hooks/useBreakpoints';
import { pxToRem } from '~/logic/util/styles';

import { FlexBox } from '../box/FlexBox';
import { Button } from '../buttons/Button';
import { Home } from '../icons/Home';
import { Search } from '../icons/Search';
import { Link } from '../Link';
import { Head } from './Head';

type LayoutProps = {
  children?: React.ReactNode;
  title?: string;
  nav?: 'home' | 'list';
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
        <Link href={nav === 'home' ? HOME_ROUTE : LIST_ROUTE}>
          <NavButton buttonLike>
            {nav === 'home' ? (
              <Home title="Home" titleId="home-nav-icon" />
            ) : (
              <Search title="Art List" titleId="search-nav-icon" />
            )}
          </NavButton>
        </Link>
      </NavWrapper>
    );
  }
  return null;
};

export const Layout: React.FC<LayoutProps> = ({ children, title, nav }) => {
  const isAtLeastXs = useBreakpointsAtLeast('xs');

  return (
    <>
      <Head title={title} />
      <FlexBox flex={1} justifyContent="center" p={isAtLeastXs ? 32 : 16}>
        <PageWrapper column>
          {children}
          <Nav nav={nav} />
        </PageWrapper>
      </FlexBox>
    </>
  );
};

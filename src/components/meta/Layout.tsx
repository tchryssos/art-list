import { mdiMagnify, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import {
  ART_ADD_ROUTE,
  AUTH_ROUTE_PATTERNS,
  HOME_ROUTE,
} from '~/constants/routing';
import { colors } from '~/constants/theme';
import { AuthContext } from '~/logic/contexts/authContext';

import { Button } from '../buttons/Button';
import { Link } from '../Link';
import { Title } from '../typography/Title';
import { Unauthorized } from '../Unauthorized';

export type NavVariant = 'art' | 'list';

type LayoutProps = {
  children?: React.ReactNode;
  title: string;
  nav?: NavVariant[];
  pageTitle?: string;
};

function Nav({ nav }: Pick<LayoutProps, 'nav'>) {
  if (nav) {
    return (
      <div className="flex fixed bottom-0 right-0 m-5 gap-4">
        {nav.map((n) => {
          let route: string;
          let path: string;

          switch (n) {
            case 'list':
              route = HOME_ROUTE;
              path = mdiMagnify;
              break;
            default:
              route = ART_ADD_ROUTE;
              path = mdiPlus;
              break;
          }
          return (
            <Link href={route} key={n}>
              <Button
                buttonLike
                className="h-16 w-16 p-4 rounded-full shadow-nav-button border-none hover:bg-accentHeavy active:bg-accentHeavy"
              >
                <Icon color={colors.text} path={path} />
              </Button>
            </Link>
          );
        })}
      </div>
    );
  }
  return null;
}

export function Layout({ children, title, nav, pageTitle }: LayoutProps) {
  const { pathname } = useRouter();

  const { isAuthorized } = useContext(AuthContext);

  const unauthorizedPage = AUTH_ROUTE_PATTERNS.some(
    (p) => pathname === p && !isAuthorized
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-1 justify-center p-4 sm:p-8">
        <div className="flex flex-col max-w-breakpoint-lg w-full h-full relative xl:max-w-breakpoint-xl">
          {unauthorizedPage ? (
            <Unauthorized />
          ) : (
            <>
              {pageTitle && <Title className="mb-4">{pageTitle}</Title>}
              {children}
              <Nav nav={nav} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

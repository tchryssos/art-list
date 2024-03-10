import { mdiImageSearchOutline, mdiLogin, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import {
  ART_ADD_ROUTE,
  AUTH_ROUTE_PATTERNS,
  HOME_ROUTE,
  LOGIN_ROUTE,
} from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';

import { Button } from '../buttons/Button';
import { Link } from '../Link';
import { Body } from '../typography/Body';
import { Title } from '../typography/Title';
import { Unauthorized } from '../Unauthorized';

export type NavVariant = 'art' | 'list';

type LayoutProps = {
  children?: React.ReactNode;
  title: string;
  nav?: NavVariant;
  pageTitle?: string;
};

interface NavProps extends Pick<LayoutProps, 'nav'> {
  isAuthorized: boolean;
}

function Nav({ nav, isAuthorized }: NavProps) {
  if (nav || !isAuthorized) {
    let route: string;
    let path: string;

    if (isAuthorized) {
      switch (nav) {
        case 'list':
          route = HOME_ROUTE;
          path = mdiImageSearchOutline;
          break;
        default:
          route = ART_ADD_ROUTE;
          path = mdiPlus;
          break;
      }
    } else {
      route = LOGIN_ROUTE;
      path = mdiLogin;
    }

    return (
      <div className="flex fixed bottom-0 right-0 m-5 gap-4">
        <Link href={route}>
          <Button
            buttonLike
            className="h-16 w-16 p-4 rounded-full shadow-nav-button border-none  bg-primary hover:bg-accentHeavy active:bg-accentHeavy"
          >
            <Icon className="text-background" path={path} />
          </Button>
        </Link>
      </div>
    );
  }
  return null;
}

function HomeLink() {
  return (
    <Link className="min-w-12" href={HOME_ROUTE}>
      <Body>Troy&apos;s Art List</Body>
    </Link>
  );
}

export function Layout({ children, title, nav, pageTitle }: LayoutProps) {
  const { pathname } = useRouter();

  const { isAuthorized } = useContext(AuthContext);

  const unauthorizedPage = AUTH_ROUTE_PATTERNS.some(
    (p) => pathname === p && !isAuthorized
  );

  const boundingClassName = 'max-w-breakpoint-lg xl:max-w-breakpoint-xl';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-1 justify-center p-4 sm:p-8 sm:pt-14 pt-14 relative">
        <div className="absolute top-0 left-0 w-full h-14 z-50 justify-center flex px-4 sm:px-8">
          <div
            className={clsx(
              boundingClassName,
              'flex items-center justify-between w-full'
            )}
          >
            <HomeLink />
          </div>
        </div>
        <div
          className={clsx(
            boundingClassName,
            'flex flex-col w-full h-full relative'
          )}
        >
          {unauthorizedPage ? (
            <Unauthorized />
          ) : (
            <>
              {pageTitle && <Title className="mb-4">{pageTitle}</Title>}
              {children}
              <Nav isAuthorized={isAuthorized} nav={nav} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

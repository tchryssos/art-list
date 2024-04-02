import { GetServerSideProps } from 'next';

import { Layout } from '~/components/meta/Layout';
import { Unauthorized } from '~/components/Unauthorized';
import { HOME_ROUTE } from '~/constants/routing';
import { isCookieAuthorized } from '~/logic/api/auth';

function Login() {
  return (
    <Layout noAction title="Log In">
      <Unauthorized />
    </Layout>
  );
}

export default Login;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const isAuthorized = isCookieAuthorized(req);

  if (isAuthorized) {
    return {
      redirect: {
        destination: HOME_ROUTE,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

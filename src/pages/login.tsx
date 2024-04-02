import { GetServerSideProps } from 'next';

import { Layout } from '~/components/meta/Layout';
import { Unauthorized } from '~/components/Unauthorized';
import { AUTH_COOKIE_KEY } from '~/constants/auth';
import { HOME_ROUTE } from '~/constants/routing';

function Login() {
  return (
    <Layout noAction title="Log In">
      <Unauthorized />
    </Layout>
  );
}

export default Login;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const authorized = req.cookies?.[AUTH_COOKIE_KEY] === 'true';
  if (authorized) {
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

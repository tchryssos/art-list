import { GetServerSideProps } from 'next';

import { Layout } from '~/components/meta/Layout';
import { Unauthorized } from '~/components/Unauthorized';

interface LoginPageProps {
  authorized: boolean;
}

function Login({ authorized }: LoginPageProps) {
  return (
    <Layout noAction title="Log In">
      <Unauthorized />
    </Layout>
  );
}

export default Login;

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async ({
  req,
}) => {
  const isAuthorized = req.cookies?.authorized === 'true';
  return {
    props: {
      authorized: isAuthorized,
    },
  };
};

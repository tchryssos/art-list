import { Layout } from '~/components/meta/Layout';
import { Unauthorized } from '~/components/Unauthorized';

function Login() {
  return (
    <Layout noAction title="Log In">
      <Unauthorized />
    </Layout>
  );
}

export default Login;

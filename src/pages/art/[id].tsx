import { Layout, NavVariant } from '~/components/meta/Layout';

const artDetailNav: NavVariant[] = ['art'];

const ArtDetail: React.FC = () => (
  <Layout nav={artDetailNav}>
    <div>DETAIL PAGE</div>
  </Layout>
);

export default ArtDetail;

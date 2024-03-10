import { GetStaticProps } from 'next';

import { HOME_ROUTE } from '~/constants/routing';

function FourOhFour() {
  return null;
}

export default FourOhFour;

export const getStaticProps: GetStaticProps = async () => ({
  redirect: {
    destination: HOME_ROUTE,
    permanent: false,
  },
});

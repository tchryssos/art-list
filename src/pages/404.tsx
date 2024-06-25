import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { HOME_ROUTE } from '~/constants/routing';

function FourOhFour() {
  const router = useRouter();

  useEffect(() => {
    router.replace(HOME_ROUTE);
  }, [router]);

  return null;
}

export default FourOhFour;

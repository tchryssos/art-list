import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { HOME_ROUTE } from '~/constants/routing';

const FourOhFour: React.FC = () => {
  const { push } = useRouter();

  useEffect(() => {
    push(HOME_ROUTE);
  }, [push]);

  return null;
};

export default FourOhFour;

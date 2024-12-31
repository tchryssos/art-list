import { useState } from 'react';

import { SubmitButton } from '~/components/buttons/SubmitButton';
import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout } from '~/components/meta/Layout';
import { HOME_ROUTE } from '~/constants/routing';

function LocationDetail() {
  const [locationName] = useState('Location');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit = () => {};
  return (
    <Layout nav="art" pageTitle={locationName} title={locationName}>
      <Form onSubmit={onSubmit}>
        <Input label="Location Name" name="name" type="text" />
        <SubmitButton isSubmitting={false} />
      </Form>
    </Layout>
  );
}

export default LocationDetail;

export const getServerSideProps = async () => ({
  redirect: {
    destination: HOME_ROUTE,
    permanent: false,
  },
});

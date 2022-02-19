import { useState } from 'react';

import { SubmitButton } from '~/components/buttons/SubmitButton';
import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout, NavVariant } from '~/components/meta/Layout';

const artistNav: NavVariant[] = ['art'];

const LocationDetail: React.FC = () => {
  const [locationName] = useState('Location');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit = () => {};
  return (
    <Layout nav={artistNav} pageTitle={locationName}>
      <Form onSubmit={onSubmit}>
        <Input label="Location Name" name="name" type="text" />
        <SubmitButton isSubmitting={false} />
      </Form>
    </Layout>
  );
};

export default LocationDetail;

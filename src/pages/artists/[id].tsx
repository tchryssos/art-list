import { useState } from 'react';

import { SubmitButton } from '~/components/buttons/SubmitButton';
import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout } from '~/components/meta/Layout';

function ArtistDetail() {
  const [artistName] = useState('Artist');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit = () => {};

  return (
    <Layout nav="art" pageTitle={artistName} title="Artist Detail">
      <Form onSubmit={onSubmit}>
        <Input label="Artist Name" name="name" type="text" />
        <SubmitButton isSubmitting={false} />
      </Form>
    </Layout>
  );
}

export default ArtistDetail;

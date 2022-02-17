import { useState } from 'react';

import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { Title } from '~/components/typography/Title';

const artistNav: NavVariant[] = ['art'];

const LocationDetail: React.FC = () => {
  const [locationName, setLocationName] = useState('Location');

  const onSubmit = () => {
    const test = '';
  };
  return (
    <Layout nav={artistNav}>
      <Title mb={16}>{locationName}</Title>
      <Form onSubmit={onSubmit}>
        <Input label="Location Name" name="name" type="text" />
      </Form>
    </Layout>
  );
};

export default LocationDetail;

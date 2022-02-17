import { useState } from 'react';

import { SubmitButton } from '~/components/buttons/SubmitButton';
import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { Title } from '~/components/typography/Title';

const artistNav: NavVariant[] = ['art'];

const ArtistDetail: React.FC = () => {
  const [artistName, setArtistName] = useState('Artist');

  const onSubmit = () => {
    const test = '';
  };

  return (
    <Layout nav={artistNav}>
      <Title mb={16}>{artistName}</Title>
      <Form onSubmit={onSubmit}>
        <Input label="Artist Name" name="name" type="text" />
        <SubmitButton />
      </Form>
    </Layout>
  );
};

export default ArtistDetail;

import styled from '@emotion/styled';
import { FormEvent } from 'react';

import { Button } from '~/components/buttons/Button';
import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { Title } from '~/components/typography/Title';

const Submit = styled(Button)`
  width: fit-content;
`;

const Home: React.FC = () => {
  const onSubmit = (e: FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    // @ts-expect-error TS warns about .values
    // as its not supported in IE
    for (const entry of formData.values()) {
      // eslint-disable-next-line no-console
      console.log(entry);
    }
  };
  return (
    <Layout>
      <Form onSubmit={onSubmit}>
        <Title>Art Form</Title>
        <Input label="Artist" name="artist" required type="text" />
        <Input label="Artwork Name" name="name" required type="text" />
        <Input label="Location Seen" name="location" required type="text" />
        <Input label="Date Seen" name="date" required type="date" />
        <Submit type="submit">
          <Body>Submit</Body>
        </Submit>
      </Form>
    </Layout>
  );
};

export default Home;

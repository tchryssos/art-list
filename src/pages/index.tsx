import { FormEvent, useContext } from 'react';

import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { Title } from '~/components/typography/Title';
import { BreakpointsContext } from '~/logic/contexts/breakpointsContext';

const Home: React.FC = () => {
  const breakpoints = useContext(BreakpointsContext);

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
      </Form>
    </Layout>
  );
};

export default Home;

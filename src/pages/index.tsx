import padStart from 'lodash.padstart';
import { FormEvent } from 'react';

import { ArtForm } from '~/components/form/ArtForm';
import { Layout } from '~/components/meta/Layout';

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

  const getTodayDefaultValue = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = padStart(String(d.getMonth() + 1), 2, '0');
    const day = padStart(String(d.getDate()), 2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <Layout nav="list">
      <ArtForm
        defaultValues={{ date: getTodayDefaultValue() }}
        formTitle="Add New Artwork"
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default Home;

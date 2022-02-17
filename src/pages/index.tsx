import padStart from 'lodash.padstart';
import { FormEvent } from 'react';

import { ArtForm } from '~/components/form/ArtForm';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { ART_CREATE_ROUTE } from '~/constants/routing';

const homeNav: NavVariant[] = ['list'];

const Home: React.FC = () => {
  const onSubmit = async (e: FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    const resp = await fetch(ART_CREATE_ROUTE, {
      method: 'CREATE',
      body: formData,
    });

    return resp.json();
  };

  const getTodayDefaultValue = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = padStart(String(d.getMonth() + 1), 2, '0');
    const day = padStart(String(d.getDate()), 2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <Layout nav={homeNav}>
      <ArtForm
        defaultValues={{ date: getTodayDefaultValue() }}
        formTitle="Add New Artwork"
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default Home;

import { padStart } from 'lodash';
import { FormEvent, useState } from 'react';

import { Button } from '~/components/buttons/Button';
import { ArtForm } from '~/components/form/ArtForm';
import { Layout, NavVariant } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { ART_CREATE_ROUTE } from '~/constants/routing';
import { formDataToJson } from '~/logic/util/forms';

const homeNav: NavVariant[] = ['list'];

function AddArtPage() {
  const [submitSuccessful, setSubmitSuccessful] = useState<boolean | null>(
    null
  );

  const onSubmit = async (e: FormEvent) => {
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const resp = await fetch(ART_CREATE_ROUTE, {
        method: 'POST',
        body: formDataToJson(formData),
      });

      if (resp.status === 200) {
        setSubmitSuccessful(true);
      } else {
        setSubmitSuccessful(false);
      }
    } catch (error) {
      console.error(error);
      setSubmitSuccessful(false);
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
    <Layout nav={homeNav} pageTitle="Add New Artwork" title="Add New Artwork">
      {submitSuccessful ? (
        <>
          <Body className="mb-4">Submit Successful!</Body>
          <Button
            className="p-2 h-12"
            onClick={() => setSubmitSuccessful(null)}
          >
            <Body>Submit Another?</Body>
          </Button>
        </>
      ) : (
        <ArtForm
          defaultValues={{ dateSeen: getTodayDefaultValue() }}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
}

export default AddArtPage;

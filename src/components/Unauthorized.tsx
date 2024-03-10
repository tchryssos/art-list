import { FormEvent, useContext, useState } from 'react';

import { AUTH_ROUTE, HOME_ROUTE } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { formDataToJson } from '~/logic/util/forms';

import { Button } from './buttons/Button';
import { SubmitButton } from './buttons/SubmitButton';
import { Form } from './form/Form';
import { Input } from './form/Input';
import { Link } from './Link';
import { Body } from './typography/Body';
import { Title } from './typography/Title';

type PasswordData = {
  password: string;
};

export function Unauthorized() {
  const { setIsAuthorized } = useContext(AuthContext);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    setisSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const jsonData = formDataToJson(formData);
    const resp = await fetch(AUTH_ROUTE, {
      method: 'POST',
      body: jsonData,
    });

    if (resp.status === 200) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      setisSubmitting(false);
      setError('Invalid password');
    }
  };
  return (
    <>
      <Title bold className="mb-4">
        Enter password to view this page
      </Title>
      <Form onSubmit={onSubmit}>
        <Input<PasswordData>
          error={error}
          label="Password"
          name="password"
          required
          type="password"
        />
        <div className="grid gap-4 grid-cols-2">
          <SubmitButton isSubmitting={isSubmitting} />
          <Link href={HOME_ROUTE}>
            <Button buttonLike className="h-full border" transparent>
              <Body>Back to List</Body>
            </Button>
          </Link>
        </div>
      </Form>
    </>
  );
}

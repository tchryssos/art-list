import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useContext, useState } from 'react';

import { AUTH_ROUTE, HOME_ROUTE } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { formDataToJson } from '~/logic/util/forms';
import type { AuthData } from '~/pages/api/authorize';

import { Button } from './buttons/Button';
import { SubmitButton } from './buttons/SubmitButton';
import { Form } from './form/Form';
import { Input } from './form/Input';
import { Link } from './Link';
import { Body } from './typography/Body';

export function Unauthorized() {
  const { setIsAuthorized, isAuthorized } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { push } = useRouter();

  const onSubmit = async (e: FormEvent) => {
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const jsonData = formDataToJson(formData);
    const resp = await fetch(AUTH_ROUTE, {
      method: 'POST',
      body: jsonData,
    });

    if (resp.status === 200) {
      setIsAuthorized(true);
      push(HOME_ROUTE);
    } else {
      setIsAuthorized(false);
      setIsSubmitting(false);
      setError('Invalid username or password. Please try again.');
    }
  };
  // Auth starts as null until determined
  // We don't want this to flash while we're figuring out if you're authed
  if (isAuthorized === false) {
    return (
      <Form onSubmit={onSubmit}>
        <Input<AuthData>
          error={error}
          label="Username"
          name="username"
          required
          type="text"
        />
        <Input<AuthData>
          error={error}
          label="Password"
          name="password"
          required
          type="password"
        />
        <div className="grid gap-4 grid-cols-2">
          <SubmitButton isSubmitting={isSubmitting} label="Log In" />
          <Link href={HOME_ROUTE}>
            <Button buttonLike className="h-full border" transparent>
              <Body>Back to List</Body>
            </Button>
          </Link>
        </div>
      </Form>
    );
  }

  return null;
}

import styled from '@emotion/styled';
import { FormEvent, useContext, useState } from 'react';

import { AUTH_ROUTE, HOME_ROUTE } from '~/constants/routing';
import { AuthContext } from '~/logic/contexts/authContext';
import { formDataToJson } from '~/logic/util/forms';

import { FlexBox } from './box/FlexBox';
import { GridBox } from './box/GridBox';
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

const HomeButton = styled(Button)`
  height: 100%;
`;

export const Unauthorized: React.FC = () => {
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
      <Title mb={16}>Enter password to view this page</Title>
      <Form onSubmit={onSubmit}>
        <Input<PasswordData>
          error={error}
          label="Password"
          name="password"
          required
          type="password"
        />
        <GridBox columnGap={16}>
          <SubmitButton isSubmitting={isSubmitting} />
          <Link href={HOME_ROUTE}>
            <HomeButton buttonLike transparent>
              <Body>Back to List</Body>
            </HomeButton>
          </Link>
        </GridBox>
      </Form>
    </>
  );
};

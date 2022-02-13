import styled from '@emotion/styled';
import padStart from 'lodash.padstart';
import { FormEvent } from 'react';

import { FlexBox } from '~/components/box/FlexBox';
import { Button } from '~/components/buttons/Button';
import { Form } from '~/components/form/Form';
import { Input } from '~/components/form/Input';
import { Search } from '~/components/icons/Search';
import { Link } from '~/components/Link';
import { Layout } from '~/components/meta/Layout';
import { Body } from '~/components/typography/Body';
import { Title } from '~/components/typography/Title';
import { LIST_ROUTE } from '~/constants/routing';

const Submit = styled(Button)`
  width: fit-content;
  padding: ${({ theme }) => theme.spacing[16]};
`;

const NavButton = styled(Button)`
  height: ${({ theme }) => theme.spacing[48]};
  width: ${({ theme }) => theme.spacing[48]};
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

  const getTodayDefaultValue = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = padStart(String(d.getMonth() + 1), 2, '0');
    const day = padStart(String(d.getDate()), 2, '0');

    return `${year}-${month}-${day}`;
  };
  return (
    <Layout>
      <FlexBox justifyContent="flex-end">
        <Link href={LIST_ROUTE}>
          <NavButton buttonLike>
            <Search title="Search" titleId="search-icon" />
          </NavButton>
        </Link>
      </FlexBox>
      <Form onSubmit={onSubmit}>
        <Title>Art Form</Title>
        <Input label="Artist" name="artist" required type="text" />
        <Input label="Artwork Name" name="name" required type="text" />
        <Input label="Location Seen" name="location" required type="text" />
        <Input
          defaultValue={getTodayDefaultValue()}
          label="Date Seen"
          name="date"
          required
          type="date"
        />
        <Submit type="submit">
          <Body bold>Submit</Body>
        </Submit>
      </Form>
    </Layout>
  );
};

export default Home;

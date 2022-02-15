import styled from '@emotion/styled';
import padStart from 'lodash.padstart';
import { FormEvent } from 'react';

import { FlexBox } from '~/components/box/FlexBox';
import { Button } from '~/components/buttons/Button';
import { ArtForm } from '~/components/form/ArtForm';
import { Search } from '~/components/icons/Search';
import { Link } from '~/components/Link';
import { Layout } from '~/components/meta/Layout';
import { LIST_ROUTE } from '~/constants/routing';

const Nav = styled(FlexBox)`
  margin-top: auto;
`;

const NavButton = styled(Button)(({ theme }) => ({
  width: theme.spacing[64],
  height: theme.spacing[64],
  padding: theme.spacing[16],
  borderRadius: theme.border.borderRadius.round,
}));

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
      <ArtForm
        defaultValues={{ date: getTodayDefaultValue() }}
        formTitle="Add New Artwork"
        onSubmit={onSubmit}
      />
      <Nav justifyContent="flex-end">
        <Link href={LIST_ROUTE}>
          <NavButton buttonLike>
            <Search title="Search" titleId="search-icon" />
          </NavButton>
        </Link>
      </Nav>
    </Layout>
  );
};

export default Home;

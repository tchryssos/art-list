import styled from '@emotion/styled';
import { Artist, Location } from '@prisma/client';
import { FormEvent, useEffect, useState } from 'react';

import { ARTISTS_LIST_ROUTE, LOCATION_LIST_ROUTE } from '~/constants/routing';
import { pxToRem } from '~/logic/util/styles';
import { ArtSubmitData } from '~/typings/art';

import { FlexBox } from '../box/FlexBox';
import { SubmitButton } from '../buttons/SubmitButton';
import { Body } from '../typography/Body';
import { Title } from '../typography/Title';
import { Form } from './Form';
import { Input } from './Input';

interface ArtFormProps {
  formTitle: string;
  defaultValues?: Partial<ArtSubmitData>;
  onSubmit: (e: FormEvent) => void;
}

const AutoCompleteWrapper = styled.div`
  position: relative;
`;

const AutoComplete = styled(FlexBox)`
  position: absolute;
  width: 100%;
  max-height: ${pxToRem(240)};
  border: ${({ theme }) =>
    `${theme.border.borderWidth[1]} solid ${theme.colors.accentHeavy}`};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 2;
  top: ${pxToRem(80)};
  box-shadow: ${({ theme }) =>
    `${pxToRem(2)} ${pxToRem(2)} ${theme.colors.accentLight}`};
  gap: ${({ theme }) => theme.spacing[8]};
`;

interface AutoCompleteItemProps {
  name: string;
}

const AutoCompleteItem: React.FC<AutoCompleteItemProps> = ({ name }) => (
  <FlexBox p={8}>
    <Body>{name}</Body>
  </FlexBox>
);

export const ArtForm: React.FC<ArtFormProps> = ({
  onSubmit,
  formTitle,
  defaultValues,
}) => {
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [artistList, setArtistList] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchAutocompleteLists = async () => {
      const artistsResp = await fetch(ARTISTS_LIST_ROUTE, {
        method: 'GET',
      });
      const locationsResp = await fetch(LOCATION_LIST_ROUTE, {
        method: 'GET',
      });

      if (locationsResp.status === 200) {
        const locations: Location[] = await locationsResp.json();
        setLocationList(locations);
      }

      if (artistsResp.status === 200) {
        const artists: Artist[] = await artistsResp.json();
        setArtistList(artists);
      }
    };
    fetchAutocompleteLists();
  }, []);

  return (
    <Form onSubmit={onSubmit}>
      <Title>{formTitle}</Title>
      <AutoCompleteWrapper>
        <Input<ArtSubmitData>
          defaultValue={defaultValues?.artist}
          label="Artist"
          name="artist"
          required
          type="text"
        />
        <AutoComplete column>
          {artistList.map((a) => (
            <AutoCompleteItem name={a.name} />
          ))}
        </AutoComplete>
      </AutoCompleteWrapper>
      <Input<ArtSubmitData>
        defaultValue={defaultValues?.name}
        label="Artwork Name"
        name="name"
        required
        type="text"
      />
      <AutoCompleteWrapper>
        <Input<ArtSubmitData>
          defaultValue={defaultValues?.location}
          label="Location Seen"
          name="location"
          required
          type="text"
        />
      </AutoCompleteWrapper>
      <Input<ArtSubmitData>
        defaultValue={defaultValues?.dateSeen}
        label="Date Seen"
        name="dateSeen"
        required
        type="date"
      />
      <Input<ArtSubmitData>
        defaultValue={defaultValues?.imgSrc}
        label="Image Url"
        name="imgSrc"
        type="text"
      />
      <SubmitButton />
    </Form>
  );
};

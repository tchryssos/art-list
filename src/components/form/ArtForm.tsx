import { Artist, Location } from '@prisma/client';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { ARTISTS_LIST_ROUTE, LOCATION_LIST_ROUTE } from '~/constants/routing';
import { ArtSubmitData } from '~/typings/art';

import { SubmitButton } from '../buttons/SubmitButton';
import { Form } from './Form';
import { Input } from './Input';

interface ArtFormProps {
  defaultValues?: Partial<ArtSubmitData>;
  onSubmit: (e: FormEvent) => Promise<void> | void;
  readOnly?: boolean;
  token?: string;
}
export function ArtForm({
  onSubmit,
  defaultValues,
  readOnly,
  token: _token,
}: ArtFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationList, setLocationList] = useState<string[]>([]);
  const [artistList, setArtistList] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(_token || null);
  const [activeAutoComplete, setActiveAutoComplete] = useState<
    keyof ArtSubmitData | null
  >(null);

  // Probably not SUPER thorough, but good enough
  const isEditMode = defaultValues?.name !== undefined;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {}, []);

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
        setLocationList(locations.map((l) => l.name));
      }

      if (artistsResp.status === 200) {
        const artists: Artist[] = await artistsResp.json();
        setArtistList(artists.map((a) => a.name));
      }
    };
    fetchAutocompleteLists();
  }, []);

  const _onSubmit = async (e: FormEvent) => {
    if (readOnly) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <Form formRef={formRef} onSubmit={_onSubmit}>
      <Input<ArtSubmitData>
        autoCompleteActive={activeAutoComplete === 'artist'}
        autoCompleteList={artistList}
        defaultValue={defaultValues?.artist}
        label="Artist"
        name="artist"
        readOnly={readOnly}
        required
        type="text"
        onFocus={() => !readOnly && setActiveAutoComplete('artist')}
      />
      <Input<ArtSubmitData>
        defaultValue={defaultValues?.name}
        label="Artwork Name"
        name="name"
        readOnly={readOnly}
        required
        type="text"
        onFocus={() => !readOnly && setActiveAutoComplete(null)}
      />
      <Input<ArtSubmitData>
        autoCompleteActive={activeAutoComplete === 'location'}
        autoCompleteList={locationList}
        defaultValue={defaultValues?.location}
        label="Location Seen"
        name="location"
        readOnly={readOnly}
        required
        type="text"
        onFocus={() => !readOnly && setActiveAutoComplete('location')}
      />
      <Input<ArtSubmitData>
        defaultValue={defaultValues?.dateSeen}
        label="Date Seen"
        name="dateSeen"
        readOnly={readOnly}
        required
        type="date"
        onFocus={() => !readOnly && setActiveAutoComplete(null)}
      />
      <Input<ArtSubmitData>
        defaultValue={defaultValues?.imgSrc}
        label="Image Url"
        name="imgSrc"
        readOnly={readOnly}
        type="text"
        onFocus={() => !readOnly && setActiveAutoComplete(null)}
      />
      {!readOnly && <SubmitButton isSubmitting={isSubmitting} />}
    </Form>
  );
}

import { FormEvent } from 'react';

import { ArtSubmitData } from '~/typings/art';

import { SubmitButton } from '../buttons/SubmitButton';
import { Title } from '../typography/Title';
import { Form } from './Form';
import { Input } from './Input';

interface ArtFormProps {
  formTitle: string;
  defaultValues?: {
    artist?: string;
    name?: string;
    location?: string;
    date?: string;
    imgSrc?: string;
  };
  onSubmit: (e: FormEvent) => void;
}

export const ArtForm: React.FC<ArtFormProps> = ({
  onSubmit,
  formTitle,
  defaultValues,
}) => (
  <Form onSubmit={onSubmit}>
    <Title>{formTitle}</Title>
    <Input<ArtSubmitData>
      defaultValue={defaultValues?.artist}
      label="Artist"
      name="artist"
      required
      type="text"
    />
    <Input<ArtSubmitData>
      defaultValue={defaultValues?.name}
      label="Artwork Name"
      name="name"
      required
      type="text"
    />
    <Input<ArtSubmitData>
      defaultValue={defaultValues?.location}
      label="Location Seen"
      name="location"
      required
      type="text"
    />
    <Input<ArtSubmitData>
      defaultValue={defaultValues?.date}
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

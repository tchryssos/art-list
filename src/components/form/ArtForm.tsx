import { FormEvent } from 'react';

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
  isEditForm?: boolean;
}

export const ArtForm: React.FC<ArtFormProps> = ({
  onSubmit,
  isEditForm,
  formTitle,
  defaultValues,
}) => (
  <Form onSubmit={onSubmit}>
    <Title>{formTitle}</Title>
    <Input
      defaultValue={defaultValues?.artist}
      label="Artist"
      name="artist"
      required
      type="text"
    />
    <Input
      defaultValue={defaultValues?.name}
      label="Artwork Name"
      name="name"
      required
      type="text"
    />
    <Input
      defaultValue={defaultValues?.location}
      label="Location Seen"
      name="location"
      required
      type="text"
    />
    <Input
      defaultValue={defaultValues?.date}
      label="Date Seen"
      name="date"
      required
      type="date"
    />
    {isEditForm && (
      <Input
        defaultValue={defaultValues?.imgSrc}
        label="Image Url"
        name="imgSrc"
        type="text"
      />
    )}
    <SubmitButton />
  </Form>
);

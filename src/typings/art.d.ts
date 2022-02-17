import { Art } from '@prisma/client';

export type TEMPart = {
  artist: string;
  name: string;
  date: string;
  location: string;
  imgSrc: string;
};

export type ArtCreateData = {
  [K in keyof Pick<Art, 'name' | 'dateSeen'>]: string;
} & {
  location: string;
  artist: string;
};

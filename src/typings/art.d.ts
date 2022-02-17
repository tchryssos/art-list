import { Art } from '@prisma/client';

export type TEMPart = {
  artist: string;
  name: string;
  date: string;
  location: string;
  imgSrc: string;
};

export type ArtistSubmitData = {
  location: string;
  artist: string;
  name: string;
  dateSeen: string;
  url?: string;
};

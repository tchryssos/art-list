import { Art, Artist, Location } from '@prisma/client';

export type TEMPart = {
  artist: string;
  name: string;
  date: string;
  location: string;
  imgSrc: string;
};

export type ArtSubmitData = {
  location: string;
  artist: string;
  name: string;
  dateSeen: string;
  imgSrc?: string;
};

export type CompleteArt = Omit<Art, 'dateSeen'> & {
  Artist: Artist;
  Location: Location;
  dateSeen: string;
};

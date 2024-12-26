import { Art, Artist, ListeningTo, Location } from '@prisma/client';

export type ArtSubmitData = {
  location: string;
  artist: string;
  name: string;
  dateSeen: string;
  imgSrc?: string;
  listeningTo?: Omit<ListeningTo, 'id' | 'createdOn' | 'art'>;
};

export type CompleteArt = Art & {
  Artist: Artist;
  Location: Location;
};

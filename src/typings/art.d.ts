import { Art, Artist, Location } from '@prisma/client';

export type ArtSubmitData = {
  location: string;
  artist: string;
  name: string;
  dateSeen: string;
  imgSrc?: string;
};

export type CompleteArt = Art & {
  Artist: Artist;
  Location: Location;
};

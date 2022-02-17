export const HOME_ROUTE = '/';

export const LIST_ROUTE = '/list';

type DetailRouteId = `${number}` | 'new';

export const createArtDetailRoute = (id: DetailRouteId) => `/art/${id}`;

export const createArtistDetailRoute = (id: DetailRouteId) => `/artist/${id}`;
export const NEW_ARTIST_ROUTE = createArtistDetailRoute('new');

export const createLocationDetailRoute = (id: DetailRouteId) =>
  `/location/${id}`;
export const NEW_LOCATION_ROUTE = createLocationDetailRoute('new');

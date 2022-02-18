// CLIENT ROUTES
export const HOME_ROUTE = '/';

export const LIST_ROUTE = '/list';

type DetailRouteId = `${number}` | 'new';

export const createArtDetailRoute = (id: DetailRouteId) => `/art/${id}`;

export const createArtistDetailRoute = (id: DetailRouteId) => `/artists/${id}`;

export const createLocationDetailRoute = (id: DetailRouteId) =>
  `/locations/${id}`;

// API ROUTES
export const ART_CREATE_ROUTE = '/api/art/new/create';
export const ART_LIST_ROUTE = '/api/art';
export const createArtApiRoute = (id: DetailRouteId) =>
  `/api${createArtDetailRoute(id)}`;
export const ARTISTS_LIST_ROUTE = '/api/artists';
export const LOCATION_LIST_ROUTE = '/api/locations';

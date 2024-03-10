// CLIENT ROUTES
export const HOME_ROUTE = '/';

export const ART_ADD_ROUTE = '/art/add';

type DetailRouteId = `${number}` | 'new';

export const createArtDetailRoute = (id: DetailRouteId) => `/art/view/${id}`;
export const ART_DETAIL_ROUTE_PATTERN = createArtDetailRoute(
  '[id]' as DetailRouteId
);
export const createArtistDetailRoute = (id: DetailRouteId) => `/artists/${id}`;
export const ARTIST_DETAIL_ROUTE_PATTERN = createArtistDetailRoute(
  '[id]' as DetailRouteId
);

export const createLocationDetailRoute = (id: DetailRouteId) =>
  `/locations/${id}`;
export const LOCATION_DETAIL_ROUTE_PATTERN = createLocationDetailRoute(
  '[id]' as DetailRouteId
);

// API ROUTES
export const ART_CREATE_ROUTE = '/api/art/new/create';
export const ART_LIST_ROUTE = '/api/art';
export const createArtApiRoute = (id: DetailRouteId) => `/api/art/${id}`;
export const ARTISTS_LIST_ROUTE = '/api/artists';
export const LOCATION_LIST_ROUTE = '/api/locations';
export const AUTH_ROUTE = '/api/authorize';

export const AUTH_ROUTE_PATTERNS = [
  ART_ADD_ROUTE,
  ART_DETAIL_ROUTE_PATTERN,
  ARTIST_DETAIL_ROUTE_PATTERN,
  LOCATION_DETAIL_ROUTE_PATTERN,
];

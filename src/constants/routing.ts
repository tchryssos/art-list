/* eslint-disable camelcase */
// CLIENT ROUTES
export const HOME_ROUTE = '/';
export const LOGIN_ROUTE = '/login';

export const ART_ADD_ROUTE = '/art/add';

type DetailRouteId = string;

export const createArtDetailRoute = (id: DetailRouteId) => `/art/view/${id}`;
const ART_DETAIL_ROUTE_PATTERN = createArtDetailRoute('[id]' as DetailRouteId);
const createArtistDetailRoute = (id: DetailRouteId) => `/artists/${id}`;
const ARTIST_DETAIL_ROUTE_PATTERN = createArtistDetailRoute(
  '[id]' as DetailRouteId
);

const createLocationDetailRoute = (id: DetailRouteId) => `/locations/${id}`;
const LOCATION_DETAIL_ROUTE_PATTERN = createLocationDetailRoute(
  '[id]' as DetailRouteId
);

interface CreateSpotifyOauthRouteArgs {
  redirect_uri: string;
  state: string;
  client_id: string;
}

export const createSpotifyOauthRoute = ({
  redirect_uri,
  state,
  client_id,
}: CreateSpotifyOauthRouteArgs) =>
  `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id,
    redirect_uri,
    scope: 'user-read-currently-playing',
    state,
    response_type: 'code',
  }).toString()}`;

export const getSpotifyRedirectUri = (origin?: string) => {
  const { window } = globalThis;
  const _origin = origin || window?.location.origin;
  if (_origin) {
    return `${_origin}${ART_ADD_ROUTE}`;
  }
  return '';
};

// API ROUTES
export const ART_CREATE_ROUTE = '/api/art/new/create';
export const createArtApiRoute = (id: DetailRouteId) => `/api/art/${id}`;
export const ARTISTS_LIST_ROUTE = '/api/artists';
export const LOCATION_LIST_ROUTE = '/api/locations';
export const AUTH_ROUTE = '/api/authorize';
export const AUTH_ME_ROUTE = '/api/authorize/me';
export const NOW_PLAYING_ROUTE = '/api/listening-to';

export const AUTH_ROUTE_PATTERNS = [
  ART_ADD_ROUTE,
  ART_DETAIL_ROUTE_PATTERN,
  ARTIST_DETAIL_ROUTE_PATTERN,
  LOCATION_DETAIL_ROUTE_PATTERN,
];

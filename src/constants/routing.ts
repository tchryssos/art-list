/* eslint-disable camelcase */
import { getUnsafeRandomString } from '~/logic/util/getUnsafeRandomString';

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
  client_id: string;
  redirect_uri: string;
}

export const createSpotifyOauthRoute = ({
  client_id,
  redirect_uri,
}: CreateSpotifyOauthRouteArgs) =>
  `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id,
    redirect_uri,
    scope: 'user-read-currently-playing',
    state: getUnsafeRandomString(16),
  }).toString()}`;

// API ROUTES
export const ART_CREATE_ROUTE = '/api/art/new/create';
export const createArtApiRoute = (id: DetailRouteId) => `/api/art/${id}`;
export const ARTISTS_LIST_ROUTE = '/api/artists';
export const LOCATION_LIST_ROUTE = '/api/locations';
export const AUTH_ROUTE = '/api/authorize';
export const AUTH_ME_ROUTE = '/api/authorize/me';

export const AUTH_ROUTE_PATTERNS = [
  ART_ADD_ROUTE,
  ART_DETAIL_ROUTE_PATTERN,
  ARTIST_DETAIL_ROUTE_PATTERN,
  LOCATION_DETAIL_ROUTE_PATTERN,
];

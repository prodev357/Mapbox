import type { Route, LngLat } from '@/types';
import type { Waypoint, RouteSpec } from '@/data/waypoints';
import { CONFIG } from '@/data/config';

const DIRECTIONS_BASE = 'https://api.mapbox.com/directions/v5/mapbox/driving';
const CACHE_VERSION = 'v2';

function cacheKey(id: string): string {
  const [lng, lat] = CONFIG.map.center;
  return `gaeca_route_${CACHE_VERSION}_${id}_${lng}_${lat}`;
}

function readCache(id: string): Route | null {
  try {
    const raw = localStorage.getItem(cacheKey(id));
    if (!raw) return null;
    return JSON.parse(raw) as Route;
  } catch {
    return null;
  }
}

function writeCache(id: string, route: Route): void {
  try {
    localStorage.setItem(cacheKey(id), JSON.stringify(route));
  } catch {
    // localStorage full — skip caching silently
  }
}

/** Straight-line fallback using raw waypoints (no API call). */
function waypointFallback(waypoints: Waypoint[]): Route {
  return waypoints as LngLat[];
}

export type RouteStatus = 'pending' | 'cached' | 'fetching' | 'done' | 'error';

export interface FetchResult {
  id: string;
  route: Route;
  fromCache: boolean;
}

/**
 * Fetch a single route. Returns cached result immediately if available,
 * otherwise calls the Mapbox Directions API.
 */
export async function fetchRoute(
  spec: RouteSpec,
  token: string,
  onStatus: (id: string, status: RouteStatus) => void,
): Promise<FetchResult> {
  const { id, waypoints } = spec;

  // Cache hit — instant
  const cached = readCache(id);
  if (cached) {
    onStatus(id, 'cached');
    return { id, route: cached, fromCache: true };
  }

  onStatus(id, 'fetching');

  const coords = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const url =
    `${DIRECTIONS_BASE}/${coords}` +
    `?geometries=geojson&overview=full&access_token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json() as {
      routes?: Array<{ geometry: { coordinates: [number, number][] } }>;
    };

    const coords2 = data.routes?.[0]?.geometry?.coordinates;
    if (!coords2?.length) throw new Error('Empty route response');

    const route = coords2 as Route;
    writeCache(id, route);
    onStatus(id, 'done');
    return { id, route, fromCache: false };
  } catch {
    // Graceful degradation — use straight-line waypoints
    const fallback = waypointFallback(waypoints);
    onStatus(id, 'error');
    return { id, route: fallback, fromCache: false };
  }
}

/**
 * Fetch all routes in parallel. Cached routes resolve instantly;
 * uncached routes are fetched concurrently (one API call each).
 */
export async function fetchAllRoutes(
  specs: RouteSpec[],
  token: string,
  onStatus: (id: string, status: RouteStatus) => void,
): Promise<Map<string, Route>> {
  const results = await Promise.all(
    specs.map((spec) => fetchRoute(spec, token, onStatus)),
  );

  const map = new Map<string, Route>();
  for (const { id, route } of results) {
    map.set(id, route);
  }
  return map;
}

/** Clear all cached routes (e.g. if map center changes). */
export function clearRouteCache(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('gaeca_route_')) keysToRemove.push(k);
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

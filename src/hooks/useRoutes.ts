import { useState, useEffect, useCallback } from 'react';
import type { Route } from '@/types';
import { ROUTE_SPECS, EV_ROUTE_SPEC } from '@/data/waypoints';
import { fetchAllRoutes, type RouteStatus } from '@/services/directionsService';

const ALL_SPECS = [...ROUTE_SPECS, EV_ROUTE_SPEC];
const TOTAL = ALL_SPECS.length;

export interface RouteState {
  id: string;
  status: RouteStatus;
}

export interface UseRoutesResult {
  regularRoutes: Route[] | null;
  evRoute: Route | null;
  loading: boolean;
  routeStates: RouteState[];
  doneCount: number;
  total: number;
  retry: () => void;
}

export function useRoutes(token: string): UseRoutesResult {
  const [regularRoutes, setRegularRoutes] = useState<Route[] | null>(null);
  const [evRoute, setEvRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeStates, setRouteStates] = useState<RouteState[]>(
    ALL_SPECS.map((s) => ({ id: s.id, status: 'pending' as RouteStatus })),
  );

  const load = useCallback(() => {
    setLoading(true);
    setRegularRoutes(null);
    setEvRoute(null);
    setRouteStates(ALL_SPECS.map((s) => ({ id: s.id, status: 'pending' })));

    const onStatus = (id: string, status: RouteStatus) => {
      setRouteStates((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    };

    fetchAllRoutes(ALL_SPECS, token, onStatus).then((routeMap) => {
      const regular = ROUTE_SPECS.map((s) => routeMap.get(s.id)!);
      const ev = routeMap.get(EV_ROUTE_SPEC.id)!;
      setRegularRoutes(regular);
      setEvRoute(ev);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const doneCount = routeStates.filter(
    (r) => r.status === 'cached' || r.status === 'done' || r.status === 'error',
  ).length;

  return {
    regularRoutes,
    evRoute,
    loading,
    routeStates,
    doneCount,
    total: TOTAL,
    retry: load,
  };
}

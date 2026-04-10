import { create } from 'zustand';
import length from '@turf/length';
import { lineString } from '@turf/helpers';
import type { Map as MapboxMap } from 'mapbox-gl';
import type { SimulationState, RegularVehicle, EmergencyVehicle, Route } from '@/types';
import { CONFIG } from '@/data/config';
import { getPositionOnRoute, getHeading } from '@/simulation/routeEngine';

export function buildInitialVehicles(routes: Route[]): RegularVehicle[] {
  return routes.map((route, i) => {
    const routeLength = length(lineString(route as [number, number][]));
    const position = getPositionOnRoute(route, routeLength, 0);
    const heading = getHeading(route, routeLength, 0);
    return {
      id: `v-${i + 1}`,
      route,
      routeLength,
      distanceTravelled: 0,
      position,
      heading,
      state: 'normal' as const,
      originalPosition: position,
      clearedPosition: position,
      lerpFactor: 0,
    };
  });
}

export function buildInitialEV(route: Route): EmergencyVehicle {
  const routeLength = length(lineString(route as [number, number][]));
  const position = getPositionOnRoute(route, routeLength, 0);
  const heading = getHeading(route, routeLength, 0);
  return {
    id: 'ev-1',
    route,
    routeLength,
    distanceTravelled: 0,
    position,
    heading,
    triggerRadius: CONFIG.simulation.triggerRadiusMetres,
  };
}

// Animation loop refs — stored outside React
let _startLoop: ((map: MapboxMap) => void) | null = null;
let _stopLoop: (() => void) | null = null;
let _populateSources: ((map: MapboxMap) => void) | null = null;

export function registerLoopHandlers(
  start: (map: MapboxMap) => void,
  stop: () => void,
  populate: (map: MapboxMap) => void,
) {
  _startLoop = start;
  _stopLoop = stop;
  _populateSources = populate;
}

let _mapRef: MapboxMap | null = null;
export function setMapRef(map: MapboxMap | null) {
  _mapRef = map;
}

// Placeholder initial state — replaced by initSimulation() once routes load
const PLACEHOLDER_VEHICLE: RegularVehicle = {
  id: 'placeholder',
  route: [CONFIG.map.center, CONFIG.map.center],
  routeLength: 0.001,
  distanceTravelled: 0,
  position: CONFIG.map.center,
  heading: 0,
  state: 'normal',
  originalPosition: CONFIG.map.center,
  clearedPosition: CONFIG.map.center,
  lerpFactor: 0,
};

const PLACEHOLDER_EV: EmergencyVehicle = {
  id: 'ev-1',
  route: [CONFIG.map.center, CONFIG.map.center],
  routeLength: 0.001,
  distanceTravelled: 0,
  position: CONFIG.map.center,
  heading: 0,
  triggerRadius: CONFIG.simulation.triggerRadiusMetres,
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  status: 'idle',
  vehicles: [PLACEHOLDER_VEHICLE],
  emergencyVehicle: PLACEHOLDER_EV,
  vehicleSpeedKmh: CONFIG.simulation.vehicleSpeedKmh,
  evSpeedKmh: CONFIG.simulation.evSpeedKmh,

  start: () => {
    set({ status: 'running' });
    if (_mapRef && _startLoop) _startLoop(_mapRef);
  },

  pause: () => {
    set({ status: 'paused' });
    if (_stopLoop) _stopLoop();
  },

  reset: () => {
    if (_stopLoop) _stopLoop();
    // Rebuild from current routes (already stored in vehicles)
    const { vehicles, emergencyVehicle } = get();
    const resetVehicles = buildInitialVehicles(vehicles.map((v) => v.route));
    const resetEV = buildInitialEV(emergencyVehicle.route);
    set({ status: 'idle', vehicles: resetVehicles, emergencyVehicle: resetEV });
    if (_mapRef && _populateSources) _populateSources(_mapRef);
  },

  updateVehicles: (vehicles: RegularVehicle[], ev: EmergencyVehicle) => {
    set({ vehicles, emergencyVehicle: ev });
  },

  setVehicleSpeed: (kmh: number) => set({ vehicleSpeedKmh: kmh }),
  setEvSpeed: (kmh: number) => set({ evSpeedKmh: kmh }),
}));

/** Called once routes are loaded. Replaces placeholder state. */
export function initSimulation(regularRoutes: Route[], evRoute: Route): void {
  const vehicles = buildInitialVehicles(regularRoutes);
  const emergencyVehicle = buildInitialEV(evRoute);
  useSimulationStore.setState({ status: 'idle', vehicles, emergencyVehicle });
  if (_mapRef && _populateSources) _populateSources(_mapRef);
}

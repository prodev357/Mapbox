import type { LngLat } from '@/types';

export const CONFIG = {
  map: {
    center: [-73.985, 40.748] as LngLat,
    zoom: 15,
    style: 'mapbox://styles/mapbox/streets-v12',
  },
  simulation: {
    triggerRadiusMetres: 75,
    vehicleSpeedKmh: 30,
    evSpeedKmh: 70,
    clearAnimationDurationMs: 1000,
    vehicleCount: 7,
  },
} as const;

import { point } from '@turf/helpers';
import destination from '@turf/destination';
import type { LngLat } from '@/types';
import { CONFIG } from '@/data/config';

export function computeClearedPosition(position: LngLat, heading: number): LngLat {
  const pt = point(position as [number, number]);
  const dest = destination(pt, 0.005, (heading + 90) % 360);
  return dest.geometry.coordinates as LngLat;
}

export function advanceLerpFactor(
  current: number,
  deltaMs: number,
  direction: 'clear' | 'return',
): number {
  const delta = deltaMs / CONFIG.simulation.clearAnimationDurationMs;
  if (direction === 'clear') {
    return Math.min(1, current + delta);
  } else {
    return Math.max(0, current - delta);
  }
}

export function interpolateLngLat(original: LngLat, cleared: LngLat, t: number): LngLat {
  return [
    original[0] + (cleared[0] - original[0]) * t,
    original[1] + (cleared[1] - original[1]) * t,
  ];
}

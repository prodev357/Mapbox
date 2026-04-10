import type { Map as MapboxMap } from 'mapbox-gl';
import { GeoJSONSource } from 'mapbox-gl';
import { point } from '@turf/helpers';
import destination from '@turf/destination';
import type { RegularVehicle, EmergencyVehicle, VehiclesGeoJSON } from '@/types';
import { useSimulationStore } from '@/store/simulationStore';
import { advanceVehicle, advanceEmergencyVehicle } from '@/simulation/routeEngine';
import { getVehiclesInRadius } from '@/simulation/proximityDetection';
import {
  computeClearedPosition,
  advanceLerpFactor,
  interpolateLngLat,
} from '@/simulation/clearanceAnimation';

let rafId: number | null = null;
let lastTimestamp: number | null = null;

// Module-level state — avoids per-frame store writes (T026)
let liveVehicles: RegularVehicle[] = [];
let liveEV: EmergencyVehicle | null = null;

// ─── GeoJSON builders ────────────────────────────────────────────────────────

function buildVehiclesGeoJSON(
  vehicles: RegularVehicle[],
  ev: EmergencyVehicle,
  vehicleSpeedKmh: number,
  evSpeedKmh: number,
): VehiclesGeoJSON {
  const features: VehiclesGeoJSON['features'] = vehicles.map((v) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: v.position as [number, number] },
    properties: { id: v.id, state: v.state, heading: v.heading, speed: vehicleSpeedKmh },
  }));

  features.push({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: ev.position as [number, number] },
    properties: { id: ev.id, state: 'emergency', heading: ev.heading, speed: evSpeedKmh },
  });

  return { type: 'FeatureCollection', features };
}

function buildRadiusGeoJSON(ev: EmergencyVehicle): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
  const center = point(ev.position as [number, number]);
  const radiusKm = ev.triggerRadius / 1000;
  const coords: [number, number][] = [];

  for (let i = 0; i <= 32; i++) {
    const pt = destination(center, radiusKm, (i / 32) * 360);
    coords.push(pt.geometry.coordinates as [number, number]);
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: {},
      },
    ],
  };
}

// ─── Vehicle processing ───────────────────────────────────────────────────────

function processVehicles(
  vehicles: RegularVehicle[],
  ev: EmergencyVehicle,
  deltaMs: number,
  speedKmh: number,
): RegularVehicle[] {
  const inRadius = getVehiclesInRadius(vehicles, ev);

  return vehicles.map((v) => {
    // 1. Always advance along route
    let updated = advanceVehicle(v, deltaMs, speedKmh);

    // 2. Always track route position — avoids position jump when return completes
    updated = { ...updated, originalPosition: updated.position };

    // 3. Recompute the target shifted position from current route pos + heading
    //    This keeps the offset anchored to the vehicle's current road position
    const clearedPos = computeClearedPosition(updated.originalPosition, updated.heading);

    const isInRadius = inRadius.has(v.id);

    if (v.state === 'normal') {
      if (isInRadius) {
        // Enter clearing
        const newLerp = advanceLerpFactor(0, deltaMs, 'clear');
        updated = {
          ...updated,
          state: 'clearing',
          clearedPosition: clearedPos,
          lerpFactor: newLerp,
          position: interpolateLngLat(updated.originalPosition, clearedPos, newLerp),
        };
      }
      // else: position stays at route position (lerpFactor = 0)
    } else if (v.state === 'clearing') {
      if (isInRadius) {
        // Continue shifting right
        const newLerp = advanceLerpFactor(v.lerpFactor, deltaMs, 'clear');
        updated = {
          ...updated,
          clearedPosition: clearedPos,
          lerpFactor: newLerp,
          position: interpolateLngLat(updated.originalPosition, clearedPos, newLerp),
        };
      } else {
        // EV left — start returning
        const newLerp = advanceLerpFactor(v.lerpFactor, deltaMs, 'return');
        updated = {
          ...updated,
          state: newLerp <= 0 ? 'normal' : 'returning',
          clearedPosition: clearedPos,
          lerpFactor: newLerp,
          position: interpolateLngLat(updated.originalPosition, clearedPos, newLerp),
        };
      }
    } else if (v.state === 'returning') {
      const newLerp = advanceLerpFactor(v.lerpFactor, deltaMs, 'return');
      const nextState = newLerp <= 0 ? 'normal' : 'returning';
      updated = {
        ...updated,
        state: nextState,
        clearedPosition: clearedPos,
        lerpFactor: newLerp,
        position: interpolateLngLat(updated.originalPosition, clearedPos, newLerp),
      };

      // Returned but EV still present — re-enter clearing
      if (nextState === 'normal' && isInRadius) {
        updated = { ...updated, state: 'clearing', lerpFactor: 0 };
      }
    }

    return updated;
  });
}

// ─── Loop control ─────────────────────────────────────────────────────────────

export function startLoop(map: MapboxMap): void {
  if (rafId !== null) return;
  lastTimestamp = null;

  // Seed live state from store (handles resume-after-pause)
  const stored = useSimulationStore.getState();
  liveVehicles = stored.vehicles;
  liveEV = stored.emergencyVehicle;

  function frame(timestamp: number) {
    const { status } = useSimulationStore.getState();

    if (status !== 'running') {
      rafId = null;
      return;
    }

    const deltaMs = lastTimestamp !== null ? Math.min(timestamp - lastTimestamp, 100) : 16;
    lastTimestamp = timestamp;

    const { vehicleSpeedKmh, evSpeedKmh } = useSimulationStore.getState();
    liveEV = advanceEmergencyVehicle(liveEV!, deltaMs, evSpeedKmh);
    liveVehicles = processVehicles(liveVehicles, liveEV, deltaMs, vehicleSpeedKmh);

    const vehicleSource = map.getSource('vehicles') as GeoJSONSource | undefined;
    if (vehicleSource) {
      vehicleSource.setData(buildVehiclesGeoJSON(liveVehicles, liveEV, vehicleSpeedKmh, evSpeedKmh));
    }

    const radiusSource = map.getSource('ev-radius') as GeoJSONSource | undefined;
    if (radiusSource) {
      radiusSource.setData(buildRadiusGeoJSON(liveEV));
    }

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
}

export function stopLoop(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lastTimestamp = null;

  // Sync live state back to store so resume picks up from exact position
  if (liveEV !== null) {
    useSimulationStore.getState().updateVehicles(liveVehicles, liveEV);
  }
}

// Push current store state to Mapbox sources without starting the loop.
// Used on map load (initial render) and after reset.
export function populateSources(map: MapboxMap): void {
  const { vehicles, emergencyVehicle, vehicleSpeedKmh, evSpeedKmh } = useSimulationStore.getState();

  // Also reset live state so next startLoop picks up from initial positions
  liveVehicles = vehicles;
  liveEV = emergencyVehicle;

  const vehicleSource = map.getSource('vehicles') as GeoJSONSource | undefined;
  if (vehicleSource) {
    vehicleSource.setData(buildVehiclesGeoJSON(vehicles, emergencyVehicle, vehicleSpeedKmh, evSpeedKmh));
  }

  const radiusSource = map.getSource('ev-radius') as GeoJSONSource | undefined;
  if (radiusSource) {
    radiusSource.setData({ type: 'FeatureCollection', features: [] });
  }
}

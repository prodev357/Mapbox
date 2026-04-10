import along from '@turf/along';
import length from '@turf/length';
import bearing from '@turf/bearing';
import destination from '@turf/destination';
import { lineString, point } from '@turf/helpers';
import type { LngLat, Route, RegularVehicle, EmergencyVehicle } from '@/types';

export function getRouteLength(route: Route): number {
  return length(lineString(route as [number, number][]));
}

export function getPositionOnRoute(route: Route, routeLength: number, distanceTravelled: number): LngLat {
  const d = ((distanceTravelled % routeLength) + routeLength) % routeLength;
  const pt = along(lineString(route as [number, number][]), d);
  return pt.geometry.coordinates as LngLat;
}

export function getHeading(route: Route, routeLength: number, distanceTravelled: number): number {
  const d = ((distanceTravelled % routeLength) + routeLength) % routeLength;
  // Look ahead 0.001 km (1m) for bearing
  const lookAhead = Math.min(d + 0.001, routeLength - 0.0001);
  const from = along(lineString(route as [number, number][]), d);
  const to = along(lineString(route as [number, number][]), lookAhead);
  const b = bearing(from, to);
  // bearing returns -180 to 180; normalize to 0-360
  return (b + 360) % 360;
}

export function advanceVehicle(vehicle: RegularVehicle, deltaMs: number, speedKmh: number): RegularVehicle {
  const distanceDelta = (speedKmh / 3600) * (deltaMs / 1000);
  let newDistance = vehicle.distanceTravelled + distanceDelta;

  // Loop the route
  newDistance = newDistance % vehicle.routeLength;

  const newPosition = getPositionOnRoute(vehicle.route, vehicle.routeLength, newDistance);
  const newHeading = getHeading(vehicle.route, vehicle.routeLength, newDistance);

  return {
    ...vehicle,
    distanceTravelled: newDistance,
    position: newPosition,
    heading: newHeading,
  };
}

export function advanceEmergencyVehicle(ev: EmergencyVehicle, deltaMs: number, speedKmh: number): EmergencyVehicle {
  const distanceDelta = (speedKmh / 3600) * (deltaMs / 1000);
  let newDistance = ev.distanceTravelled + distanceDelta;

  // Teleport to start when end is reached
  if (newDistance >= ev.routeLength) {
    newDistance = 0;
  }

  const newPosition = getPositionOnRoute(ev.route, ev.routeLength, newDistance);
  const newHeading = getHeading(ev.route, ev.routeLength, newDistance);

  return {
    ...ev,
    distanceTravelled: newDistance,
    position: newPosition,
    heading: newHeading,
  };
}

// Compute the rightward-shifted cleared position
export function computeClearedPosition(position: LngLat, heading: number): LngLat {
  const pt = point(position as [number, number]);
  const dest = destination(pt, 0.005, (heading + 90) % 360);
  return dest.geometry.coordinates as LngLat;
}

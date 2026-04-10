import distance from '@turf/distance';
import { point } from '@turf/helpers';
import type { RegularVehicle, EmergencyVehicle } from '@/types';

export function getVehiclesInRadius(
  vehicles: RegularVehicle[],
  ev: EmergencyVehicle,
): Set<string> {
  const evPoint = point(ev.position as [number, number]);
  const triggerKm = ev.triggerRadius / 1000;
  const result = new Set<string>();

  for (const v of vehicles) {
    const vPoint = point(v.position as [number, number]);
    const dist = distance(evPoint, vPoint); // km
    if (dist <= triggerKm) {
      result.add(v.id);
    }
  }

  return result;
}

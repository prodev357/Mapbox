// A geographic coordinate [longitude, latitude]
export type LngLat = [number, number];

// A polyline route as an ordered array of coordinates
export type Route = LngLat[];

export type VehicleState = 'normal' | 'clearing' | 'returning';

export interface RegularVehicle {
  id: string;
  route: Route;
  routeLength: number;
  distanceTravelled: number;
  position: LngLat;
  heading: number;
  state: VehicleState;
  originalPosition: LngLat;
  clearedPosition: LngLat;
  lerpFactor: number;
}

export interface EmergencyVehicle {
  id: string;
  route: Route;
  routeLength: number;
  distanceTravelled: number;
  position: LngLat;
  heading: number;
  triggerRadius: number;
}

export type SimulationStatus = 'idle' | 'running' | 'paused';

export interface SimulationState {
  status: SimulationStatus;
  vehicles: RegularVehicle[];
  emergencyVehicle: EmergencyVehicle;
  vehicleSpeedKmh: number;
  evSpeedKmh: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  updateVehicles: (vehicles: RegularVehicle[], ev: EmergencyVehicle) => void;
  setVehicleSpeed: (kmh: number) => void;
  setEvSpeed: (kmh: number) => void;
}

export interface VehicleFeatureProps {
  id: string;
  state: VehicleState | 'emergency';
  heading: number;
  speed: number;
}

export type VehiclesGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Point, VehicleFeatureProps>;

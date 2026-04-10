/**
 * Key intersection waypoints per route.
 * The Directions API routes between these, returning a detailed polyline
 * that follows actual street geometry. Closing the loop requires repeating
 * the first waypoint as the last.
 *
 * Calibrated to Midtown Manhattan using the Empire State Building
 * (-73.9857, 40.7484) = 5th Ave & 34th St as the reference point.
 *
 * Avenue longitudes (~34th St):
 *   8th Ave  ≈ -73.995   (northbound)
 *   7th Ave  ≈ -73.992   (southbound)
 *   6th Ave  ≈ -73.989   (northbound) ← EV corridor
 *   5th Ave  ≈ -73.986   (southbound)
 *   Madison  ≈ -73.983   (northbound)
 *
 * Street latitudes:
 *   ~30th    ≈ 40.745
 *   ~32nd    ≈ 40.747
 *   ~34th    ≈ 40.748   ← map centre
 *   ~36th    ≈ 40.750
 *   ~38th    ≈ 40.752
 *   ~40th    ≈ 40.754
 *   ~42nd    ≈ 40.755
 */

export type Waypoint = [number, number]; // [lng, lat]

export interface RouteSpec {
  id: string;
  waypoints: Waypoint[];
}

export const ROUTE_SPECS: RouteSpec[] = [
  {
    // R1 — 8th Ave north (30th→38th), east on 38th, south on 7th, west on 30th
    id: 'r1',
    waypoints: [
      [-73.995, 40.745],
      [-73.995, 40.750],
      [-73.995, 40.752],
      [-73.992, 40.752],
      [-73.992, 40.750],
      [-73.992, 40.745],
      [-73.995, 40.745],
    ],
  },
  {
    // R2 — Madison Ave north (32nd→42nd), west on 42nd, south on 6th, east on 32nd
    id: 'r2',
    waypoints: [
      [-73.983, 40.747],
      [-73.983, 40.752],
      [-73.983, 40.755],
      [-73.989, 40.755],
      [-73.989, 40.752],
      [-73.989, 40.747],
      [-73.983, 40.747],
    ],
  },
  {
    // R3 — 36th St west (Madison→8th), north on 8th, east on 38th, south on Madison
    id: 'r3',
    waypoints: [
      [-73.983, 40.750],
      [-73.989, 40.750],
      [-73.992, 40.750],
      [-73.995, 40.750],
      [-73.995, 40.752],
      [-73.992, 40.752],
      [-73.989, 40.752],
      [-73.983, 40.752],
      [-73.983, 40.750],
    ],
  },
  {
    // R4 — 5th Ave north (34th→40th), west on 40th, south on 6th, east on 34th
    id: 'r4',
    waypoints: [
      [-73.986, 40.748],
      [-73.986, 40.752],
      [-73.986, 40.754],
      [-73.989, 40.754],
      [-73.989, 40.752],
      [-73.989, 40.748],
      [-73.986, 40.748],
    ],
  },
  {
    // R5 — Large outer perimeter: 8th Ave north, 42nd east, Madison south, 30th west
    id: 'r5',
    waypoints: [
      [-73.995, 40.745],
      [-73.995, 40.752],
      [-73.995, 40.755],
      [-73.989, 40.755],
      [-73.983, 40.755],
      [-73.983, 40.750],
      [-73.983, 40.745],
      [-73.989, 40.745],
      [-73.995, 40.745],
    ],
  },
  {
    // R6 — 34th St west (5th→8th), north on 8th, east on 36th, south on 5th
    id: 'r6',
    waypoints: [
      [-73.986, 40.748],
      [-73.989, 40.748],
      [-73.992, 40.748],
      [-73.995, 40.748],
      [-73.995, 40.750],
      [-73.992, 40.750],
      [-73.989, 40.750],
      [-73.986, 40.750],
      [-73.986, 40.748],
    ],
  },
  {
    // R7 — 6th Ave north (32nd→38th), east on 38th, south on Madison, west on 32nd
    id: 'r7',
    waypoints: [
      [-73.989, 40.747],
      [-73.989, 40.750],
      [-73.989, 40.752],
      [-73.983, 40.752],
      [-73.983, 40.750],
      [-73.983, 40.747],
      [-73.989, 40.747],
    ],
  },
];

export const EV_ROUTE_SPEC: RouteSpec = {
  // Emergency vehicle — straight north on 6th Ave (northbound one-way)
  id: 'ev',
  waypoints: [
    [-73.989, 40.740],
    [-73.989, 40.748],
    [-73.989, 40.755],
  ],
};

📍 Project: GAECA Clearance Engine MVP (Simulation)

Objective: Build a lightweight, visual MVP that simulates emergency vehicle approach and dynamic lane-clearing behavior on a real-time map. Fully mocked data, no AI/ML, no live APIs. Focus on smooth animation, clear logic, and demo-ready presentation.

---

## ✅ Implementation Status

All three milestones are complete and running.

---

📦 Milestone 1: Map Setup & Vehicle Simulation — DONE

Scope: Core map rendering + simulated traffic movement

Deliverables:
✅ Mapbox GL JS integration in React (react-map-gl v7, mapbox-gl v3)
✅ Map centered on Midtown Manhattan, New York (5th Ave & 34th St, zoom 15)
✅ 7 regular vehicles + 1 emergency vehicle moving along real street routes
✅ Smooth, continuous animation loop at ~60fps via requestAnimationFrame

Technical implementation:
- Routes fetched from Mapbox Directions API (mapbox/driving profile) on first load,
  then cached permanently in localStorage — zero API calls on subsequent loads
- Each route defined by 4–8 key intersection waypoints (src/data/waypoints.ts);
  the API returns a detailed street-following polyline stored in cache
- Vehicle position computed via @turf/along (distance accumulator along LineString)
- Heading computed via @turf/bearing with 1m look-ahead to avoid waypoint discontinuities
- Animation loop runs outside React (no per-frame re-renders); Mapbox GeoJSON source
  updated imperatively each frame via map.getSource('vehicles').setData()
- Custom top-down car icons drawn on offscreen <canvas> using Canvas 2D API,
  converted to raw ImageData for synchronous Mapbox addImage() registration
- Vehicles rotate to match their heading via Mapbox icon-rotate symbol property
- Regular vehicles loop seamlessly when distanceTravelled exceeds routeLength
- Loading screen shows per-route fetch status (cached / fetching / done / error)
  with a progress bar; map loads in background while routes are being fetched
- Vehicles are hidden and controls disabled until all routes are ready

---

🚨 Milestone 2: Detection & Clearance Logic — DONE

Scope: Emergency vehicle spawn + proximity-based lane clearing

Deliverables:
✅ Emergency vehicle spawns at south edge of viewport, travels north on 6th Ave
✅ Haversine distance check via @turf/distance on every animation frame
✅ Vehicles within 75m radius animate a smooth rightward lane shift
✅ Vehicles return to original lane once EV passes the trigger radius
✅ All state transitions happen in real time, no page reload required

Technical implementation:
- Trigger radius: 75m (configurable in src/data/config.ts)
- Proximity detection: src/simulation/proximityDetection.ts — @turf/distance
  returns a Set<string> of vehicle IDs within range each frame
- Clearance offset: @turf/destination at heading + 90°, 5m distance
  gives the rightward-shifted target position relative to current heading
- Smooth animation: linear interpolation (lerpFactor 0→1 to clear, 1→0 to return)
  over 1000ms (CONFIG.simulation.clearAnimationDurationMs)
- originalPosition updates every frame from route progress regardless of state —
  prevents position jump when return animation completes
- clearedPosition recomputed every frame from current originalPosition + heading —
  keeps the offset anchored to the vehicle's moving road position
- EV teleports instantly to route start when it reaches the end (no transition)
- Vehicle state machine: normal → clearing → returning → normal
- State transitions only when lerpFactor fully completes (no snap-back)

---

🎨 Milestone 3: UI & Final Demo Polish — DONE

Scope: Controls, visual feedback, performance tuning, demo readiness

Deliverables:
✅ Start / Pause / Reset controls with state-aware disabled states
✅ Detection radius circle overlay tracking EV in real time
✅ Vehicle state indicators: blue (normal), orange (clearing/returning), red (emergency)
✅ Top-down car SVG icons with windshields, wheels, headlights, tail lights
✅ Emergency vehicle has blue/red light bar + white cross (ambulance style)
✅ Legend panel with matching miniature SVG icons
✅ City label overlay: "Midtown Manhattan, New York"
✅ Full-screen error fallback with Retry button (wraps Map subtree only)
✅ Missing token screen with step-by-step setup instructions
✅ No per-frame React re-renders during simulation (verified by code audit)

Technical implementation:
- SimulationControls subscribes to status only (not vehicle positions)
- Animation loop maintains live vehicle state in module-level variables —
  Zustand store only written on pause (for resume continuity) and reset
- Radius overlay: 32-point polygon computed each frame via @turf/destination,
  pushed to ev-radius GeoJSON source imperatively (no React involvement)
- Reset works mid-clearance: stops loop, rebuilds initial vehicle state from
  routes already stored in the store, repopulates Mapbox sources immediately
- Error boundary wraps <Map> subtree only; controls stay mounted during map errors

---

## 🗂 Project Structure

```
src/
├── App.tsx                          # Root: token gate, route loading, layout
├── components/
│   ├── Controls/
│   │   └── SimulationControls.tsx  # Start / Pause / Reset buttons
│   ├── Legend/
│   │   └── StateLegend.tsx         # SVG car icon legend panel
│   ├── LoadingScreen.tsx           # Per-route loading progress overlay
│   └── Map/
│       ├── MapContainer.tsx        # Mapbox map + ErrorBoundary wrapper
│       ├── MapErrorFallback.tsx    # Full-screen error UI + Retry
│       ├── RadiusOverlay.tsx       # EV trigger radius fill + line layer
│       └── VehicleLayer.tsx        # GeoJSON symbol layer for all vehicles
├── data/
│   ├── config.ts                   # CONFIG constants (center, speeds, radius)
│   ├── routes.ts                   # Legacy axis-aligned route fallback
│   └── waypoints.ts                # Key intersection coords per route (API input)
├── hooks/
│   └── useRoutes.ts                # Parallel route loading + progress state
├── services/
│   └── directionsService.ts       # Mapbox Directions API + localStorage cache
├── simulation/
│   ├── animationLoop.ts            # requestAnimationFrame loop + all frame logic
│   ├── clearanceAnimation.ts       # Lerp, computeClearedPosition, interpolateLngLat
│   ├── proximityDetection.ts       # @turf/distance radius check → Set<id>
│   └── routeEngine.ts              # @turf/along position, @turf/bearing heading
├── store/
│   └── simulationStore.ts          # Zustand store: status, vehicles, EV, actions
├── types/
│   └── index.ts                    # Shared TypeScript interfaces
└── utils/
    └── createVehicleIcon.ts        # Canvas-drawn car + ambulance icons → RawIcon
```

---

## ⚙️ Key Configuration (src/data/config.ts)

| Parameter | Value | Description |
|-----------|-------|-------------|
| map.center | [-73.985, 40.748] | Midtown Manhattan, NYC |
| map.zoom | 15 | Street-level detail |
| map.style | streets-v12 | Mapbox streets style |
| triggerRadiusMetres | 75 | EV clearance trigger distance |
| vehicleSpeedKmh | 30 | Regular vehicle speed |
| evSpeedKmh | 50 | Emergency vehicle speed |
| clearAnimationDurationMs | 1000 | Shift-out and shift-back duration |
| vehicleCount | 7 | Number of regular vehicles |

---

## 🔑 Environment Variables

| Variable | Required | Notes |
|----------|----------|-------|
| VITE_MAPBOX_TOKEN | Yes | Public token (pk.…) from mapbox.com |

Set in `.env.local` (never committed — in .gitignore).

---

## 🚀 Running the Project

```bash
npm install
# add VITE_MAPBOX_TOKEN=pk.your_token to .env.local
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
```

---

## 🗺 Route System

Routes are loaded once and cached in localStorage indefinitely.

- 7 regular vehicle routes covering the Midtown Manhattan grid
  (8th Ave, 7th Ave, 6th Ave, Broadway, 5th Ave, Madison Ave corridors
  between ~30th and ~42nd Streets)
- 1 emergency vehicle route: straight north on 6th Ave (northbound one-way),
  entering from south of the viewport and exiting north
- Cache key includes map center coordinates — changing CONFIG.map.center
  automatically invalidates cached routes and triggers a fresh API fetch
- On API failure: falls back to straight-line segments between waypoints

---

⚠️ Explicitly Out of Scope

Live GPS feeds, third-party traffic APIs, or real-world data
AI/ML prediction, complex routing, or intersection logic
Physics engines, collision detection, or multi-lane road rules
Traffic lights or stop sign enforcement
User auth, databases, or persistent storage
Mobile app or responsive mobile optimization (desktop/browser first)
Any additions beyond this scope will require a separate change request.

---

📤 Delivery & Handoff

Private GitHub repo with clean, commented code
Live staging URL (frontend + backend if applicable)
README.md with setup, run, and deploy instructions
3-min Loom walkthrough of features + controls
Final milestone sign-off upon demo approval

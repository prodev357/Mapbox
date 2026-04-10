# GAECA Clearance Engine

A browser-based simulation of emergency vehicle approach and dynamic lane-clearing on a real-time Mapbox map. Fully client-side — no backend, no databases, no AI/ML.

**Live demo**: https://gaeca.vercel.app/

---

## What it does

- 7 vehicles drive continuously along real Midtown Manhattan street routes
- An emergency vehicle enters from the south on 6th Avenue and travels north
- Vehicles within 75m of the EV smoothly shift right to clear the path
- Once the EV passes, vehicles animate back to their original lane
- Start / Pause / Reset controls let you run, freeze, and replay the simulation

---

## Tech stack

| Package | Role |
|---------|------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| mapbox-gl + react-map-gl | Map rendering and symbol layers |
| @turf/along, @turf/bearing, @turf/distance, @turf/destination | Geospatial math |
| zustand | Simulation state management |
| react-error-boundary | Graceful map error fallback |
| Tailwind CSS | Styling |

---

## Setup

### Prerequisites

- Node.js 18+
- A Mapbox account with a public access token ([mapbox.com](https://mapbox.com))

### Install

```bash
npm install
```

### Configure

Create `.env.local` in the project root:

```
VITE_MAPBOX_TOKEN=pk.your_token_here
```

This file is gitignored and never committed.

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Build

```bash
npm run build       # production build → dist/
npm run preview     # preview the production build locally
```

---

## Deploy (Vercel)

The project is deployed at **https://gaeca.vercel.app/**.

To deploy your own instance:

1. Push the repo to GitHub
2. Import it in [vercel.com](https://vercel.com)
3. Add `VITE_MAPBOX_TOKEN` as an environment variable in the Vercel project settings
4. Deploy — Vercel auto-detects Vite and sets the build command to `npm run build`

---

## Project structure

```
src/
├── App.tsx                          # Root: token gate, route loading, layout
├── components/
│   ├── Controls/SimulationControls.tsx   # Start / Pause / Reset
│   ├── Legend/StateLegend.tsx            # Vehicle state colour key
│   ├── LoadingScreen.tsx                 # Route fetch progress overlay
│   └── Map/
│       ├── MapContainer.tsx         # Mapbox map + error boundary
│       ├── MapErrorFallback.tsx     # Error UI with Retry button
│       ├── RadiusOverlay.tsx        # EV trigger radius circle layer
│       └── VehicleLayer.tsx         # GeoJSON symbol layer for vehicles
├── data/
│   ├── config.ts                    # Map center, speeds, trigger radius
│   └── waypoints.ts                 # Key intersection coords per route
├── hooks/useRoutes.ts               # Parallel route loading + caching
├── services/directionsService.ts   # Mapbox Directions API + localStorage cache
├── simulation/
│   ├── animationLoop.ts             # requestAnimationFrame loop
│   ├── clearanceAnimation.ts        # Lerp and offset logic
│   ├── proximityDetection.ts        # Haversine radius check
│   └── routeEngine.ts               # Position and heading along route
├── store/simulationStore.ts         # Zustand store
├── types/index.ts                   # Shared TypeScript types
└── utils/createVehicleIcon.ts       # Canvas-drawn car/ambulance icons
```

---

## Configuration

All simulation parameters are in `src/data/config.ts`:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `map.center` | `[-73.985, 40.748]` | Midtown Manhattan |
| `map.zoom` | `15` | Street-level zoom |
| `triggerRadiusMetres` | `75` | EV clearance trigger distance |
| `vehicleSpeedKmh` | `30` | Regular vehicle speed |
| `evSpeedKmh` | `70` | Emergency vehicle speed |
| `clearAnimationDurationMs` | `1000` | Lane shift duration (ms) |

Routes are fetched from the Mapbox Directions API on first load and cached in `localStorage` indefinitely. Changing `map.center` invalidates the cache and triggers a fresh fetch.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_MAPBOX_TOKEN` | Yes | Mapbox public token (`pk.…`) |

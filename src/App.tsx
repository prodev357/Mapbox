import { useEffect } from 'react';
import { MapContainer } from '@/components/Map/MapContainer';
import { VehicleLayer } from '@/components/Map/VehicleLayer';
import { RadiusOverlay } from '@/components/Map/RadiusOverlay';
import { SimulationControls } from '@/components/Controls/SimulationControls';
import { SpeedControls } from '@/components/Controls/SpeedControls';
import { StateLegend } from '@/components/Legend/StateLegend';
import { ZoomControls } from '@/components/Map/ZoomControls';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRoutes } from '@/hooks/useRoutes';
import { initSimulation } from '@/store/simulationStore';

function MissingTokenScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-100">
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-lg font-semibold text-slate-900">Mapbox token required</h1>
        <p className="mb-6 text-sm text-slate-500">
          A Mapbox public access token is needed to render the map.
        </p>
        <ol className="mb-6 space-y-3 text-sm text-slate-700">
          <li>
            <span className="font-medium text-slate-900">1.</span> Create a free account at{' '}
            <span className="font-mono text-slate-700">mapbox.com</span> and copy your public token
            (starts with <span className="font-mono text-slate-800">pk.</span>)
          </li>
          <li>
            <span className="font-medium text-slate-900">2.</span> Create a file named{' '}
            <span className="font-mono text-slate-800">.env.local</span> in the project root
          </li>
          <li>
            <span className="font-medium text-slate-900">3.</span> Add the following line:
            <pre className="mt-1 rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-green-700">
              VITE_MAPBOX_TOKEN=pk.your_token_here
            </pre>
          </li>
          <li>
            <span className="font-medium text-slate-900">4.</span> Restart the dev server:{' '}
            <span className="font-mono text-slate-800">npm run dev</span>
          </li>
        </ol>
        <p className="text-xs text-slate-400">
          The token is never committed — <span className="font-mono">.env.local</span> is in{' '}
          <span className="font-mono">.gitignore</span>.
        </p>
      </div>
    </div>
  );
}

function SimulationApp() {
  const token = import.meta.env.VITE_MAPBOX_TOKEN as string;
  const { regularRoutes, evRoute, loading, routeStates, doneCount, total } =
    useRoutes(token);

  // Once routes are ready, initialise the simulation store
  useEffect(() => {
    if (regularRoutes && evRoute) {
      initSimulation(regularRoutes, evRoute);
    }
  }, [regularRoutes, evRoute]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-200">
      {/* Map and overlays always mounted so the map loads in the background */}
      <MapContainer>
        <RadiusOverlay />
        <VehicleLayer />
        {!loading && <ZoomControls />}
      </MapContainer>

      {/* City label */}
      {!loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur border border-slate-200 px-3 py-1 shadow-sm pointer-events-none">
          <svg className="h-3 w-3 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-xs font-medium text-slate-600 tracking-wide">Midtown Manhattan, New York</span>
        </div>
      )}

      {/* Controls and legend only shown once routes are ready */}
      {!loading && (
        <>
          <div className="absolute top-4 left-4 z-10 flex items-start gap-2">
            <SimulationControls />
            <SpeedControls />
          </div>
          <StateLegend />
        </>
      )}

      {/* Loading overlay — sits on top until all routes are fetched */}
      {loading && (
        <LoadingScreen
          routeStates={routeStates}
          doneCount={doneCount}
          total={total}
        />
      )}
    </div>
  );
}

export default function App() {
  if (!import.meta.env.VITE_MAPBOX_TOKEN) {
    return <MissingTokenScreen />;
  }

  return <SimulationApp />;
}

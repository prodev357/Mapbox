import { useRef, useCallback, type ReactNode } from 'react';
import Map from 'react-map-gl';
import type { Map as MapboxMap } from 'mapbox-gl';
import { ErrorBoundary } from 'react-error-boundary';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CONFIG } from '@/data/config';
import { MapErrorFallback } from './MapErrorFallback';
import { setMapRef, registerLoopHandlers } from '@/store/simulationStore';
import { startLoop, stopLoop, populateSources } from '@/simulation/animationLoop';

interface MapContainerProps {
  children?: ReactNode;
}

function MapInner({ children }: MapContainerProps) {
  const mapRef = useRef<MapboxMap | null>(null);

  const handleMapLoad = useCallback((event: { target: MapboxMap }) => {
    const map = event.target;
    mapRef.current = map;
    setMapRef(map);
    registerLoopHandlers(startLoop, stopLoop, populateSources);

    // Show vehicles at their starting positions before simulation begins
    // Wait one tick so react-map-gl has registered the Sources
    requestAnimationFrame(() => populateSources(map));
  }, []);

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        longitude: CONFIG.map.center[0],
        latitude: CONFIG.map.center[1],
        zoom: CONFIG.map.zoom,
      }}
      mapStyle={CONFIG.map.style}
      style={{ width: '100%', height: '100%' }}
      onLoad={handleMapLoad}
    >
      {children}
    </Map>
  );
}

export function MapContainer({ children }: MapContainerProps) {
  return (
    <div className="absolute inset-0">
      <ErrorBoundary FallbackComponent={MapErrorFallback}>
        <MapInner>{children}</MapInner>
      </ErrorBoundary>
    </div>
  );
}

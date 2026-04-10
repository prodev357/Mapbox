import { Source, Layer } from 'react-map-gl';
import type { FillLayer, LineLayer } from 'react-map-gl';

const EMPTY_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const radiusFillLayer: FillLayer = {
  id: 'ev-radius-fill',
  type: 'fill',
  source: 'ev-radius',
  paint: {
    'fill-color': '#EF4444',
    'fill-opacity': 0.12,
  },
};

const radiusLineLayer: LineLayer = {
  id: 'ev-radius-line',
  type: 'line',
  source: 'ev-radius',
  paint: {
    'line-color': '#EF4444',
    'line-width': 1.5,
    'line-opacity': 0.5,
  },
};

export function RadiusOverlay() {
  return (
    <Source id="ev-radius" type="geojson" data={EMPTY_GEOJSON}>
      <Layer {...radiusFillLayer} />
      <Layer {...radiusLineLayer} />
    </Source>
  );
}

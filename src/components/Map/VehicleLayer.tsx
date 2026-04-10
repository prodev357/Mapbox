import { useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl';
import type { SymbolLayer } from 'react-map-gl';
import { VEHICLE_ICONS } from '@/utils/createVehicleIcon';

const EMPTY_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const vehicleLayerStyle: SymbolLayer = {
  id: 'vehicles-layer',
  type: 'symbol',
  source: 'vehicles',
  layout: {
    'icon-image': [
      'match',
      ['get', 'state'],
      'normal',    'normal',
      'clearing',  'clearing',
      'returning', 'clearing',
      'emergency', 'emergency',
      /* fallback */ 'normal',
    ],
    'icon-rotate': ['get', 'heading'],
    'icon-rotation-alignment': 'map',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'text-field': ['concat', ['to-string', ['get', 'speed']], ' km/h'],
    'text-size': 11,
    'text-offset': [0, 2.2],
    'text-anchor': 'top',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
  },
  paint: {
    'text-color': '#ffffff',
    'text-halo-color': '#1e293b',
    'text-halo-width': 1.5,
  },
};

export function VehicleLayer() {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;

    const registerIcons = () => {
      for (const [key, createIcon] of Object.entries(VEHICLE_ICONS)) {
        if (!map.hasImage(key)) {
          map.addImage(key, createIcon());
        }
      }
    };

    if (map.isStyleLoaded()) {
      registerIcons();
    } else {
      map.once('style.load', registerIcons);
    }
  }, [map]);

  return (
    <Source id="vehicles" type="geojson" data={EMPTY_GEOJSON}>
      <Layer {...vehicleLayerStyle} />
    </Source>
  );
}

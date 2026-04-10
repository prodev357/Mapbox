import { useMap } from 'react-map-gl';

export function ZoomControls() {
  const { current: map } = useMap();

  const zoomIn = () => map?.zoomIn({ duration: 200 });
  const zoomOut = () => map?.zoomOut({ duration: 200 });

  return (
    <div className="absolute bottom-8 left-4 z-10 flex flex-col rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
      <button
        onClick={zoomIn}
        className="w-9 h-9 flex items-center justify-center bg-gray-900/90 backdrop-blur text-white text-lg hover:bg-gray-700 transition-colors border-b border-gray-700"
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={zoomOut}
        className="w-9 h-9 flex items-center justify-center bg-gray-900/90 backdrop-blur text-white text-lg hover:bg-gray-700 transition-colors"
        aria-label="Zoom out"
      >
        −
      </button>
    </div>
  );
}

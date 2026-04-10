/// <reference types="vite/client" />

// Allow CSS side-effect imports from node_modules
declare module 'mapbox-gl/dist/mapbox-gl.css' {
  const styles: unknown;
  export default styles;
}

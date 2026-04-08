📍 Project: GAECA Clearance Engine MVP (Simulation)

Objective: Build a lightweight, visual MVP that simulates emergency vehicle approach and dynamic lane-clearing behavior on a real-time map. Fully mocked data, no AI/ML, no live APIs. Focus on smooth animation, clear logic, and demo-ready presentation.

📦 Milestone 1: Map Setup & Vehicle Simulation

Scope: Core map rendering + simulated traffic movement
Deliverables:
Mapbox GL JS integration in React
Map centered on a clear urban/suburban grid
5-10 vehicles moving along predefined polyline routes
Smooth, continuous animation loop

Technical Specs:

Mock GPS coordinates updated via JS interval or requestAnimationFrame
Vehicle markers use custom icons, rotate to match heading
No external APIs or databases

Acceptance Criteria:

✅ Map loads without errors at agreed zoom/location
✅ Multiple vehicles render and move continuously along set paths
✅ Movement is smooth (target 60fps), no marker jitter or teleporting
✅ Staging link shared + code pushed to repo

🚨 Milestone 2: Detection & Clearance Logic

Scope: Emergency vehicle spawn + proximity-based lane clearing
Deliverables:
Emergency vehicle enters from rear/bottom of viewport
Distance-based trigger (lat/lng calculation)
Nearby vehicles ahead shift right to clear central path
Real-time state updates reflected on map

Technical Specs:

Haversine or planar distance calculation for trigger radius (~50–100m)
Conditional animation: vehicles in range receive clearance state
Lane shift uses interpolated coordinates, not instant teleport
Logic runs in real time, no page reloads

Acceptance Criteria:

✅ Emergency vehicle approaches along defined route
✅ When within trigger distance, vehicles ahead animate rightward shift
✅ Cleared central path is visibly open on map
✅ State updates broadcast/sync smoothly in real time
✅ Staging link demonstrates end-to-end flow

🎨 Milestone 3: UI & Final Demo Polish

Scope: Controls, visual feedback, performance tuning, demo readiness
Deliverables:
Start / Pause / Reset controls
Detection radius overlay (circle)
Vehicle state indicators (normal vs. clearing)
Animation refinement + bug fixes
Clean, presentation-ready UI

Technical Specs:

React UI components for controls + legend
CSS/Mapbox styling for radius, vehicle colors, labels
Performance pass: debounce heavy calculations, limit re-renders
Error boundaries + graceful fallbacks

Acceptance Criteria:

✅ Controls work reliably (start, pause, reset)
✅ Detection radius clearly visible and scales with logic
✅ Vehicles color-coded or labeled by state
✅ Animations run smoothly on standard hardware
✅ Final build is stable, visually clean, and ready for client demo

⚠️ Explicitly Out of Scope

Live GPS feeds, third-party traffic APIs, or real-world data
AI/ML prediction, complex routing, or intersection logic
Physics engines, collision detection, or multi-lane road rules
User auth, databases, or persistent storage
Mobile app or responsive mobile optimization (desktop/browser first)
Any additions beyond this scope will require a separate change request.

📤 Delivery & Handoff

Private GitHub repo with clean, commented code
Live staging URL (frontend + backend if applicable)
README.md with setup, run, and deploy instructions
3-min Loom walkthrough of features + controls
Final milestone sign-off upon demo approval



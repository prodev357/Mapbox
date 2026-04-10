import { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export function SpeedControls() {
  const [open, setOpen] = useState(true);
  const vehicleSpeedKmh = useSimulationStore((s) => s.vehicleSpeedKmh);
  const evSpeedKmh = useSimulationStore((s) => s.evSpeedKmh);
  const setVehicleSpeed = useSimulationStore((s) => s.setVehicleSpeed);
  const setEvSpeed = useSimulationStore((s) => s.setEvSpeed);

  return (
    <div className="rounded-xl bg-gray-900/90 backdrop-blur border border-gray-700 shadow-2xl w-52">
      {/* Header / toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-3 text-left"
      >
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Speed Controls
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Collapsible body */}
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-gray-700">
          {/* Regular vehicles */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white font-medium">Vehicles</span>
              <span className="text-xs font-mono text-blue-400">{vehicleSpeedKmh} km/h</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={vehicleSpeedKmh}
              onChange={(e) => setVehicleSpeed(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700 accent-blue-500"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-gray-500">10</span>
              <span className="text-[10px] text-gray-500">100</span>
            </div>
          </div>

          {/* Emergency vehicle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white font-medium">Emergency</span>
              <span className="text-xs font-mono text-red-400">{evSpeedKmh} km/h</span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={evSpeedKmh}
              onChange={(e) => setEvSpeed(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700 accent-red-500"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-gray-500">10</span>
              <span className="text-[10px] text-gray-500">150</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

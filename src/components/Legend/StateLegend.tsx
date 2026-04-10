interface LegendItemProps {
  color: string;
  label: string;
  sublabel?: string;
  isEmergency?: boolean;
}

function CarSvg({ color }: { color: string }) {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" style={{ flexShrink: 0 }}>
      {/* Wheels */}
      <rect x="0" y="2"  width="3" height="4" rx="1" fill="rgba(20,20,20,0.7)" />
      <rect x="11" y="2" width="3" height="4" rx="1" fill="rgba(20,20,20,0.7)" />
      <rect x="0" y="16" width="3" height="4" rx="1" fill="rgba(20,20,20,0.7)" />
      <rect x="11" y="16" width="3" height="4" rx="1" fill="rgba(20,20,20,0.7)" />
      {/* Body */}
      <rect x="2" y="1" width="10" height="20" rx="3" fill={color} />
      {/* Windshield */}
      <rect x="3.5" y="2.5" width="7" height="4.5" rx="1.5" fill="rgba(200,230,255,0.8)" />
      {/* Rear window */}
      <rect x="3.5" y="14.5" width="7" height="3.5" rx="1" fill="rgba(200,230,255,0.55)" />
      {/* Headlights */}
      <rect x="3" y="1.2" width="2.5" height="0.8" rx="0.4" fill="rgba(255,250,200,0.9)" />
      <rect x="8.5" y="1.2" width="2.5" height="0.8" rx="0.4" fill="rgba(255,250,200,0.9)" />
    </svg>
  );
}

function AmbulanceSvg() {
  return (
    <svg width="16" height="24" viewBox="0 0 16 24" style={{ flexShrink: 0 }}>
      {/* Wheels */}
      <rect x="0" y="2"  width="3" height="3.5" rx="1" fill="rgba(20,20,20,0.7)" />
      <rect x="13" y="2" width="3" height="3.5" rx="1" fill="rgba(20,20,20,0.7)" />
      <rect x="0" y="18" width="3" height="3.5" rx="1" fill="rgba(20,20,20,0.7)" />
      <rect x="13" y="18" width="3" height="3.5" rx="1" fill="rgba(20,20,20,0.7)" />
      {/* Body */}
      <rect x="2" y="0.5" width="12" height="23" rx="2.5" fill="#EF4444" />
      {/* Light bar */}
      <rect x="3" y="1.2" width="4" height="1.2" rx="0.6" fill="#1E40AF" />
      <rect x="9" y="1.2" width="4" height="1.2" rx="0.6" fill="#DC2626" />
      {/* Windshield */}
      <rect x="3.5" y="2.8" width="9" height="4" rx="1.2" fill="rgba(200,230,255,0.78)" />
      {/* Cross */}
      <rect x="7" y="11" width="2" height="6" rx="0.5" fill="white" />
      <rect x="5" y="13" width="6" height="2" rx="0.5" fill="white" />
      {/* Rear window */}
      <rect x="3.5" y="17.5" width="9" height="3" rx="1" fill="rgba(200,230,255,0.55)" />
    </svg>
  );
}

function LegendItem({ color, label, sublabel, isEmergency }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center justify-center w-5">
        {isEmergency ? <AmbulanceSvg /> : <CarSvg color={color} />}
      </div>
      <div>
        <div className="text-sm text-white font-medium leading-tight">{label}</div>
        {sublabel && <div className="text-xs text-gray-400 leading-tight">{sublabel}</div>}
      </div>
    </div>
  );
}

export function StateLegend() {
  return (
    <div className="absolute bottom-8 right-4 z-10 rounded-xl bg-gray-900/90 backdrop-blur border border-gray-700 p-4 shadow-2xl min-w-[190px]">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Vehicle States
      </h3>
      <div className="flex flex-col gap-3">
        <LegendItem color="#3B82F6" label="Normal" sublabel="Moving on route" />
        <LegendItem color="#F97316" label="Clearing" sublabel="Shifting right / returning" />
        <LegendItem color="#EF4444" label="Emergency Vehicle" sublabel="75m trigger radius" isEmergency />
      </div>
    </div>
  );
}

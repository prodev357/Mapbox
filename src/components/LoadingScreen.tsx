import type { RouteState } from '@/hooks/useRoutes';

interface LoadingScreenProps {
  routeStates: RouteState[];
  doneCount: number;
  total: number;
}

const STATUS_ICON: Record<RouteState['status'], string> = {
  pending:  '○',
  cached:   '✓',
  fetching: '⟳',
  done:     '✓',
  error:    '⚠',
};

const STATUS_COLOR: Record<RouteState['status'], string> = {
  pending:  'text-slate-400',
  cached:   'text-green-500',
  fetching: 'text-slate-500 animate-spin',
  done:     'text-green-500',
  error:    'text-amber-400',
};

const ROUTE_LABELS: Record<string, string> = {
  r1: '8th Ave loop',
  r2: 'Madison loop',
  r3: '36th–38th crosstown',
  r4: '5th Ave loop',
  r5: 'Outer perimeter',
  r6: '34th–36th crosstown',
  r7: '6th–Madison loop',
  ev: 'Emergency vehicle',
};

export function LoadingScreen({ routeStates, doneCount, total }: LoadingScreenProps) {
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100">
      <div className="w-80 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Loading routes</h2>
            <p className="text-xs text-slate-400">Fetching street directions…</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Route list */}
        <ul className="space-y-1.5">
          {routeStates.map((r) => (
            <li key={r.id} className="flex items-center gap-2.5">
              <span className={`text-xs font-mono w-3 text-center ${STATUS_COLOR[r.status]}`}>
                {STATUS_ICON[r.status]}
              </span>
              <span className="text-xs text-slate-600 flex-1">
                {ROUTE_LABELS[r.id] ?? r.id}
              </span>
              {r.status === 'cached' && (
                <span className="text-[10px] text-slate-400">cached</span>
              )}
              {r.status === 'error' && (
                <span className="text-[10px] text-amber-400">fallback</span>
              )}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-slate-400">
          {doneCount} / {total} routes ready
        </p>
      </div>
    </div>
  );
}

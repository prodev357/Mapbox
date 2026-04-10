import type { FallbackProps } from 'react-error-boundary';

export function MapErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg max-w-md">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Map failed to load</h2>
        <p className="text-sm text-slate-500 mb-6 break-words">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

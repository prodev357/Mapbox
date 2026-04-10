import { useSimulationStore } from '@/store/simulationStore';

export function SimulationControls() {
  const status = useSimulationStore((s) => s.status);
  const start = useSimulationStore((s) => s.start);
  const pause = useSimulationStore((s) => s.pause);
  const reset = useSimulationStore((s) => s.reset);

  return (
    <div className="flex gap-2 rounded-xl bg-gray-900/90 backdrop-blur border border-gray-700 p-3 shadow-2xl">
      <button
        onClick={start}
        disabled={status === 'running'}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
          bg-green-600 hover:bg-green-500 text-white disabled:bg-green-600"
      >
        {status === 'paused' ? 'Resume' : 'Start'}
      </button>
      <button
        onClick={pause}
        disabled={status !== 'running'}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
          bg-yellow-500 hover:bg-yellow-400 text-white disabled:bg-yellow-500"
      >
        Pause
      </button>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors
          bg-gray-600 hover:bg-gray-500 text-white"
      >
        Reset
      </button>

      <div className="ml-2 flex items-center">
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
            status === 'running'
              ? 'bg-green-400 animate-pulse'
              : status === 'paused'
              ? 'bg-yellow-400'
              : 'bg-gray-500'
          }`}
        />
        <span className="text-xs text-gray-300 capitalize">{status}</span>
      </div>
    </div>
  );
}

import { useExecutionStore } from '../../store/executionStore'

const LEVEL_STYLES = {
  LOG: 'text-indigo-400',
  WARN: 'text-yellow-400',
  ERROR: 'text-red-400',
}

export function OutputPanel() {
  const executionLog = useExecutionStore((s) => s.executionLog)
  const clearLog = useExecutionStore((s) => s.clearLog)

  return (
    <div className="h-48 bg-white border-t border-gray-100 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Output
        </p>
        <button
          onClick={clearLog}
          className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs">
        {executionLog.length === 0 ? (
          <p className="text-gray-300">Run a workflow to see output here.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {executionLog.map((entry, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-gray-300 shrink-0">{entry.timestamp}</span>
                <span className={`shrink-0 font-semibold ${LEVEL_STYLES[entry.level]}`}>
                  {entry.level}
                </span>
                <span className="text-gray-500 shrink-0">{entry.stage}::</span>
                <span className="text-gray-700">{JSON.stringify(entry.output)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
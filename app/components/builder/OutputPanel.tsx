export function OutputPanel() {
  return (
    <div className="h-48 bg-white border-t border-gray-100 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Output
        </p>
        <button className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-xs text-gray-400 flex items-center justify-center">
        <p>Run a workflow to see output here.</p>
      </div>
    </div>
  )
}
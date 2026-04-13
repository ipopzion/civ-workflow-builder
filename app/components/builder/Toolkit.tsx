export function Toolkit() {
  return (
    <aside className="w-56 bg-gray-100 text-white flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-gray-800">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
          Tasks
        </p>
      </div>

      <div className="px-3 py-4">
        <button
          onClick={() => alert('Task added')}
          className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-700 text-sm text-gray-100 transition-colors"
        >
          + Add Task
        </button>
      </div>
    </aside>
  )
}
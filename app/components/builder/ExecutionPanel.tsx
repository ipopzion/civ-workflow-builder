import { useWorkflowStore } from '../../store/workflowStore'

export function ExecutionPanel() {
  const tasks = useWorkflowStore((s) => s.tasks)

  function handleRun() {
    // execution logic coming next commit
  }

  return (
    <aside className="w-64 bg-white flex flex-col shrink-0 border-l border-gray-100">
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Execution
        </p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400">Tasks queued</p>
          <p className="text-2xl font-semibold text-gray-800">{tasks.length}</p>
        </div>

        <button
          onClick={handleRun}
          disabled={tasks.length === 0}
          className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-300 text-white text-sm font-medium rounded-xl transition-colors"
        >
          ▶ Run Workflow
        </button>
      </div>
    </aside>
  )
}
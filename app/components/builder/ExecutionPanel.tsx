// ExecutionPanel.tsx
import { useExecutionStore } from '~/store/executionStore'
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'

export function ExecutionPanel() {
  const tasks = useWorkflowStepsStore((s) => s.tasks)
  const runWorkflow = useExecutionStore((s) => s.runWorkflow)
  const exportWorkflow = useWorkflowStepsStore((s) => s.exportWorkflow)

  return (
    <aside className="w-64 bg-white flex flex-col shrink-0 border-l border-gray-100">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Execution
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={exportWorkflow}
            disabled={tasks.length === 0}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded-md transition-colors"
            title="Export workflow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <button
            onClick={runWorkflow}
            disabled={tasks.length === 0}
            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed rounded-md transition-colors"
            title="Run workflow"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-400">Tasks queued</p>
          <p className="text-2xl font-semibold text-gray-800">{tasks.length}</p>
        </div>
      </div>
    </aside>
  )
}
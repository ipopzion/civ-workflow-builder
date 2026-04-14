import { useExecutionStore } from '~/store/executionStore'
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'
import { Download, Play, StepForward } from 'lucide-react'

export function ExecutionPanel() {
  const { tasks, exportWorkflow } = useWorkflowStepsStore()
  const { runWorkflow, runNextStep } = useExecutionStore()

  const hasPendingTasks = tasks.some(task => task.status !== 'success')
  const hasTasks = tasks.length > 0

  return (
    <aside className="w-64 bg-white flex flex-col shrink-0 border-l border-gray-100">
      {/* Header with title and actions */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Execution
        </p>

        <div className="flex items-center gap-0.5">
          {/* Export Button */}
          <button
            onClick={exportWorkflow}
            disabled={!hasTasks}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors"
            title="Export workflow"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Run Next Step Button */}
          <button
            onClick={runNextStep}
            disabled={!hasPendingTasks}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:bg-transparent rounded transition-colors"
            title="Run next step"
          >
            <StepForward className="w-3.5 h-3.5" />
          </button>

          {/* Run All Button */}
          <button
            onClick={runWorkflow}
            disabled={!hasTasks}
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:text-gray-500 disabled:hover:bg-transparent rounded transition-colors"
            title="Run all tasks"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="px-4 py-4 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-xs text-gray-400">Status</p>
          <div className="flex gap-2 text-xs">
            <span className="text-gray-600">
              Completed: {tasks.filter(t => t.status === 'success').length}
            </span>
            <span className="text-blue-600">
              Pending: {tasks.filter(t => t.status !== 'success').length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
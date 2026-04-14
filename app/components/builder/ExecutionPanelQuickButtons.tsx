import { useExecutionStore } from '~/store/executionStore'
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'
import { Download, Play, StepForward } from 'lucide-react'

export default function ExecutionPanelQuickButtons() {
  const { tasks, exportWorkflow } = useWorkflowStepsStore()
  const { runWorkflow, runNextStep } = useExecutionStore()

  const hasPendingTasks = tasks.some(task => task.status !== 'success')
  const hasTasks = tasks.length > 0

  return (
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
  )
}
import { TASK_TYPES, type WorkflowTask } from '~/types/workflow';
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'

export function TaskCard({ task, index }: { task: WorkflowTask; index: number }) {
  const meta = TASK_TYPES[task.type]
  const { removeTask } = useWorkflowStepsStore()

  return (
    <div
      className="group relative flex items-center gap-3 bg-white rounded-xl border-gray-200 px-4 py-3 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-default select-none"
    >
      <span className="font-mono text-xs text-gray-300 w-4 shrink-0">{index + 1}</span>

      <span
        className="text-lg w-7 text-center shrink-0"
        style={{ color: meta.accent }}
      >
        {meta.icon}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{meta.label}</p>
        <p className="text-xs text-gray-400 font-mono uppercase tracking-wide">{task.type}</p>
      </div>

      <button
        onClick={() => removeTask(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none shrink-0"
        title="Remove task"
      >
        ×
      </button>
    </div>
  )
}
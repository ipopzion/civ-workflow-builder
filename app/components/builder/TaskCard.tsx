import { TASK_TYPES, type WorkflowTask } from '~/types/workflow';
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'

const STATUS_STYLES = {
  idle: 'border-gray-200',
  success: 'border-green-400 bg-green-50',
  warning: 'border-yellow-400 bg-yellow-50',
  error: 'border-red-400 bg-red-50',
}

const STATUS_DOT = {
  idle: null,
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
}

export function TaskCard({ task, index }: { task: WorkflowTask; index: number }) {
  const meta = TASK_TYPES[task.type]
  const { removeTask } = useWorkflowStepsStore()
  const dot = STATUS_DOT[task.status]

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-default select-none ${STATUS_STYLES[task.status]}`}
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

      {dot && (
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
      )}

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
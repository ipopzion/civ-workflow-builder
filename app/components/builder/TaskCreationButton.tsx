import { useState } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import { TASK_TYPES } from '../../types/workflow'
import type { TaskType } from '../../types/workflow'

export function TaskCreationButton({ type }: { type: TaskType }) {
  const { addTask } = useWorkflowStore()
  const meta = TASK_TYPES[type]
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => addTask(type)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-left"
      >
        <span className="text-base w-6 text-center shrink-0" style={{ color: meta.accent }}>
          {meta.icon}
        </span>
        <span className="text-sm font-medium text-gray-700 flex-1">{meta.label}</span>

        <span
          role="button"
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-gray-300 hover:text-gray-500 transition-colors shrink-0 w-4 h-4 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400"
        >
          ?
        </span>
      </button>

      {showHint && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-10 w-44 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg pointer-events-none">
          {meta.description}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </div>
  )
}
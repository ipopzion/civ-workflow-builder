import { useState } from 'react'
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'
import ExecutionPanelQuickButtons from './ExecutionPanelQuickButtons'
import WorkflowMetadataInput from './WorkflowMetadataInput'

export function ExecutionPanel() {
  const { tasks } = useWorkflowStepsStore()

  return (
    <aside className="w-64 bg-white flex flex-col shrink-0 border-l border-gray-100">
      {/* Header with title and actions */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Execution
        </p>
        <ExecutionPanelQuickButtons />
      </div>

      {/* Content area */}
      <div className="px-4 py-4 flex flex-col gap-4 flex-1 overflow-y-auto">
        <WorkflowMetadataInput />
        <div className="border-t border-gray-100 my-2" />

        {/* Status Section */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Execution Status
          </p>
          <div className="flex gap-2 text-xs mt-2">
            <span className="text-gray-600">
              ✅ Completed: {tasks.filter(t => t.status === 'success').length}
            </span>
            <span className="text-blue-600">
              ⏳ Pending: {tasks.filter(t => t.status !== 'success').length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${tasks.length > 0
                    ? (tasks.filter(t => t.status === 'success').length / tasks.length) * 100
                    : 0}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {tasks.filter(t => t.status === 'success').length} / {tasks.length} tasks
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
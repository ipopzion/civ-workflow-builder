import { useEffect, useRef, useState } from 'react'
import type { WorkflowTask } from '~/types/workflow'
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'
import { getTaskType } from '~/taskLibrary'
import { InputField } from './InputField'
import { useDrag } from 'react-dnd'

const STATUS_STYLES = {
  idle: 'border-gray-200 bg-white',
  running: 'border-blue-400 bg-blue-50',
  success: 'border-green-400 bg-green-50',
  warning: 'border-yellow-400 bg-yellow-50',
  error: 'border-red-400 bg-red-50',
}

const STATUS_DOT = {
  idle: null,
  running: 'bg-blue-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
}

const ITEM_TYPE = 'TASK_CARD'

export function TaskCard({ task, index }: { task: WorkflowTask; index: number }) {
  const meta = getTaskType(task.type)
  const { removeTask, setTaskInput } = useWorkflowStepsStore()
  const dot = STATUS_DOT[task.status]

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: task.id, startX: task.position.x, startY: task.position.y },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [task.id, task.position.x, task.position.y])

  const cardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    dragPreview(cardRef.current)
  }, [dragPreview])

  const headerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    drag(headerRef.current)
  }, [drag])

  const inputEntries = Object.values(meta.inputFields)
  const outputEntries = Object.values(meta.outputFields)

  return (
    <div
      data-task-card="true"
      ref={cardRef}
      className={`absolute rounded-2xl border shadow-sm transition-colors ${STATUS_STYLES[task.status]}`}
      style={{
        left: task.position.x,
        top: task.position.y,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'default',
        width: '280px',
      }}
    >
      {/* Header — drag handle + collapse toggle */}
      <div
        ref={headerRef}
        className="group flex items-center gap-3 px-4 py-3 cursor-grab active:cursor-grabbing select-none"
      >
        <span className="font-mono text-xs text-gray-300 w-4 shrink-0">{index + 1}</span>

        <span className="text-lg w-7 text-center shrink-0">{meta.icon}</span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{meta.label}</p>
        </div>

        {dot && <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />}
        <button
          onClick={(e) => { e.stopPropagation(); removeTask(task.id) }}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none shrink-0"
          title="Remove task"
        >
          ×
        </button>
      </div>

      <div className="flex px-2 pb-3 pt-1 border-t border-gray-100">
        {/* Inputs Section - Left side with dots */}
        <div className="flex-1 relative">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 text-center">
            Inputs
          </p>
          <div className="space-y-3">
            {inputEntries.map((field, idx) => (
              <div key={field.key} className="relative">
                {/* Input dot on the left edge */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-white shadow-sm cursor-pointer hover:bg-blue-500 transition-colors" />
                </div>

                <div className="ml-2">
                  <label className="text-xs text-gray-400 mb-0.5 block truncate">
                    {field.label}
                  </label>
                  <InputField
                    field={field}
                    value={task.inputs?.[field.key] ?? ''}
                    onChange={(value) => setTaskInput(task.id, field.key, value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 mx-3 my-2" />

        {/* Outputs Section - Right side with dots */}
        <div className="flex-1 relative">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 text-center">
            Outputs
          </p>
          <div className="space-y-3">
            {outputEntries.map((field, idx) => (
              <div key={field.key} className="relative">
                {/* Output dot on the right edge */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow-sm cursor-pointer hover:bg-green-500 transition-colors" />
                </div>

                <div className="mr-2">
                  <label className="text-xs text-gray-400 mb-0.5 block truncate text-right">
                    {field.label}
                  </label>
                  <div className="w-full text-xs border border-gray-100 rounded-lg px-2 py-1.5 text-gray-400 font-mono bg-gray-50 text-right">
                    {task.outputs?.[field.key] ?? '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
import { Handle, Position } from '@xyflow/react'
import type { WorkflowTask } from '~/types/workflow'
import { useWorkflowStepsStore } from '../../store/workflowStepsStore'
import { getTaskType } from '~/taskLibrary'
import { InputField } from './InputField'
import { useConnectionStore } from '~/store/workflowConnectionsStore'

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

interface TaskCardProps {
  data: {
    task: WorkflowTask
    index: number
  }
}

// Helper function to check if a field should be shown based on conditions
const shouldShowField = (field: any, currentInputs: Record<string, any>): boolean => {
  if (!field.condition) return true

  const { field: conditionField, value: conditionValue } = field.condition
  const currentValue = currentInputs[conditionField]

  // Handle array of possible values
  if (Array.isArray(conditionValue)) {
    return conditionValue.includes(currentValue)
  }

  // Handle single value
  return currentValue === conditionValue
}

// Helper function to trim content for display
const trimContent = (content: any, maxLength: number = 80): string => {
  if (!content) return '—'

  let stringContent = String(content)

  // If it's JSON, try to prettify and trim
  if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
    try {
      const parsed = JSON.parse(content)
      stringContent = JSON.stringify(parsed)
    } catch (e) {
      // Not valid JSON, keep as is
    }
  }

  if (stringContent.length <= maxLength) {
    return stringContent
  }

  return stringContent.substring(0, maxLength) + '...'
}

export function TaskCard({ data }: TaskCardProps) {
  const { task, index } = data
  const meta = getTaskType(task.type)
  const { removeTask, setTaskInput, getTaskInputsWithConnections } = useWorkflowStepsStore()
  const { getConnectionsForTask } = useConnectionStore()
  const dot = STATUS_DOT[task.status]
  const connections = getConnectionsForTask(task.id)
  const connectedInputs = new Set(connections.incoming.map(c => c.targetInputKey))

  // Get resolved inputs (including connected values)
  const resolvedInputs = getTaskInputsWithConnections(task.id)

  // Get current inputs for condition checking
  const currentInputs = task.inputs || {}

  // Filter input fields based on conditions
  const visibleInputEntries = Object.values(meta.inputFields).filter(field =>
    shouldShowField(field, currentInputs)
  )

  const outputEntries = Object.values(meta.outputFields)

  // Helper to get display value for an input
  const getInputDisplayValue = (fieldKey: string) => {
    const isConnected = connectedInputs.has(fieldKey)

    // If connected, show the resolved value (from source task output)
    if (isConnected) {
      const resolvedValue = resolvedInputs[fieldKey]
      // Show resolved value if available, otherwise show placeholder
      return resolvedValue !== undefined ? resolvedValue : 'Waiting for connection...'
    }

    // If not connected, show manually entered value
    return task.inputs?.[fieldKey] ?? ''
  }

  // Handle field change and trigger re-render for conditional fields
  const handleInputChange = (fieldKey: string, value: any) => {
    setTaskInput(task.id, fieldKey, value)
    // The component will re-render automatically due to store update
  }

  return (
    <div
      data-task-card="true"
      className={`rounded-2xl border shadow-sm transition-colors ${STATUS_STYLES[task.status]}`}
      style={{
        width: '400px',
        cursor: 'default',
      }}
    >
      {/* Header - React Flow handles dragging via the node's draggable prop */}
      <div className="group flex items-center gap-3 px-4 py-3 select-none">
        <span className="font-mono text-xs text-gray-300 w-4 shrink-0">{index + 1}</span>
        <span className="text-lg w-7 text-center shrink-0">{meta.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{meta.label}</p>
        </div>
        {dot && <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeTask(task.id)
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-lg leading-none shrink-0"
          title="Remove task"
        >
          ×
        </button>
      </div>

      <div className="flex px-2 pb-3 pt-1 border-t border-gray-100">
        {/* Inputs Section */}
        <div className="flex-1 relative min-h-[100px]">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 text-center">
            Inputs
          </p>
          <div className="space-y-3 relative">
            {visibleInputEntries.map((field, idx) => {
              const isConnected = connectedInputs.has(field.key)
              const displayValue = getInputDisplayValue(field.key)

              return (
                <div key={field.key} className="relative">
                  {/* Position handle relative to this container */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10">
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={field.key}
                      className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white hover:!bg-blue-500 !transition-colors !relative !top-0 !left-0 !transform-none"
                      style={{
                        position: 'relative',
                      }}
                      isConnectable={!isConnected}
                    />
                  </div>

                  <div className="ml-2">
                    <label className="text-xs text-gray-400 mb-0.5 block truncate">
                      {field.label}
                      {isConnected && <span className="ml-1 text-green-500">🔗</span>}
                    </label>

                    {isConnected ? (
                      // Show read-only display with connected value
                      <div
                        className={`
                          w-full text-sm rounded-lg px-2 py-1.5 
                          ${displayValue !== 'Waiting for connection...'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-400 border border-gray-200'
                          }
                          cursor-help
                        `}
                        title={String(displayValue)}
                      >
                        {trimContent(displayValue, 30)}
                      </div>
                    ) : (
                      // Show editable input for non-connected fields
                      <InputField
                        field={field}
                        value={displayValue}
                        onChange={(value) => handleInputChange(field.key, value)}
                        disabled={isConnected}
                      />
                    )}
                  </div>
                </div>
              )
            })}

            {/* Show message when no inputs are visible */}
            {visibleInputEntries.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-4">
                No inputs available
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 mx-3 my-2" />

        {/* Outputs Section */}
        <div className="flex-1 relative min-h-[100px]">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 text-center">
            Outputs
          </p>
          <div className="space-y-3 relative">
            {outputEntries.map((field, idx) => {
              const outputValue = task.outputs?.[field.key]

              return (
                <div key={field.key} className="relative">
                  {/* Position handle relative to this container */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10">
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={field.key}
                      className="!w-3 !h-3 !bg-green-400 !border-2 !border-white hover:!bg-green-500 !transition-colors !relative !top-0 !right-0 !transform-none"
                      style={{
                        position: 'relative',
                      }}
                      isConnectable={true}
                    />
                  </div>

                  <div className="mr-2">
                    <label className="text-xs text-gray-400 mb-0.5 block truncate text-right">
                      {field.label}
                    </label>
                    <div
                      className={`
                        w-full text-xs border border-gray-100 rounded-lg px-2 py-1.5 
                        font-mono bg-gray-50 text-right
                        ${outputValue ? 'text-gray-700' : 'text-gray-400'}
                        cursor-help truncate
                      `}
                      title={outputValue ? String(outputValue) : 'No output yet'}
                    >
                      {outputValue ? trimContent(outputValue, 18) : '—'}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Show message when no outputs are available */}
            {outputEntries.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-4">
                No outputs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
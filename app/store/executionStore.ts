import { create } from 'zustand'
import type { ExecutionEntry } from '../types/workflow'
import { TASK_TYPES } from '../types/workflow'
import { useWorkflowStepsStore } from './workflowStepsStore'

interface ExecutionStore {
  executionLog: ExecutionEntry[]
  runWorkflow: () => void
  clearLog: () => void
}

function timestamp() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  executionLog: [],

  clearLog: () => set({ executionLog: [] }),

  runWorkflow: () => {
    const { tasks, setTaskStatus } = useWorkflowStepsStore.getState()

    if (tasks.length === 0) return

    const entries: ExecutionEntry[] = tasks.map((task) => {
      setTaskStatus(task.id, 'success')
      return {
        timestamp: timestamp(),
        level: 'LOG',
        stage: TASK_TYPES[task.type].label,
        output: `Executed task "${TASK_TYPES[task.type].label}"`,
      }
    })

    set({ executionLog: entries })
  },
}))

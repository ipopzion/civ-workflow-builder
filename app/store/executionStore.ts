import { create } from 'zustand'
import type { ExecutionEntry } from '../types/workflow'
import { useWorkflowStepsStore } from './workflowStepsStore'
import { getTaskType } from '~/taskTypes'

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
    const { tasks, setTaskStatus, setTaskOutputs } = useWorkflowStepsStore.getState()

    if (tasks.length === 0) return

    const entries: ExecutionEntry[] = []
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const meta = getTaskType(task.type)

      const { status, output } = meta.execute(task)

      entries.push({
        timestamp: timestamp(),
        level: status === 'success' ? 'LOG' : status === 'warning' ? 'WARN' : 'ERROR',
        stage: meta.label,
        status,
        output,
      })
      setTaskStatus(task.id, status)
      setTaskOutputs(task.id, output)
    }

    set({ executionLog: entries })
  },
}))


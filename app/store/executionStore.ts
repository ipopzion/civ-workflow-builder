import { create } from 'zustand'
import type { ExecutionEntry } from '../types/workflow'
import { useWorkflowStepsStore } from './workflowStepsStore'
import { getTaskType } from '~/taskLibrary'

interface ExecutionStore {
  executionLog: ExecutionEntry[]
  isRunning: boolean
  runWorkflow: () => Promise<void>
  runNextStep: () => Promise<void>
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

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  executionLog: [],
  isRunning: false,

  clearLog: () => set({ executionLog: [] }),

  runWorkflow: async () => {
    const { isRunning } = get()
    if (isRunning) return

    const { tasks, setTaskStatus, setTaskOutputs } = useWorkflowStepsStore.getState()

    if (tasks.length === 0) return

    set({ isRunning: true })
    const entries: ExecutionEntry[] = []

    try {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        const meta = getTaskType(task.type)

        // Skip already completed tasks if we want to allow resuming
        if (task.status === 'success') {
          entries.push({
            timestamp: timestamp(),
            level: 'LOG',
            stage: meta.label,
            status: 'success',
            output: task.outputs || { message: 'Already completed' },
          })
          continue
        }

        setTaskStatus(task.id, 'running')

        const { status, output } = await meta.execute(task)

        entries.push({
          timestamp: timestamp(),
          level: status === 'success' ? 'LOG' : status === 'warning' ? 'WARN' : 'ERROR',
          stage: meta.label,
          status,
          output,
        })

        setTaskStatus(task.id, status)
        setTaskOutputs(task.id, output)

        // Stop execution if task failed
        if (status === 'error') {
          break
        }
      }
    } finally {
      set({ executionLog: entries, isRunning: false })
    }
  },

  runNextStep: async () => {
    const { isRunning } = get()
    if (isRunning) return

    const { tasks, setTaskStatus, setTaskOutputs } = useWorkflowStepsStore.getState()

    if (tasks.length === 0) return

    // Find the first task that is not completed
    const nextTaskIndex = tasks.findIndex(task => task.status !== 'success')

    if (nextTaskIndex === -1) {
      // All tasks are completed
      return
    }

    const task = tasks[nextTaskIndex]
    const meta = getTaskType(task.type)

    set({ isRunning: true })

    try {
      setTaskStatus(task.id, 'running')

      const { status, output } = await meta.execute(task)

      const entry: ExecutionEntry = {
        timestamp: timestamp(),
        level: status === 'success' ? 'LOG' : status === 'warning' ? 'WARN' : 'ERROR',
        stage: meta.label,
        status,
        output,
      }

      setTaskStatus(task.id, status)
      setTaskOutputs(task.id, output)

      // Append to existing log
      const { executionLog } = get()
      set({ executionLog: [...executionLog, entry] })

    } finally {
      set({ isRunning: false })
    }
  },
}))

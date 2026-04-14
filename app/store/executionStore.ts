import { create } from 'zustand'
import type { ExecutionEntry, TaskStatus } from '../types/workflow'
import { useWorkflowStepsStore } from './workflowStepsStore'
import { getTaskType } from '~/taskLibrary'
import { useExecutionHistoryStore } from './executionHistoryStore'

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

function getDuration(startTime: number) {
  return Date.now() - startTime
}

function createExecutionEntry(stage: string, status: TaskStatus, output: any): ExecutionEntry {
  return {
    timestamp: timestamp(),
    level: status === 'success' ? 'LOG' : status === 'warning' ? 'WARN' : 'ERROR',
    stage,
    status,
    output,
  }
}

async function executeOneStep(task: any) {
  const { setTaskStatus, setTaskOutputs } = useWorkflowStepsStore.getState()
  const meta = getTaskType(task.type)

  setTaskStatus(task.id, 'running')
  const { status, output } = await meta.execute(task)
  setTaskStatus(task.id, status)
  setTaskOutputs(task.id, output)

  return { status, output, stage: meta.label }
}

function saveToHistory(startTime: number, entries: ExecutionEntry[]) {
  const tasks = useWorkflowStepsStore.getState().tasks
  const successfulSteps = tasks.filter(t => t.status === 'success').length
  const failedSteps = tasks.filter(t => t.status === 'error').length

  let finalStatus: 'success' | 'failed' | 'partial' = 'success'
  if (failedSteps > 0) {
    finalStatus = 'failed'
  } else if (successfulSteps === tasks.length) {
    finalStatus = 'success'
  } else {
    finalStatus = 'partial'
  }

  const duration = getDuration(startTime)
  const historyStore = useExecutionHistoryStore.getState()
  historyStore.addRun({
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    workflowName: useWorkflowStepsStore.getState().metadata.name,
    actor: 'User', // Placeholder, replace with actual user info if available
    timestamp: new Date().toISOString(),
    displayTime: new Date().toLocaleString(),
    totalSteps: tasks.length,
    successfulSteps,
    failedSteps,
    status: finalStatus,
    duration,
    entries,
  })
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  executionLog: [],
  isRunning: false,

  clearLog: () => set({ executionLog: [] }),

  runWorkflow: async () => {
    const { isRunning } = get()
    if (isRunning) return

    const { tasks } = useWorkflowStepsStore.getState()
    if (tasks.length === 0) return

    set({ isRunning: true })
    const entries: ExecutionEntry[] = []
    const startTime = Date.now()

    try {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
        const meta = getTaskType(task.type)

        // Skip already completed tasks if we want to allow resuming
        if (task.status === 'success') {
          entries.push(createExecutionEntry(meta.label, 'success', task.outputs || { message: 'Already completed' }))
          continue
        }

        const { status, output, stage } = await executeOneStep(task)
        entries.push(createExecutionEntry(stage, status, output))

        if (status === 'error') {
          break
        }
      }

      saveToHistory(startTime, entries)
    } finally {
      set({ executionLog: entries, isRunning: false })
    }
  },

  runNextStep: async () => {
    const { isRunning } = get()
    if (isRunning) return

    const { tasks } = useWorkflowStepsStore.getState()
    if (tasks.length === 0) return

    // Find the first task that is not completed
    const nextTaskIndex = tasks.findIndex(task => task.status !== 'success')
    if (nextTaskIndex === -1) return

    const task = tasks[nextTaskIndex]
    const startTime = Date.now()

    set({ isRunning: true })

    try {
      const { status, output, stage } = await executeOneStep(task)
      const entry = createExecutionEntry(stage, status, output)

      // Append to existing log
      const { executionLog } = get()
      const newLog = [...executionLog, entry]
      set({ executionLog: newLog })

      const remainingTasks = tasks.filter(t => t.status !== 'success' && t.id !== task.id)
      const isComplete = remainingTasks.length === 0 || status === 'error'

      if (isComplete) {
        saveToHistory(startTime, newLog)
      }
    } finally {
      set({ isRunning: false })
    }
  },
}))

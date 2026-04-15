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

async function executeOneStep(task: any, resolvedInputs?: Record<string, any>) {
  const { setTaskStatus, setTaskOutputs } = useWorkflowStepsStore.getState()
  const meta = getTaskType(task.type)

  setTaskStatus(task.id, 'running')

  // Create a task copy with resolved inputs if provided
  const taskWithInputs = resolvedInputs
    ? { ...task, inputs: resolvedInputs }
    : task

  const { status, output } = await meta.execute(taskWithInputs)
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

    const { tasks, getExecutionOrder, getTaskInputsWithConnections } = useWorkflowStepsStore.getState()
    if (tasks.length === 0) return

    // Reset all task statuses before running
    tasks.forEach(task => {
      useWorkflowStepsStore.getState().setTaskStatus(task.id, 'idle')
    })

    set({ isRunning: true })
    const entries: ExecutionEntry[] = []
    const startTime = Date.now()

    try {
      // Get execution order based on dependencies
      const executionOrder = getExecutionOrder()

      for (const taskId of executionOrder) {
        const task = tasks.find(t => t.id === taskId)
        if (!task) continue

        const meta = getTaskType(task.type)

        // Skip already completed tasks if we want to allow resuming
        if (task.status === 'success') {
          entries.push(createExecutionEntry(meta.label, 'success', task.outputs || { message: 'Already completed' }))
          continue
        }

        // Get resolved inputs from connected tasks
        const resolvedInputs = getTaskInputsWithConnections(taskId)

        const { status, output, stage } = await executeOneStep(task, resolvedInputs)
        entries.push(createExecutionEntry(stage, status, output))

        if (status === 'error') {
          break
        }
      }

      saveToHistory(startTime, entries)
    } catch (error) {
      console.error('Workflow execution failed:', error)
      entries.push(createExecutionEntry('Workflow', 'error', { error: String(error) }))
      saveToHistory(startTime, entries)
    } finally {
      set({ executionLog: entries, isRunning: false })
    }
  },

  runNextStep: async () => {
    const { isRunning } = get()
    if (isRunning) return

    const { tasks, getExecutionOrder, getTaskInputsWithConnections } = useWorkflowStepsStore.getState()
    if (tasks.length === 0) return

    // Get execution order
    const executionOrder = getExecutionOrder()

    // Find the next task to execute (first one that's not success or error)
    let nextTaskId: string | undefined
    for (const taskId of executionOrder) {
      const task = tasks.find(t => t.id === taskId)
      if (task && task.status !== 'success' && task.status !== 'error') {
        nextTaskId = taskId
        break
      }
    }

    if (!nextTaskId) return

    const task = tasks.find(t => t.id === nextTaskId)
    if (!task) return

    const startTime = Date.now()

    set({ isRunning: true })

    try {
      // Get resolved inputs from connected tasks
      const resolvedInputs = getTaskInputsWithConnections(nextTaskId)

      const { status, output, stage } = await executeOneStep(task, resolvedInputs)
      const entry = createExecutionEntry(stage, status, output)

      // Append to existing log
      const { executionLog } = get()
      const newLog = [...executionLog, entry]
      set({ executionLog: newLog })

      // Check if workflow is complete (all tasks either success or error)
      const remainingTasks = executionOrder.filter(taskId => {
        const t = tasks.find(t => t.id === taskId)
        return t && t.status !== 'success' && t.status !== 'error'
      })

      const isComplete = remainingTasks.length === 0 || status === 'error'

      if (isComplete) {
        saveToHistory(startTime, newLog)
      }
    } catch (error) {
      console.error('Step execution failed:', error)
      const errorEntry = createExecutionEntry(task.type, 'error', { error: String(error) })
      const { executionLog } = get()
      const newLog = [...executionLog, errorEntry]
      set({ executionLog: newLog })
      saveToHistory(startTime, newLog)
    } finally {
      set({ isRunning: false })
    }
  },
}))
